import { ShoppingBag, Star } from 'lucide-react';
import { T, yer } from '../lib/constants.js';
import ShoeIcon from './ShoeIcon.jsx';

export default function ProductCard({ product: p, onOrder }) {
  const thumb = p.images?.[0];
  const bg = p.gradient || p.grad || `linear-gradient(145deg,${T.purple},#8B2F8C)`;

  return (
    <div className="pcard" style={{ minWidth:240, width:240, background:'white', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 20px rgba(75,22,76,.08)', flexShrink:0 }}>
      {/* Image */}
      <div style={{ height:200, background:bg, position:'relative', overflow:'hidden' }}>
        {thumb
          ? <img src={thumb} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <ShoeIcon />
        }
        {p.is_new && (
          <div style={{ position:'absolute', top:12, right:12, background:T.gold, color:'white', borderRadius:999, padding:'4px 12px', fontSize:11, fontWeight:700 }}>
            جديد
          </div>
        )}
        {p.category && (
          <div style={{ position:'absolute', bottom:12, left:12, background:'rgba(0,0,0,.4)', backdropFilter:'blur(8px)', color:'white', borderRadius:999, padding:'3px 10px', fontSize:11 }}>
            {p.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding:'16px 16px 20px' }}>
        <div style={{ display:'flex', gap:2, marginBottom:8 }}>
          {[1,2,3,4,5].map(i => <Star key={i} size={11} fill={T.gold} color={T.gold} />)}
        </div>
        <div style={{ fontWeight:800, fontSize:15, color:T.text, marginBottom:6, lineHeight:1.3 }}>{p.name}</div>
        <div style={{ fontSize:12, color:T.muted, marginBottom:12, lineHeight:1.6 }}>
          {(p.description || p.desc || '').substring(0, 55)}{(p.description || p.desc || '').length > 55 ? '...' : ''}
        </div>

        <div style={{ display:'flex', gap:4, marginBottom:14, flexWrap:'wrap' }}>
          {(p.sizes || []).slice(0, 4).map(s => (
            <span key={s} style={{ fontSize:11, color:T.muted, border:`1px solid ${T.creamD}`, borderRadius:6, padding:'2px 7px' }}>{s}</span>
          ))}
          {(p.sizes || []).length > 4 && <span style={{ fontSize:11, color:T.muted }}>+{(p.sizes||[]).length - 4}</span>}
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontWeight:800, fontSize:17, color:T.purple }}>{yer(p.price)}</span>
          <button onClick={() => onOrder(p)}
            style={{ background:T.purple, color:'white', border:'none', borderRadius:10, padding:'9px 14px', fontFamily:"'Almarai',sans-serif", fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:5, transition:'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = T.purpleL; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.purple; }}
          >
            <ShoppingBag size={14} />اطلبي
          </button>
        </div>
      </div>
    </div>
  );
}
