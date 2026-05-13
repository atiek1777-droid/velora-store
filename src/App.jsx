import { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import { DataProvider, useData } from './hooks/useData.jsx';
import GlobalStyles from './GlobalStyles.jsx';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import Carousel from './components/Carousel.jsx';
import Footer from './components/Footer.jsx';
import OrderModal from './components/OrderModal.jsx';
import AdminLogin from './components/admin/AdminLogin.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';

function StoreFront({ onAdmin }) {
  const { products, dataLoading } = useData();
  const [orderProduct, setOrderProduct] = useState(null);

  if (dataLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F5F4' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid rgba(75,22,76,.2)', borderTopColor: '#4B164C', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ color: '#4B164C', fontWeight: 700, fontSize: 16 }}>جاري تحميل فيلورا...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar onAdmin={onAdmin} />
      <HeroSection products={products} onOrder={setOrderProduct} />
      <Carousel products={products} onOrder={setOrderProduct} />
      <Footer />
      {orderProduct && <OrderModal product={orderProduct} onClose={() => setOrderProduct(null)} />}
    </>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [view, setView] = useState('store'); // 'store' | 'login' | 'admin'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F5F4' }}>
        <div style={{ width: 48, height: 48, border: '4px solid rgba(75,22,76,.2)', borderTopColor: '#4B164C', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (view === 'login') {
    if (isAuthenticated) {
      return <AdminDashboard onBack={() => setView('store')} />;
    }
    return <AdminLogin onBack={() => setView('store')} />;
  }

  if (view === 'admin') {
    if (!isAuthenticated) {
      return <AdminLogin onBack={() => setView('store')} />;
    }
    return <AdminDashboard onBack={() => setView('store')} />;
  }

  return <StoreFront onAdmin={() => isAuthenticated ? setView('admin') : setView('login')} />;
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <GlobalStyles />
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
