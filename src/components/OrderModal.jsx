import { useState } from 'react';
import { X, ArrowLeft, MessageCircle } from 'lucide-react';
import { T, WALLETS, yer, generateOrderId } from '../lib/constants.js';
import { useData } from '../hooks/useData.jsx';
import ShoeIcon from './ShoeIcon.jsx';

export default function OrderModal({ product, onClose }) {
  const { settings, addOrder } = useData();
  const [step,   setStep]   = useState(1);
  const [size,   setSize]   = useState(null);
  const [wallet, setWallet] = useState(null);
  const [name,   setName]   = useState('');
  const [phone,  setPhone]  = useState('');
  const [sending, setSending] = useState(false);

  if (!product) return null;

  const wa     = settings.whatsapp || '967781885252';
  const thumb  = product.images?.[0];
  const bg     = product.gradient || product.grad || `linear-gradient(145deg,${T.purple},#8B2F8C)`;

  const handleSend = async () => {
    setSending(true);
    const orderId = generateOrderId();
    const msg = `🛍️ *طلب جديد من فيلورا*\n━━━━━━━━━━━━━━━━━━\n👠 *المنتج:* ${product.name}\n📐 *المقاس:* ${size}\n💰 *السعر:* ${yer(product.price)}\n💳 *طريقة الدفع:* ${wallet}\n👤 *الاسم:* ${name||'—'}\n📞 *الهاتف:* ${phone||'—'}\n📋 *رقم الطلب:* ${orderId}\n━━━━━━━━━━━━━━━━━━\nيرجى تأكيد الطلب 🙏\n\nشكراً لاختياركِ *فيلورا* ✨`;
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank');
    await addOrder({
      id: orderId,
      product_id: product.id,
      product_name: product.name,
      size, price: product.price, wallet,
      customer_name: name || 'عميلة', customer_phone: phone || '—',
      status: 'جديد',
    });
    setSending(false);
    onClose();
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(26,10,27,.6)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
    >
      <div style={{ background:'white', borderRadius:24, width:'100%', maxWidth:500, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 40px 100px rgba(0,0,0,.3)' }}>

        {/* Header */}
        <div style={{ background:bg, borderRadius:'24px 24px 0 0', padding:'28px 28px 24px', position:'relative', overflow:'hidden' }}>
          {thumb
            ? <img src={thumb} alt={product.name} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:.4 }} />
            : <ShoeIcon />
          }
          <button onClick={onClose} style={{ position:'absolute', top:16, left:16, background:'rgba(255,255,255,.2)', border:'none', borderRadius:'50%', width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'white' }}>
            <X size={18} />
          </button>
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ color:'rgba(255,255,255,.7)', fontSize:12, marginBottom:4 }}>أضيفت إلى طلبك</div>
            <div style={{ color:'white', fontWeight:800, fontSize:20 }}>{product.name}</div>
            <div style={{ color:'rgba(255,255,255,.9)', fontSize:22, fontWeight:800, marginTop:4 }}>{yer(product.price)}</div>
          </div>
        </div>

        <div style={{ padding:28 }}>

          {/* Step 1 — Size + Info */}
          {step === 1 && (
            <>
              <h3 style={{ fontWeight:800, fontSize:18, marginBottom:20, color:T.text }}>اختاري المقاس</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:28 }}>
                {(product.sizes||[36,37,38,39,40,41]).map(s => (
                  <button key={s} className={`szBtn${size === s ? ' on' : ''}`} onClick={() => setSize(s)}>{s}</button>
                ))}
              </div>

              <h3 style={{ fontWeight:800, fontSize:18, marginBottom:16, color:T.text }}>بياناتك</h3>
              {[
                { p:'اسمك الكريم', v:name,  s:setName,  t:'text' },
                { p:'رقم الهاتف',  v:phone, s:setPhone, t:'tel'  },
              ].map(({ p, v, s, t }) => (
                <input key={p} type={t} placeholder={p} value={v} onChange={e => s(e.target.value)}
                  style={{ width:'100%', borderRadius:12, border:`1.5px solid ${T.creamD}`, padding:'13px 16px', fontSize:15, fontFamily:"'Almarai',sans-serif", marginBottom:12, outline:'none', direction:'rtl' }}
                  onFocus={e  => e.target.style.borderColor = T.purple}
                  onBlur={e   => e.target.style.borderColor = T.creamD}
                />
              ))}

              <button disabled={!size} onClick={() => setStep(2)}
                style={{ width:'100%', background:size ? T.purple : '#ccc', color:'white', border:'none', borderRadius:14, padding:16, fontFamily:"'Almarai',sans-serif", fontSize:16, fontWeight:700, cursor:size ? 'pointer' : 'not-allowed', marginTop:8, transition:'all .3s' }}>
                التالي — اختاري طريقة الدفع
              </button>
            </>
          )}

          {/* Step 2 — Wallet + Confirm */}
          {step === 2 && (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
                <button onClick={() => setStep(1)} style={{ background:T.cream, border:'none', borderRadius:'50%', width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                  <ArrowLeft size={18} />
                </button>
                <h3 style={{ fontWeight:800, fontSize:18, color:T.text }}>طريقة الدفع</h3>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:24 }}>
                {WALLETS.map(w => (
                  <button key={w} className={`wBtn${wallet === w ? ' on' : ''}`} onClick={() => setWallet(w)} style={{ textAlign:'center' }}>{w}</button>
                ))}
              </div>

              {/* Order summary */}
              <div style={{ background:`rgba(75,22,76,.05)`, borderRadius:16, padding:16, marginBottom:20, border:`1px solid rgba(75,22,76,.12)` }}>
                {[['المنتج', product.name],['المقاس', size],['السعر', yer(product.price)],['الدفع', wallet||'—']].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:`1px solid rgba(75,22,76,.08)`, fontSize:14 }}>
                    <span style={{ color:T.muted }}>{k}</span>
                    <span style={{ fontWeight:700, color:T.text }}>{v}</span>
                  </div>
                ))}
              </div>

              <button disabled={!wallet || sending} onClick={handleSend} className="whatsBtn">
                {sending
                  ? <span style={{ width:22, height:22, border:'3px solid rgba(255,255,255,.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 1s linear infinite', display:'inline-block' }} />
                  : <><MessageCircle size={22} /> إتمام الطلب عبر واتساب</>
                }
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
