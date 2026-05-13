import { useState, useEffect } from 'react';
import { TrendingUp, Users, Package, ShoppingBag } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { T, yer, STATUS_STYLE, SALES_DATA } from '../../../lib/constants.js';

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="stCard">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ width:48, height:48, borderRadius:14, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', color }}>{icon}</div>
        <div style={{ fontSize:11, color:T.muted, background:T.cream, borderRadius:999, padding:'4px 10px' }}>{sub}</div>
      </div>
      <div style={{ fontSize:28, fontWeight:800, color:T.text, marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:14, color:T.muted }}>{label}</div>
    </div>
  );
}

export default function OverviewTab({ orders, products }) {
  const [visitors] = useState(() => Math.floor(Math.random() * 300) + 850);
  const [liveVisitors, setLiveVisitors] = useState(visitors);

  // Simulate small visitor count changes
  useEffect(() => {
    const t = setInterval(() => {
      setLiveVisitors(v => v + Math.floor(Math.random() * 3) - 1);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const totalRev  = orders.reduce((a, o) => a + (o.price || 0), 0);
  const newOrders = orders.filter(o => o.status === 'جديد').length;

  // Category breakdown
  const catMap = {};
  products.forEach(p => { catMap[p.category||p.cat||'أخرى'] = (catMap[p.category||p.cat||'أخرى']||0) + 1; });
  const catData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20, marginBottom:32 }}>
        <StatCard icon={<TrendingUp size={22}/>} label="إجمالي الإيرادات"   value={yer(totalRev)}               sub="هذا الشهر"        color={T.purple} />
        <StatCard icon={<Users size={22}/>}       label="الزوار المتاحون"   value={liveVisitors.toLocaleString('ar')} sub="● مباشر"     color="#0D47A1"  />
        <StatCard icon={<Package size={22}/>}     label="إجمالي الطلبات"   value={orders.length}                sub="كل الوقت"        color="#1B5E20"  />
        <StatCard icon={<ShoppingBag size={22}/>} label="طلبات جديدة"      value={newOrders}                    sub="بانتظار تأكيد"   color={T.gold}   />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:24, flexWrap:'wrap' }}>
        {/* Sales chart */}
        <div style={{ background:'white', borderRadius:20, padding:24, border:`1px solid ${T.creamD}` }}>
          <h3 style={{ fontWeight:800, marginBottom:20, color:T.text }}>مبيعات الأشهر الستة الماضية</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={SALES_DATA}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.purple} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.purple} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{ fontFamily:"'Almarai',sans-serif", fontSize:12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={v => [yer(v), 'المبيعات']} contentStyle={{ fontFamily:"'Almarai',sans-serif", borderRadius:12, border:'none', boxShadow:'0 8px 24px rgba(0,0,0,.1)' }} />
              <Area type="monotone" dataKey="s" stroke={T.purple} strokeWidth={3} fill="url(#sg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent orders */}
        <div style={{ background:'white', borderRadius:20, padding:24, border:`1px solid ${T.creamD}` }}>
          <h3 style={{ fontWeight:800, marginBottom:16, color:T.text }}>آخر الطلبات</h3>
          {orders.slice(0, 5).map(o => (
            <div key={o.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${T.creamD}` }}>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:T.text }}>{o.customer_name}</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{o.id}</div>
              </div>
              <div style={{ ...STATUS_STYLE[o.status], borderRadius:999, padding:'3px 10px', fontSize:11, fontWeight:700 }}>{o.status}</div>
            </div>
          ))}
          {orders.length === 0 && <div style={{ color:T.muted, textAlign:'center', padding:20, fontSize:14 }}>لا توجد طلبات بعد</div>}
        </div>
      </div>

      {/* Category breakdown */}
      {catData.length > 0 && (
        <div style={{ background:'white', borderRadius:20, padding:24, border:`1px solid ${T.creamD}`, marginTop:24 }}>
          <h3 style={{ fontWeight:800, marginBottom:20, color:T.text }}>توزيع المنتجات حسب الفئة</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={catData}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.creamD} />
              <XAxis dataKey="name" tick={{ fontFamily:"'Almarai',sans-serif", fontSize:12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ fontFamily:"'Almarai',sans-serif", borderRadius:12, border:'none' }} />
              <Bar dataKey="value" fill={T.purple} radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
