import { ShoppingBag, Crown, Star } from 'lucide-react';
import { T, yer } from '../lib/constants.js';
import ShoeIcon from './ShoeIcon.jsx';

export default function HeroSection({ products, onOrder }) {
  const feat = products[0];
  if (!feat) return null;

  const heroImg = feat.images?.[0];

  return (
    <section style={{ minHeight:'100vh', background:`linear-gradient(135deg,${T.cream} 0%,#EDE4EE 60%,${T.cream} 100%)`, display:'flex', alignItems:'center', paddingTop:70, overflow:'hidden', position:'relative' }}>
      {/* BG orbs */}
      <div style={{ position:'absolute', top:'10%', right:'5%', width:400, height:400, borderRadius:'50%', background:`radial-gradient(circle,rgba(75,22,76,.08) 0%,transparent 70%)`, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'5%', left:'10%', width:250, height:250, borderRadius:'50%', background:`radial-gradient(circle,rgba(201,169,110,.12) 0%,transparent 70%)`, pointerEvents:'none' }} />

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'60px 24px', width:'100%', display:'flex', alignItems:'center', gap:60, flexWrap:'wrap' }}>

        {/* Text */}
        <div style={{ flex:1, minWidth:300 }}>
          <div className="h-badge" style={{ display:'inline-flex', alignItems:'center', gap:8, background:T.purple, color:'white', borderRadius:999, padding:'6px 16px', fontSize:12, fontWeight:700, marginBottom:24, letterSpacing:1 }}>
            <Crown size={14} /> مجموعة 2026 الحصرية
          </div>
          <h1 className="h-title" style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:800, lineHeight:1.15, color:T.text, marginBottom:20 }}>
            أناقة لا<br /><span className="shimmer-gold">تُضاهى</span>
          </h1>
          <p className="h-sub" style={{ fontSize:17, color:T.muted, lineHeight:1.8, marginBottom:36, maxWidth:420 }}>
            كل خطوة قصيدة. أحذية فيلورا مصنوعة بفنٍّ يعكس أنوثتك الراقية، من قلب صنعاء إلى العالم.
          </p>
          <div className="h-cta" style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            <button onClick={() => onOrder(feat)}
              style={{ background:T.purple, color:'white', border:'none', borderRadius:14, padding:'16px 36px', fontFamily:"'Almarai',sans-serif", fontSize:16, fontWeight:700, cursor:'pointer', transition:'all .3s', boxShadow:`0 8px 30px rgba(75,22,76,.35)`, display:'flex', alignItems:'center', gap:8 }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            ><ShoppingBag size={18} />تسوقي الآن</button>
            <button style={{ background:'transparent', color:T.purple, border:`2px solid ${T.purple}`, borderRadius:14, padding:'16px 28px', fontFamily:"'Almarai',sans-serif", fontSize:16, fontWeight:700, cursor:'pointer' }}>
              اكتشفي المجموعة
            </button>
          </div>
          <div style={{ display:'flex', gap:32, marginTop:40, flexWrap:'wrap' }}>
            {[['500+','عميلة راضية'],['50+','تصميم حصري'],['3','سنوات من الأناقة']].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontSize:26, fontWeight:800, color:T.purple }}>{n}</div>
                <div style={{ fontSize:13, color:T.muted }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="h-visual" style={{ flex:1, minWidth:280, position:'relative', height:460 }}>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:340, height:340, borderRadius:'50%', background:`linear-gradient(135deg,${T.purple} 0%,#8B2F8C 100%)`, opacity:.12 }} />
          <div className="float" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:300, height:300, borderRadius:24, background:feat.gradient||feat.grad, overflow:'hidden', boxShadow:`0 30px 70px rgba(75,22,76,.4)` }}>
            {heroImg
              ? <img src={heroImg} alt={feat.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <ShoeIcon />
            }
            <div style={{ position:'absolute', bottom:20, right:20, left:20, background:'rgba(255,255,255,.15)', backdropFilter:'blur(10px)', borderRadius:12, padding:'14px 16px' }}>
              <div style={{ color:'white', fontWeight:800, fontSize:16 }}>{feat.name}</div>
              <div style={{ color:'rgba(255,255,255,.8)', fontSize:14, marginTop:4 }}>{yer(feat.price)}</div>
            </div>
            {feat.is_new && <div style={{ position:'absolute', top:16, right:16, background:T.gold, color:'white', borderRadius:999, padding:'4px 10px', fontSize:11, fontWeight:700 }}>جديد</div>}
          </div>

          {/* Floating badges */}
          <div style={{ position:'absolute', top:20, right:0, background:'white', borderRadius:16, padding:'12px 16px', boxShadow:'0 8px 30px rgba(0,0,0,.1)', minWidth:130 }}>
            <div style={{ fontSize:11, color:T.muted, marginBottom:4 }}>أعلى المبيعات</div>
            <div style={{ fontWeight:800, fontSize:13, color:T.text }}>{feat.name.split('—')[0].trim()}</div>
            <div style={{ display:'flex', gap:2, marginTop:4 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={T.gold} color={T.gold} />)}
            </div>
          </div>
          <div style={{ position:'absolute', bottom:30, left:0, background:'white', borderRadius:16, padding:'12px 16px', boxShadow:'0 8px 30px rgba(0,0,0,.1)' }}>
            <div style={{ fontSize:11, color:T.muted }}>تسليم سريع</div>
            <div style={{ fontWeight:800, fontSize:13, color:T.purple, marginTop:2 }}>📦 صنعاء وجميع المحافظات</div>
          </div>
        </div>
      </div>
    </section>
  );
}
