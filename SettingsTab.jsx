import { useState, useRef } from 'react';
import { Save, Upload, Image } from 'lucide-react';
import { T } from '../../../lib/constants.js';
import { useData } from '../../../hooks/useData.jsx';
import { useAuth } from '../../../hooks/useAuth.jsx';

export default function SettingsTab() {
  const { settings, saveAllSettings, uploadLogo } = useData();
  const { isAdmin, changePassword } = useAuth();
  const [form,      setForm]      = useState({ ...settings });
  const [saving,    setSaving]    = useState(false);
  const [logoUp,    setLogoUp]    = useState(false);
  const [msg,       setMsg]       = useState('');
  const [pw,        setPw]        = useState({ current:'', next:'', confirm:'' });
  const [pwMsg,     setPwMsg]     = useState('');
  const fileRef = useRef(null);

  const save = async () => {
    setSaving(true); setMsg('');
    const res = await saveAllSettings({ ...form });
    setMsg(res.ok ? '✅ تم الحفظ بنجاح' : `❌ ${res.error}`);
    setSaving(false);
  };

  const handleLogo = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setLogoUp(true); setMsg('');
    const res = await uploadLogo(file);
    if (res.ok) { setForm(f => ({ ...f, logo_url: res.url })); setMsg('✅ تم رفع الشعار'); }
    else setMsg(`❌ ${res.error}`);
    setLogoUp(false);
    e.target.value = '';
  };

  const savePw = async () => {
    if (pw.next !== pw.confirm) { setPwMsg('كلمتا المرور غير متطابقتين'); return; }
    if (pw.next.length < 8)     { setPwMsg('يجب أن تكون 8 أحرف على الأقل');  return; }
    const res = await changePassword(pw.next);
    setPwMsg(res.ok ? '✅ تم تغيير كلمة المرور' : `❌ ${res.error}`);
    if (res.ok) setPw({ current:'', next:'', confirm:'' });
  };

  const field = (label, key, type='text') => (
    <div key={key}>
      <label style={{ fontSize:12, color:T.muted, marginBottom:5, display:'block' }}>{label}</label>
      <input type={type} value={form[key]||''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        style={{ width:'100%', borderRadius:10, border:`1.5px solid ${T.creamD}`, padding:'12px 14px', fontSize:14, fontFamily:"'Almarai',sans-serif", direction:'rtl', outline:'none' }}
        onFocus={e => e.target.style.borderColor = T.purple}
        onBlur={e  => e.target.style.borderColor = T.creamD}
      />
    </div>
  );

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:24, alignItems:'start' }}>

      {/* Brand Settings */}
      <div style={{ background:'white', borderRadius:20, padding:28, border:`1px solid ${T.creamD}` }}>
        <h3 style={{ fontWeight:800, fontSize:18, marginBottom:20, color:T.text }}>هوية المتجر</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {field('اسم المتجر', 'store_name')}
          {field('الشعار الفرعي', 'tagline')}
          {field('وصف المتجر', 'description')}
          {field('رقم واتساب', 'whatsapp', 'tel')}
          {field('إنستغرام', 'instagram')}
          {field('تيك توك', 'tiktok')}
          {field('فيسبوك', 'facebook')}
        </div>

        {/* Logo */}
        <div style={{ marginTop:20 }}>
          <label style={{ fontSize:12, color:T.muted, marginBottom:8, display:'block' }}>شعار المتجر</label>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {form.logo_url
              ? <img src={form.logo_url} alt="logo" style={{ width:56, height:56, borderRadius:'50%', objectFit:'cover', border:`2px solid ${T.purple}` }} />
              : <div style={{ width:56, height:56, borderRadius:'50%', background:T.cream, border:`2px dashed ${T.creamD}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Image size={22} color={T.muted} />
                </div>
            }
            <label style={{ background:T.purple, color:'white', border:'none', borderRadius:10, padding:'10px 18px', fontFamily:"'Almarai',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
              {logoUp ? <span style={{ width:16,height:16,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 1s linear infinite',display:'inline-block' }}/> : <Upload size={15}/>}
              رفع شعار
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleLogo} />
            </label>
          </div>
        </div>

        {msg && <div style={{ marginTop:14, padding:'10px 14px', borderRadius:10, fontSize:13, background:msg.startsWith('✅') ? '#E8F5E9' : '#FFEBEE', color:msg.startsWith('✅') ? '#1B5E20' : '#C62828' }}>{msg}</div>}

        <button onClick={save} disabled={saving}
          style={{ marginTop:20, background:T.purple, color:'white', border:'none', borderRadius:12, padding:'13px 28px', fontFamily:"'Almarai',sans-serif", fontSize:15, fontWeight:700, cursor:saving ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', gap:8 }}>
          {saving ? <span style={{ width:18,height:18,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 1s linear infinite',display:'inline-block' }}/> : <><Save size={16}/>حفظ الإعدادات</>}
        </button>
      </div>

      {/* Password */}
      <div style={{ background:'white', borderRadius:20, padding:28, border:`1px solid ${T.creamD}` }}>
        <h3 style={{ fontWeight:800, fontSize:18, marginBottom:20, color:T.text }}>تغيير كلمة المرور</h3>
        {[
          { label:'كلمة المرور الجديدة', key:'next' },
          { label:'تأكيد كلمة المرور',   key:'confirm' },
        ].map(({ label, key }) => (
          <div key={key} style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, color:T.muted, marginBottom:5, display:'block' }}>{label}</label>
            <input type="password" placeholder={label} value={pw[key]} onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))}
              style={{ width:'100%', borderRadius:10, border:`1.5px solid ${T.creamD}`, padding:'12px 14px', fontSize:14, fontFamily:"'Almarai',sans-serif", direction:'rtl', outline:'none' }}
              onFocus={e => e.target.style.borderColor = T.purple}
              onBlur={e  => e.target.style.borderColor = T.creamD}
            />
          </div>
        ))}
        {pwMsg && <div style={{ padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:14, background:pwMsg.startsWith('✅') ? '#E8F5E9' : '#FFEBEE', color:pwMsg.startsWith('✅') ? '#1B5E20' : '#C62828' }}>{pwMsg}</div>}
        <button onClick={savePw}
          style={{ background:T.purple, color:'white', border:'none', borderRadius:12, padding:'13px 28px', fontFamily:"'Almarai',sans-serif", fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
          <Save size={16}/>تحديث كلمة المرور
        </button>

        {/* Quick stats */}
        <div style={{ marginTop:28 }}>
          <h3 style={{ fontWeight:800, fontSize:16, marginBottom:14, color:T.text }}>إحصائيات النظام</h3>
          {[
            ['إصدار التطبيق', 'v2.0.0'],
            ['قاعدة البيانات', 'Supabase PostgreSQL'],
            ['التخزين', 'Supabase Storage'],
            ['المصادقة', 'Supabase Auth'],
          ].map(([k, v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${T.creamD}`, fontSize:14 }}>
              <span style={{ color:T.muted }}>{k}</span>
              <span style={{ fontWeight:700, color:T.text, direction:'ltr' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
