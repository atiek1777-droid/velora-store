import { useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { T } from '../lib/constants.js';
import ProductCard from './ProductCard.jsx';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add('vis'); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export { useReveal };

export default function Carousel({ products, onOrder }) {
  const trackRef = useRef(null);
  const sectionRef = useReveal();

  const scroll = (dir) => {
    if (trackRef.current) trackRef.current.scrollBy({ left: dir * 260, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="reveal" style={{ padding:'80px 0', background:T.cream }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:40 }}>
          <div>
            <div style={{ fontSize:12, color:T.gold, fontWeight:700, letterSpacing:2, marginBottom:8 }}>✦ أحدث الوصولات</div>
            <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.8rem)', fontWeight:800, color:T.text }}>المجموعة الجديدة</h2>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            {[[ChevronRight, -1],[ChevronLeft, 1]].map(([Ic, dir], i) => (
              <button key={i} onClick={() => scroll(dir)}
                style={{ width:44, height:44, borderRadius:'50%', border:`2px solid ${T.purple}`, background:'white', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:T.purple, transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = T.purple; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white';  e.currentTarget.style.color = T.purple; }}
              ><Ic size={20} /></button>
            ))}
          </div>
        </div>

        <div ref={trackRef} style={{ display:'flex', gap:24, overflowX:'auto', paddingBottom:16, scrollbarWidth:'none', msOverflowStyle:'none' }}>
          {products.map(p => <ProductCard key={p.id} product={p} onOrder={onOrder} />)}
        </div>
      </div>
    </section>
  );
}
