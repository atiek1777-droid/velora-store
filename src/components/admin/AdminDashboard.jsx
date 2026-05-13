import { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Menu, X } from 'lucide-react';
import { T } from '../../lib/constants.js';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useData } from '../../hooks/useData.jsx';
import OverviewTab from './tabs/OverviewTab.jsx';
import ProductsTab from './tabs/ProductsTab.jsx';
import OrdersTab from './tabs/OrdersTab.jsx';
import SettingsTab from './tabs/SettingsTab.jsx';

const TABS = [
  { id: 'overview',  label: 'نظرة عامة',  icon: LayoutDashboard },
  { id: 'products',  label: 'المنتجات',    icon: Package          },
  { id: 'orders',    label: 'الطلبات',     icon: ShoppingBag      },
  { id: 'settings',  label: 'الإعدادات',   icon: Settings         },
];

export default function AdminDashboard({ onBack }) {
  const { signOut, profile, role } = useAuth();
  const { orders, products, settings } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onBack();
  };

  const newOrderCount = orders.filter(o => o.status === 'جديد').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: T.cream, direction: 'rtl' }}>

      {/* Sidebar */}
      <aside className="adminSidebar" style={{ width: 240, background: `linear-gradient(180deg,${T.purpleD} 0%,${T.purple} 100%)`, display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 800 }}>

        {/* Brand */}
        <div style={{ padding: '28px 20px 24px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          {settings.logo_url
            ? <img src={settings.logo_url} alt="logo" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', marginBottom: 10 }} />
            : <div style={{ width: 44, height: 44, background: T.gold, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: T.purpleD, fontSize: 20, marginBottom: 10 }}>V</div>
          }
          <div style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>{settings.store_name || 'Velora'}</div>
          <div style={{ color: T.gold, fontSize: 10, letterSpacing: 2, marginTop: 2 }}>لوحة التحكم</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`sbItem${activeTab === id ? ' on' : ''}`}
              onClick={() => setActiveTab(id)}
              style={{ width: '100%', background: 'none', border: 'none', textAlign: 'right' }}>
              <Icon size={18} />
              {label}
              {id === 'orders' && newOrderCount > 0 && (
                <span style={{ marginRight: 'auto', background: T.gold, color: T.purpleD, borderRadius: 999, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                  {newOrderCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 12, marginBottom: 4 }}>{profile?.full_name || 'مشرف'}</div>
          <div style={{ color: T.gold, fontSize: 11, marginBottom: 12 }}>{role}</div>
          <button onClick={handleSignOut}
            style={{ width: '100%', background: 'rgba(255,255,255,.1)', color: 'white', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, padding: '10px', fontFamily: "'Almarai',sans-serif", fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <LogOut size={15} />تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginRight: 240, padding: '32px 32px 32px', minHeight: '100vh', overflowY: 'auto' }}>

        {/* Mobile header */}
        <div style={{ display: 'none' }} className="mobileAdminHeader">
          <button onClick={() => setMobileOpen(v => !v)} style={{ background: T.purple, color: 'white', border: 'none', borderRadius: 10, padding: 10, cursor: 'pointer' }}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Page header */}
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 26, color: T.text }}>
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
            <p style={{ color: T.muted, fontSize: 14, marginTop: 4 }}>مرحباً بك في لوحة تحكم فيلورا</p>
          </div>
          <button onClick={onBack}
            style={{ background: 'white', color: T.purple, border: `2px solid ${T.purple}`, borderRadius: 12, padding: '10px 20px', fontFamily: "'Almarai',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            ← العودة للمتجر
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && <OverviewTab orders={orders} products={products} />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'orders'   && <OrdersTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
}
