import { Lock } from 'lucide-react';
import { T } from '../lib/constants.js';
import { useData } from '../hooks/useData.jsx';

export default function Navbar({ onAdmin }) {
  const { settings } = useData();
  const logoUrl  = settings.logo_url;
  const name     = settings.store_name || 'Velora';
  const tagline  = settings.tagline    || 'REFINED . FEMININE . VELORA';

  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:900, background:'rgba(247,245,244,.95)', backdropFilter:'blur(16px)', borderBottom:`1px solid ${T.creamD}` }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:70 }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {logoUrl
            ? <img src={logoUrl} alt={name} style={{ height:40, width:40, borderRadius:'50%', objectFit:'cover' }} />
            : <div style={{ width:38, height:38, background:T.purple, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ color:'white', fontWeight:800, fontSize:16 }}>V</span>
              </div>
          }
          <div>
            <div style={{ fontWeight:800, fontSize:20, color:T.purple, lineHeight:1.1 }}>{name}</div>
            <div style={{ fontSize:9, color:T.gold, letterSpacing:2, fontWeight:700 }}>{tagline}</div>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="deskOnly" style={{ display:'flex', gap:32 }}>
          {['الرئيسية','المجموعات','عن فيلورا','تواصلي معنا'].map(l => (
            <a key={l} href="#" className="navL">{l}</a>
          ))}
        </div>

        {/* Admin button */}
        <button onClick={onAdmin}
          style={{ background:T.purple, color:'white', border:'none', borderRadius:10, padding:'8px 16px', fontFamily:"'Almarai',sans-serif", fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
          <Lock size={14} />لوحة التحكم
        </button>
      </div>
    </nav>
  );
}
