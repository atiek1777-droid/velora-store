import { useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { T, yer, STATUSES, STATUS_STYLE } from '../../../lib/constants.js';
import { useData } from '../../../hooks/useData.jsx';
import { useAuth } from '../../../hooks/useAuth.jsx';

export default function OrdersTab() {
  const { orders, updateOrderStatus, settings } = useData();
  const { isAdmin, isSupervisor } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('الكل');

  const wa = settings.whatsapp || '967781885252';

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchQ = !q || o.id.toLowerCase().includes(q) || (o.customer_name||'').toLowerCase().includes(q) || (o.product_name||'').toLowerCase().includes(q);
    const matchF = filter === 'الكل' || o.status === filter;
    return matchQ && matchF;
  });

  const contactCustomer = (o) => {
    const msg = `مرحباً ${o.customer_name||''} 👋\nبخصوص طلبكِ رقم: *${o.id}*\nالمنتج: ${o.product_name} — المقاس: ${o.size}\nتم تحديث حالة طلبكِ إلى: *${o.status}* 🎉\n\nشكراً لثقتكِ بـ *فيلورا* ✨`;
    window.open(`https://wa.me/${o.customer_phone||wa}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ background:'white', borderRadius:20, border:`1px solid ${T.creamD}`, overflow:'hidden' }}>
      {/* Toolbar */}
      <div style={{ padding:'20px 24px', borderBottom:`1px solid ${T.creamD}`, display:'flex', gap:16, flexWrap:'wrap', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontWeight:800, fontSize:18, color:T.text }}>الطلبات ({orders.length})</div>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          {/* Search */}
          <div style={{ position:'relative' }}>
            <Search size={16} style={{ position:'absolute', top:'50%', right:12, transform:'translateY(-50%)', color:T.muted }} />
            <input
              placeholder="بحث بالاسم أو الرقم..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ border:`1.5px solid ${T.creamD}`, borderRadius:10, padding:'9px 38px 9px 16px', fontFamily:"'Almarai',sans-serif", fontSize:14, outline:'none', width:220 }}
            />
          </div>
          {/* Status filter */}
          <div style={{ display:'flex', gap:6 }}>
            {['الكل', ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                style={{ border:`1.5px solid ${filter===s ? T.purple : T.creamD}`, background:filter===s ? T.purple : 'white', color:filter===s ? 'white' : T.text, borderRadius:999, padding:'6px 14px', fontFamily:"'Almarai',sans-serif", fontSize:12, fontWeight:600, cursor:'pointer', transition:'all .2s' }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
          <thead style={{ background:T.cream }}>
            <tr>
              {['رقم الطلب','العميلة','المنتج','المقاس','السعر','الدفع','التاريخ','الحالة','إجراء'].map(h => (
                <th key={h} style={{ padding:'12px 16px', textAlign:'right', fontWeight:700, color:T.muted, fontSize:12, whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} style={{ borderBottom:`1px solid ${T.creamD}` }}>
                <td style={{ padding:'14px 16px', fontWeight:700, color:T.purple, fontSize:12, whiteSpace:'nowrap' }}>{o.id}</td>
                <td style={{ padding:'14px 16px' }}>
                  <div style={{ fontWeight:700 }}>{o.customer_name||'—'}</div>
                  <div style={{ fontSize:11, color:T.muted }}>{o.customer_phone||''}</div>
                </td>
                <td style={{ padding:'14px 16px', color:T.muted, maxWidth:160 }}>{o.product_name}</td>
                <td style={{ padding:'14px 16px', textAlign:'center' }}>{o.size}</td>
                <td style={{ padding:'14px 16px', fontWeight:700, color:T.purple, whiteSpace:'nowrap' }}>{yer(o.price)}</td>
                <td style={{ padding:'14px 16px', color:T.muted }}>{o.wallet}</td>
                <td style={{ padding:'14px 16px', color:T.muted, fontSize:12 }}>{o.created_at?.split('T')[0]||o.date||''}</td>
                <td style={{ padding:'14px 16px' }}>
                  {isSupervisor ? (
                    <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}
                      style={{ border:`1px solid ${T.creamD}`, borderRadius:8, padding:'6px 10px', fontSize:12, fontFamily:"'Almarai',sans-serif", cursor:'pointer', background:'white' }}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  ) : (
                    <span style={{ ...STATUS_STYLE[o.status], borderRadius:999, padding:'4px 12px', fontSize:12, fontWeight:700 }}>{o.status}</span>
                  )}
                </td>
                <td style={{ padding:'14px 16px' }}>
                  <button onClick={() => contactCustomer(o)}
                    style={{ background:'#25D366', color:'white', border:'none', borderRadius:8, padding:'7px 12px', cursor:'pointer', display:'flex', alignItems:'center', gap:5, fontSize:12, fontFamily:"'Almarai',sans-serif" }}>
                    <MessageCircle size={13} />تواصل
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding:40, textAlign:'center', color:T.muted }}>لا توجد نتائج</div>
        )}
      </div>
    </div>
  );
}
