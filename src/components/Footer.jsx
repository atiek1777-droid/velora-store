import { Phone, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { T } from '../lib/constants.js';
import { useData } from '../hooks/useData.jsx';

export default function Footer() {
  const { settings } = useData();
  const wa = settings.whatsapp || '967781885252';

  return (
    <footer style={{ background:T.purpleD, color:'rgba(255,255,255,.7)', padding:'60px 24px 0' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>

        {/* Columns */}
        <div style={{ display:'flex', gap:48, flexWrap:'wrap', marginBottom:48 }}>

          {/* Brand */}
          <div style={{ flex:2, minWidth:220 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              {settings.logo_url
                ? <img src={settings.logo_url} alt="logo" style={{ width:40, height:40, borderRadius:'50%', objectFit:'cover' }} />
                : <div style={{ width:40, height:40, background:T.gold, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:T.purpleD, fontSize:18 }}>V</div>
              }
              <div>
                <div style={{ color:'white', fontWeight:800, fontSize:22 }}>{settings.store_name||'Velora'}</div>
                <div style={{ fontSize:10, color:T.gold, letterSpacing:2 }}>{settings.tagline||'REFINED . FEMININE . VELORA'}</div>
              </div>
            </div>
            <p style={{ fontSize:14, lineHeight:1.8, maxWidth:280 }}>{settings.description||'أحذية فيلورا — حيث تلتقي الأناقة بالجمال اليمني الأصيل.'}</p>
          </div>

          {/* Contact */}
          <div style={{ flex:1, minWidth:160 }}>
            <div style={{ color:'white', fontWeight:800, fontSize:16, marginBottom:16 }}>تواصلي معنا</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10, fontSize:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}><Phone size={14} />{`+${wa}`}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}><MessageCircle size={14} />واتساب متاح 24/7</div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}><Instagram size={14} />{settings.instagram||'@velora.sho'}</div>
            </div>
          </div>

          {/* Social */}
          <div style={{ flex:1, minWidth:160 }}>
            <div style={{ color:'white', fontWeight:800, fontSize:16, marginBottom:16 }}>تابعينا</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10, fontSize:14 }}>
              <a href={`https://instagram.com/${(settings.instagram||'').replace('@','')}`} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,.7)', textDecoration:'none' }}><Instagram size={14} />{settings.instagram||'@velora.sho'}</a>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ fontSize:14 }}>TikTok</span>{settings.tiktok||'@velora258'}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}><Facebook size={14} />{settings.facebook||'Velora Yemen'}</div>
            </div>
          </div>
        </div>

        {/* Velora copyright */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,.1)', paddingTop:24, paddingBottom:24, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12, fontSize:13 }}>
          <span>© 2026 Velora — جميع الحقوق محفوظة</span>
          <span>صُنع بـ ♥ في صنعاء، اليمن</span>
        </div>
      </div>

      {/* ─── Developer Credit ──────────────────────────────────────────────────── */}
      <div className="dev-credit-wrap">
        <div className="dev-sep" />
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, direction:'rtl' }}>
          <span className="dev-credit-line">
            بكل فخر، تم التطوير بواسطة الخبير التقني: عتيق الجذوة
          </span>
          <span style={{ display:'inline-block', lineHeight:2 }}>
            <a className="dev-phone-link l2" href="https://wa.me/967779339333" target="_blank" rel="noreferrer">
              📞 رقم التواصل: ‎+967 779 339 333
            </a>
          </span>
          <span className="dev-credit-line l3">
            جميع الحقوق محفوظة ©
          </span>
        </div>
        <div className="dev-sep" style={{ marginTop:16 }} />
      </div>
    </footer>
  );
}
