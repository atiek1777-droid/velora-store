import { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, Image } from 'lucide-react';
import { T, yer } from '../../../lib/constants.js';
import { useData } from '../../../hooks/useData.jsx';
import { useAuth } from '../../../hooks/useAuth.jsx';
import ShoeIcon from '../../ShoeIcon.jsx';

const EMPTY_FORM = { name:'', description:'', price:'', stock:'', category:'', sizes:[36,37,38,39,40,41], is_new:false, gradient:`linear-gradient(145deg,#4B164C,#8B2F8C)` };

export default function ProductsTab() {
  const { products, addProduct, updateProduct, deleteProduct, uploadProductImages, removeProductImage } = useData();
  const { isEditor } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [saving,   setSaving]   = useState(false);
  const [uploading,setUploading]= useState(false);
  const [error,    setError]    = useState('');
  const fileRef = useRef(null);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); setError(''); };
  const openEdit= (p) => {
    setForm({ name:p.name, description:p.description||p.desc||'', price:p.price, stock:p.stock, category:p.category||p.cat||'', sizes:p.sizes||[36,37,38,39,40,41], is_new:p.is_new||false, gradient:p.gradient||p.grad||EMPTY_FORM.gradient });
    setEditId(p.id); setShowForm(true); setError('');
  };
  const cancel  = () => { setShowForm(false); setEditId(null); };

  const save = async () => {
    if (!form.name || !form.price) { setError('الاسم والسعر مطلوبان'); return; }
    setSaving(true); setError('');
    const payload = { ...form, price: +form.price, stock: +form.stock };
    const res = editId ? await updateProduct(editId, payload) : await addProduct(payload);
    if (!res.ok) setError(res.error || 'حدث خطأ');
    else cancel();
    setSaving(false);
  };

  const handleImageUpload = async (productId, e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    await uploadProductImages(productId, files);
    setUploading(false);
    e.target.value = '';
  };

  const toggleSize = (s) => {
    setForm(f => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s].sort() }));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <span style={{ color:T.muted, fontSize:15 }}>{products.length} منتج في المخزن</span>
        {isEditor && (
          <button onClick={openAdd}
            style={{ background:T.purple, color:'white', border:'none', borderRadius:12, padding:'12px 24px', fontFamily:"'Almarai',sans-serif", fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
            <Plus size={18} />إضافة منتج جديد
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && isEditor && (
        <div style={{ background:'white', borderRadius:20, padding:28, border:`2px solid ${T.purple}`, marginBottom:28 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontWeight:800, fontSize:18, color:T.text }}>{editId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
            <button onClick={cancel} style={{ background:T.cream, border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><X size={16}/></button>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[
              { label:'اسم المنتج *', key:'name',        type:'text'   },
              { label:'الفئة',        key:'category',    type:'text'   },
              { label:'السعر (﷼) *', key:'price',       type:'number' },
              { label:'المخزون',      key:'stock',       type:'number' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label style={{ fontSize:12, color:T.muted, marginBottom:5, display:'block' }}>{label}</label>
                <input type={type} placeholder={label} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width:'100%', borderRadius:10, border:`1.5px solid ${T.creamD}`, padding:'12px 14px', fontSize:14, fontFamily:"'Almarai',sans-serif", direction:'rtl', outline:'none' }}
                  onFocus={e => e.target.style.borderColor = T.purple}
                  onBlur={e  => e.target.style.borderColor = T.creamD}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop:16 }}>
            <label style={{ fontSize:12, color:T.muted, marginBottom:5, display:'block' }}>الوصف</label>
            <textarea placeholder="وصف المنتج..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              style={{ width:'100%', borderRadius:10, border:`1.5px solid ${T.creamD}`, padding:'12px 14px', fontSize:14, fontFamily:"'Almarai',sans-serif", direction:'rtl', outline:'none', resize:'vertical' }} />
          </div>

          {/* Sizes */}
          <div style={{ marginTop:16 }}>
            <label style={{ fontSize:12, color:T.muted, marginBottom:8, display:'block' }}>المقاسات المتاحة</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {[35,36,37,38,39,40,41,42].map(s => (
                <button key={s} onClick={() => toggleSize(s)}
                  style={{ border:`2px solid ${form.sizes.includes(s) ? T.purple : T.creamD}`, background:form.sizes.includes(s) ? T.purple : 'white', color:form.sizes.includes(s) ? 'white' : T.text, borderRadius:8, padding:'8px 14px', cursor:'pointer', fontFamily:"'Almarai',sans-serif", fontWeight:700, fontSize:14, transition:'all .15s' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Flags */}
          <div style={{ display:'flex', gap:20, marginTop:16, alignItems:'center' }}>
            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:14 }}>
              <input type="checkbox" checked={form.is_new} onChange={e => setForm(f => ({ ...f, is_new: e.target.checked }))} />
              وسم "جديد"
            </label>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:12, color:T.muted, marginBottom:4, display:'block' }}>لون الخلفية (CSS gradient)</label>
              <input value={form.gradient} onChange={e => setForm(f => ({ ...f, gradient: e.target.value }))}
                style={{ width:'100%', borderRadius:8, border:`1px solid ${T.creamD}`, padding:'8px 12px', fontSize:12, fontFamily:'monospace', direction:'ltr', outline:'none' }} />
            </div>
          </div>

          {error && <div style={{ color:'#C62828', background:'#FFEBEE', borderRadius:10, padding:'10px 14px', fontSize:13, marginTop:14 }}>{error}</div>}

          <div style={{ display:'flex', gap:12, marginTop:20 }}>
            <button onClick={save} disabled={saving}
              style={{ background:saving ? '#ccc' : T.purple, color:'white', border:'none', borderRadius:12, padding:'12px 28px', fontFamily:"'Almarai',sans-serif", fontSize:15, fontWeight:700, cursor:saving ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', gap:8 }}>
              {saving
                ? <span style={{ width:18,height:18,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 1s linear infinite',display:'inline-block' }}/>
                : <><Save size={16}/>{editId ? 'حفظ التعديلات' : 'إضافة المنتج'}</>
              }
            </button>
            <button onClick={cancel} style={{ background:T.cream, color:T.text, border:'none', borderRadius:12, padding:'12px 24px', fontFamily:"'Almarai',sans-serif", fontSize:15, cursor:'pointer' }}>إلغاء</button>
          </div>
        </div>
      )}

      {/* Product grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
        {products.map(p => {
          const thumb = p.images?.[0];
          return (
            <div key={p.id} style={{ background:'white', borderRadius:16, overflow:'hidden', border:`1px solid ${T.creamD}`, transition:'box-shadow .2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 30px rgba(75,22,76,.12)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>

              {/* Image area */}
              <div style={{ height:130, background:p.gradient||p.grad, position:'relative', overflow:'hidden' }}>
                {thumb
                  ? <img src={thumb} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <ShoeIcon />
                }
                {p.is_new && <div style={{ position:'absolute', top:10, right:10, background:T.gold, color:'white', borderRadius:999, padding:'3px 10px', fontSize:11, fontWeight:700 }}>جديد</div>}
                <div style={{ position:'absolute', bottom:8, left:8, fontSize:11, color:'rgba(255,255,255,.8)', background:'rgba(0,0,0,.3)', borderRadius:999, padding:'2px 8px' }}>
                  {(p.images||[]).length} صورة
                </div>
              </div>

              {/* Thumbnails row */}
              {(p.images||[]).length > 0 && (
                <div style={{ display:'flex', gap:4, padding:'8px 12px', background:T.cream, flexWrap:'wrap' }}>
                  {(p.images||[]).map((url, i) => (
                    <div key={i} style={{ position:'relative' }}>
                      <img src={url} alt="" style={{ width:36, height:36, objectFit:'cover', borderRadius:6, border:`1px solid ${T.creamD}` }} />
                      {isEditor && (
                        <button onClick={() => removeProductImage(p.id, url)}
                          style={{ position:'absolute', top:-4, right:-4, background:'#C62828', color:'white', border:'none', borderRadius:'50%', width:16, height:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10 }}>
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ padding:16 }}>
                <div style={{ fontWeight:800, fontSize:15, color:T.text, marginBottom:4 }}>{p.name}</div>
                <div style={{ fontSize:12, color:T.muted, marginBottom:12, lineHeight:1.5 }}>
                  {(p.description||p.desc||'').substring(0, 60)}...
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:isEditor ? 12 : 0 }}>
                  <span style={{ fontWeight:800, fontSize:16, color:T.purple }}>{yer(p.price)}</span>
                  <span style={{ fontSize:12, color:p.stock>10 ? '#1B5E20' : '#B71C1C', background:p.stock>10 ? '#E8F5E9' : '#FFEBEE', borderRadius:999, padding:'3px 10px', fontWeight:700 }}>
                    مخزون: {p.stock}
                  </span>
                </div>

                {isEditor && (
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => openEdit(p)}
                      style={{ flex:1, background:T.cream, color:T.purple, border:`1px solid ${T.purple}`, borderRadius:10, padding:'9px', fontFamily:"'Almarai',sans-serif", fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                      <Edit2 size={14}/>تعديل
                    </button>
                    {/* Upload images */}
                    <label
                      style={{ background:T.cream, color:'#1B5E20', border:'1px solid #1B5E20', borderRadius:10, padding:'9px 12px', cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontSize:13 }}
                      title="رفع صور">
                      {uploading ? <span style={{ width:14,height:14,border:'2px solid rgba(0,0,0,.2)',borderTopColor:'#1B5E20',borderRadius:'50%',animation:'spin 1s linear infinite',display:'inline-block' }}/> : <Upload size={14}/>}
                      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e => handleImageUpload(p.id, e)} />
                    </label>
                    <button onClick={() => deleteProduct(p.id)}
                      style={{ background:'#FFEBEE', color:'#C62828', border:'none', borderRadius:10, padding:'9px 12px', cursor:'pointer', display:'flex', alignItems:'center' }}>
                      <Trash2 size={15}/>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign:'center', padding:60, color:T.muted, fontSize:16 }}>
          لا توجد منتجات بعد — ابدأي بإضافة أول منتج 👟
        </div>
      )}
    </div>
  );
}
