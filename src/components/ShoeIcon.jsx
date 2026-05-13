import { T } from '../lib/constants.js';

export default function ShoeIcon() {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', opacity:.4 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 55 Q20 30 40 28 Q55 26 65 35 L70 55 Z" fill="white" opacity=".6"/>
        <path d="M10 55 Q20 30 40 28" stroke="white" strokeWidth="2" fill="none"/>
        <path d="M40 28 Q50 18 58 22 Q65 26 65 35" stroke="white" strokeWidth="2" fill="none"/>
        <ellipse cx="40" cy="56" rx="30" ry="6" fill="white" opacity=".3"/>
      </svg>
    </div>
  );
}
