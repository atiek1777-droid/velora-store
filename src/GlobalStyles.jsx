export default function GlobalStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root {
        font-family: 'Almarai', 'Cairo', sans-serif;
        direction: rtl;
        background: #F7F5F4;
        color: #1A0A1B;
        overflow-x: hidden;
      }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #F7F5F4; }
      ::-webkit-scrollbar-thumb { background: #4B164C; border-radius: 2px; }

      @keyframes fadeUp    { from { opacity:0; transform:translateY(40px)  } to { opacity:1; transform:translateY(0)  } }
      @keyframes fadeRight { from { opacity:0; transform:translateX(50px)  } to { opacity:1; transform:translateX(0)  } }
      @keyframes scaleIn   { from { opacity:0; transform:scale(0.85)       } to { opacity:1; transform:scale(1)       } }
      @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
      @keyframes gradientShift {
        0%   { background-position: 0%   50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0%   50%; }
      }
      @keyframes wave {
        0%   { transform: translateY(0px);   }
        25%  { transform: translateY(-5px);  }
        50%  { transform: translateY(0px);   }
        75%  { transform: translateY(5px);   }
        100% { transform: translateY(0px);   }
      }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }

      /* Hero stagger */
      .h-title  { animation: fadeUp  .9s ease  .2s both; }
      .h-sub    { animation: fadeUp  .9s ease  .5s both; }
      .h-cta    { animation: fadeUp  .9s ease  .8s both; }
      .h-visual { animation: fadeRight 1.1s ease .1s both; }
      .h-badge  { animation: scaleIn .6s ease 1.1s both; }

      /* Floating */
      .float { animation: float 3.5s ease-in-out infinite; }

      /* Shimmer gold text */
      .shimmer-gold {
        background: linear-gradient(90deg,#C9A96E 0%,#E8D5A3 45%,#C9A96E 100%);
        background-size: 200% auto;
        animation: shimmer 2s linear infinite;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      /* Scroll reveal */
      .reveal { opacity:0; transform:translateY(30px); transition:opacity .7s ease,transform .7s ease; }
      .reveal.vis { opacity:1; transform:translateY(0); }

      /* Product card hover */
      .pcard { transition: transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .4s ease; cursor: pointer; }
      .pcard:hover { transform: translateY(-14px) rotate(-1.5deg); box-shadow: 0 30px 60px rgba(75,22,76,.28); }

      /* Size buttons */
      .szBtn {
        transition: all .2s cubic-bezier(.34,1.56,.64,1);
        border: 2px solid #EDE9E6; background: white; color: #1A0A1B;
        cursor: pointer; border-radius: 8px; padding: 8px 0;
        font-family: 'Almarai',sans-serif; font-size: 14px; font-weight: 700;
      }
      .szBtn:hover, .szBtn.on { background:#4B164C; border-color:#4B164C; color:white; transform:scale(1.1); }

      /* Wallet buttons */
      .wBtn {
        transition: all .2s ease; border: 2px solid transparent;
        background: #F7F5F4; color: #1A0A1B; cursor: pointer;
        border-radius: 10px; padding: 10px 14px;
        font-family: 'Almarai',sans-serif; font-size: 14px;
      }
      .wBtn:hover, .wBtn.on { border-color:#4B164C; background:rgba(75,22,76,.07); color:#4B164C; font-weight:700; }

      /* Navbar links */
      .navL { position:relative; text-decoration:none; color:#1A0A1B; font-size:15px; transition:color .3s; }
      .navL::after { content:''; position:absolute; bottom:-4px; right:0; width:0; height:2px; background:#C9A96E; transition:width .3s; }
      .navL:hover::after { width:100%; }
      .navL:hover { color:#4B164C; }

      /* Admin sidebar items */
      .sbItem {
        transition: all .2s ease; border-right: 3px solid transparent; cursor: pointer;
        color: rgba(255,255,255,.7); display:flex; align-items:center; gap:12px;
        padding: 13px 20px; font-family:'Almarai',sans-serif; font-size:15px;
      }
      .sbItem:hover, .sbItem.on { background:rgba(255,255,255,.1); border-right-color:#C9A96E; color:white; }

      /* Stat cards */
      .stCard { transition:transform .3s ease,box-shadow .3s ease; background:white; border-radius:16px; padding:20px; border:1px solid #EDE9E6; }
      .stCard:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(75,22,76,.12); }

      /* WhatsApp button */
      .whatsBtn {
        background:#25D366; color:white; border:none; border-radius:14px; padding:16px;
        width:100%; font-family:'Almarai',sans-serif; font-size:17px; font-weight:700;
        cursor:pointer; transition:all .3s ease; display:flex; align-items:center; justify-content:center; gap:10px;
      }
      .whatsBtn:hover { background:#128C7E; transform:translateY(-2px); box-shadow:0 10px 30px rgba(37,211,102,.35); }
      .whatsBtn:disabled { opacity:.5; cursor:not-allowed; transform:none; }

      /* Developer credit */
      .dev-credit-line {
        display: inline-block;
        font-family: 'Almarai','Cairo',sans-serif;
        font-weight: 800;
        font-size: clamp(14px,2.2vw,19px);
        background: linear-gradient(270deg,#C9A96E,#f0d090,#ffffff,#e8bfff,#C9A96E,#f7e0a0,#d4a0ff,#C9A96E);
        background-size: 400% 400%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradientShift 4s ease infinite, wave 3s ease-in-out infinite;
        direction: rtl; text-align: center; line-height: 2; letter-spacing: .5px;
      }
      .dev-credit-line.l2 { animation: gradientShift 4s ease infinite .4s, wave 3s ease-in-out infinite .4s; }
      .dev-credit-line.l3 { animation: gradientShift 4s ease infinite .8s, wave 3s ease-in-out infinite .8s; }
      .dev-phone-link {
        display: inline-block;
        font-family: 'Almarai','Cairo',sans-serif;
        font-weight: 800;
        font-size: clamp(14px,2.2vw,19px);
        background: linear-gradient(270deg,#25D366,#a8f0c6,#ffffff,#25D366,#a8f0c6,#ffffff,#25D366);
        background-size: 400% 400%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradientShift 4s ease infinite .4s, wave 3s ease-in-out infinite .4s;
        text-decoration: none; cursor: pointer;
        direction: rtl; letter-spacing: .5px;
      }
      .dev-phone-link:hover { opacity: .75; }
      .dev-sep { width:80px; height:2px; background:linear-gradient(90deg,transparent,#C9A96E,transparent); margin:12px auto; border-radius:2px; }
      .dev-credit-wrap {
        border-top: 1px solid rgba(255,255,255,.08);
        padding: 36px 24px 32px;
        text-align: center;
        direction: rtl;
        background: linear-gradient(180deg,rgba(255,255,255,.025) 0%,rgba(0,0,0,.15) 100%);
      }

      /* Inputs */
      input, textarea, select { font-family:'Almarai',sans-serif !important; direction:rtl; }

      /* Mobile */
      @media(max-width:768px) {
        .deskOnly { display:none !important; }
        .adminSidebar { display:none !important; }
      }
    `}</style>
  );
}
