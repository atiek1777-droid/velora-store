import { useState } from 'react';
import { Lock } from 'lucide-react';
import { T } from '../../lib/constants.js';
import { useAuth } from '../../hooks/useAuth.jsx';

export default function AdminLogin({ onBack }) {
  const { signIn, authError, setAuthError, SUPABASE_READY } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handle = async () => {
    setLoading(true);
    setAuthError('');
    await signIn(email, password);
    setLoading(false);
  };

  const inputStyle = {
    width:'100%', borderRadius:12, border:`2px solid ${T.creamD}`,
    padding:'14px 18px', fontSize:15, fontFamily:"'Almarai',sans-serif",
    direction:'rtl', outline:'none', transition:'border-color .2s',
  };

  return (
    <div style={{ minHeight:'100vh', background:`linear-gradient(135deg,${T.purple} 0%,${T.purpleD} 100%)`, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <button onClick={onBack} style={{ position:'fixed', top:20, left:20, background:'rgba(255,255,255,.15)', color:'white', border:'2px solid rgba(255,255,255,.25)', borderRadius:12, padding:'10px 18px', fontFamily:"'Almarai',sans-serif", cursor:'pointer', backdropFilter:'blur(8px)' }}>
        ← العودة
      </button>

      <div style={{ background:'white', borderRadius:24, padding:'48px 40px', width:'100%', maxWidth:420, boxShadow:'0 40px 100px rgba(0,0,0,.3)' }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ width:64, height:64, background:T.purple, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:`0 8px 24px rgba(75,22,76,.4)` }}>
            <Lock size={28} color="white" />
          </div>
          <h1 style={{ fontWeight:800, fontSize:26, color:T.text }}>لوحة تحكم فيلورا</h1>
          <p style={{ color:T.muted, marginTop:6, fontSize:14 }}>بيانات دخول المشرف فقط</p>
        </div>

        <input
          type="text" placeholder={SUPABASE_READY ? 'البريد الإلكتروني' : 'اسم المستخدم (admin)'}
          value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handle()}
          style={{ ...inputStyle, marginBottom:14 }}
          onFocus={e => e.target.style.borderColor = T.purple}
          onBlur={e  => e.target.style.borderColor = T.creamD}
        />
        <input
          type="password" placeholder="كلمة المرور"
          value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handle()}
          style={{ ...inputStyle, marginBottom:16 }}
          onFocus={e => e.target.style.borderColor = T.purple}
          onBlur={e  => e.target.style.borderColor = T.creamD}
        />

        {authError && (
          <div style={{ color:'#C62828', background:'#FFEBEE', borderRadius:10, padding:'10px 14px', fontSize:13, marginBottom:16, textAlign:'center' }}>
            {authError}
          </div>
        )}

        <button onClick={handle} disabled={loading}
          style={{ width:'100%', background:T.purple, color:'white', border:'none', borderRadius:14, padding:16, fontFamily:"'Almarai',sans-serif", fontSize:17, fontWeight:700, cursor:loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
          {loading
            ? <span style={{ width:22, height:22, border:'3px solid rgba(255,255,255,.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 1s linear infinite', display:'inline-block' }} />
            : <><Lock size={18} />دخول آمن</>
          }
        </button>

        {!SUPABASE_READY && (
          <div style={{ textAlign:'center', marginTop:20, fontSize:12, color:T.muted, background:T.cream, borderRadius:10, padding:12 }}>
            🔐 وضع تجريبي — admin / velora2024
          </div>
        )}
      </div>
    </div>
  );
}
