import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, SUPABASE_READY, uploadFile, deleteFile } from '../lib/supabase.js';
import {
  MOCK_PRODUCTS, MOCK_ORDERS, MOCK_SETTINGS,
  generateOrderId,
} from '../lib/constants.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [settings, setSettings] = useState(MOCK_SETTINGS);
  const [dataLoading, setDataLoading] = useState(true);

  // ── Fetch all on mount ───────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setDataLoading(true);
    if (!SUPABASE_READY) {
      setProducts(MOCK_PRODUCTS);
      setOrders(MOCK_ORDERS);
      setSettings(MOCK_SETTINGS);
      setDataLoading(false);
      return;
    }
    const [{ data: prods }, { data: ords }, { data: sets }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('site_settings').select('key,value'),
    ]);
    if (prods) setProducts(prods);
    if (ords)  setOrders(ords);
    if (sets) {
      const map = {};
      sets.forEach(({ key, value }) => { map[key] = value; });
      setSettings(prev => ({ ...prev, ...map }));
    }
    setDataLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Realtime order subscription ──────────────────────────────────────────────
  useEffect(() => {
    if (!SUPABASE_READY) return;
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        supabase.from('orders').select('*').order('created_at', { ascending: false })
          .then(({ data }) => { if (data) setOrders(data); });
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  // ── Products ─────────────────────────────────────────────────────────────────
  const addProduct = async (product) => {
    if (!SUPABASE_READY) {
      const p = { ...product, id: Date.now(), images: product.images || [], gradient: product.gradient || `linear-gradient(145deg,#4B164C,#8B2F8C)` };
      setProducts(prev => [p, ...prev]);
      return { ok: true, data: p };
    }
    const { data, error } = await supabase.from('products').insert(product).select().single();
    if (error) return { ok: false, error: error.message };
    setProducts(prev => [data, ...prev]);
    return { ok: true, data };
  };

  const updateProduct = async (id, updates) => {
    if (!SUPABASE_READY) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      return { ok: true };
    }
    const { data, error } = await supabase.from('products').update({ ...updates, updated_at: new Date() }).eq('id', id).select().single();
    if (error) return { ok: false, error: error.message };
    setProducts(prev => prev.map(p => p.id === id ? data : p));
    return { ok: true, data };
  };

  const deleteProduct = async (id) => {
    if (!SUPABASE_READY) {
      setProducts(prev => prev.filter(p => p.id !== id));
      return { ok: true };
    }
    // Also delete images from storage
    const product = products.find(p => p.id === id);
    if (product?.images?.length) {
      await Promise.all(product.images.map(url => deleteFile(url)));
    }
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    setProducts(prev => prev.filter(p => p.id !== id));
    return { ok: true };
  };

  /** Upload up to 5 images and attach to product */
  const uploadProductImages = async (productId, files) => {
    if (!SUPABASE_READY) return { ok: true, urls: [] };
    const product = products.find(p => p.id === productId);
    const existing = product?.images || [];
    const remaining = 5 - existing.length;
    const toUpload = Array.from(files).slice(0, remaining);
    const urls = await Promise.all(toUpload.map(f => uploadFile(f, 'products')));
    const valid = urls.filter(Boolean);
    const merged = [...existing, ...valid];
    return updateProduct(productId, { images: merged });
  };

  const removeProductImage = async (productId, imageUrl) => {
    await deleteFile(imageUrl);
    const product = products.find(p => p.id === productId);
    const images = (product?.images || []).filter(u => u !== imageUrl);
    return updateProduct(productId, { images });
  };

  // ── Orders ────────────────────────────────────────────────────────────────────
  const addOrder = async (order) => {
    const newOrder = { ...order, id: order.id || generateOrderId(), created_at: new Date().toISOString() };
    if (!SUPABASE_READY) {
      setOrders(prev => [newOrder, ...prev]);
      return { ok: true, data: newOrder };
    }
    const { data, error } = await supabase.from('orders').insert(newOrder).select().single();
    if (error) return { ok: false, error: error.message };
    setOrders(prev => [data, ...prev]);
    return { ok: true, data };
  };

  const updateOrderStatus = async (id, status) => {
    if (!SUPABASE_READY) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      return { ok: true };
    }
    const { error } = await supabase.from('orders').update({ status, updated_at: new Date() }).eq('id', id);
    if (error) return { ok: false, error: error.message };
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    return { ok: true };
  };

  // ── Site Settings ─────────────────────────────────────────────────────────────
  const saveSetting = async (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (!SUPABASE_READY) return { ok: true };
    const { error } = await supabase.from('site_settings').upsert({ key, value, updated_at: new Date() });
    return error ? { ok: false, error: error.message } : { ok: true };
  };

  const saveAllSettings = async (map) => {
    setSettings(prev => ({ ...prev, ...map }));
    if (!SUPABASE_READY) return { ok: true };
    const rows = Object.entries(map).map(([key, value]) => ({ key, value, updated_at: new Date() }));
    const { error } = await supabase.from('site_settings').upsert(rows);
    return error ? { ok: false, error: error.message } : { ok: true };
  };

  const uploadLogo = async (file) => {
    if (!SUPABASE_READY) return { ok: false, error: 'يتطلب Supabase' };
    const url = await uploadFile(file, 'logos');
    if (!url) return { ok: false, error: 'فشل الرفع' };
    await saveSetting('logo_url', url);
    return { ok: true, url };
  };

  return (
    <DataContext.Provider value={{
      products, orders, settings, dataLoading, loadAll,
      addProduct, updateProduct, deleteProduct, uploadProductImages, removeProductImage,
      addOrder, updateOrderStatus,
      saveSetting, saveAllSettings, uploadLogo,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
