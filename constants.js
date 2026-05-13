// ── Design Tokens ─────────────────────────────────────────────────────────────
export const T = {
  purple:  '#4B164C',
  purpleD: '#3A1039',
  purpleL: '#6B2270',
  cream:   '#F7F5F4',
  creamD:  '#EDE9E6',
  gold:    '#C9A96E',
  goldL:   '#E8D5A3',
  text:    '#1A0A1B',
  muted:   '#8B7B8C',
  white:   '#FFFFFF',
  green:   '#25D366',
};

// ── Business Constants ─────────────────────────────────────────────────────────
export const WA_DEFAULT = '967781885252';

export const WALLETS = [
  'جوالي', 'كاش موبايل', 'OneCash', 'فلوسك',
  'محفظتي', 'واي كاش', 'بسباس', 'موبايل موني', 'يمن باي',
];

export const STATUSES    = ['جديد', 'مؤكد', 'قيد التحضير', 'تم الشحن'];
export const ROLES       = ['admin', 'editor', 'order_supervisor'];

export const STATUS_STYLE = {
  'جديد':          { bg: '#FFF8E1', c: '#E65100' },
  'مؤكد':          { bg: '#E8F5E9', c: '#1B5E20' },
  'قيد التحضير':  { bg: '#E3F2FD', c: '#0D47A1' },
  'تم الشحن':     { bg: '#F3E5F5', c: '#6B2270'  },
};

export const ROLE_LABEL = {
  admin:            'مدير كامل',
  editor:           'محرر منتجات',
  order_supervisor: 'مشرف طلبات',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
export const yer = (n) =>
  Number(n).toLocaleString('ar-YE') + ' ﷼';

export const generateOrderId = () => {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `VLR-${date}-${rand}`;
};

// ── Mock Data (used when Supabase is not configured) ──────────────────────────
export const MOCK_PRODUCTS = [
  { id: 1, name: 'سيرينا — كلاسيك إليغانس', description: 'حذاء كعب ستيليتو من الجلد الإيطالي الفاخر، مبطن بالحرير الناعم', price: 65000, sizes: [36,37,38,39,40,41], stock: 12, is_new: true,  category: 'كعب عالي',   gradient: `linear-gradient(145deg,#4B164C 0%,#8B2F8C 100%)`, images: [] },
  { id: 2, name: 'أوريورا — بلاتينيوم',      description: 'صندل فضي لامع بتصميم مفتوح أنيق، مثالية للمناسبات الفاخرة',    price: 78000, sizes: [36,37,38,39,40],    stock: 8,  is_new: true,  category: 'صندل فاخر',  gradient: 'linear-gradient(145deg,#6B6B8B 0%,#C4C4D8 100%)',  images: [] },
  { id: 3, name: 'لونا — رُوز غولد',         description: 'بوت قصير بلون ذهبي وردي حالم، مزين بتفاصيل جلدية يدوية',       price: 89000, sizes: [37,38,39,40,41],    stock: 5,  is_new: false, category: 'بوت',         gradient: 'linear-gradient(145deg,#C9866E 0%,#E8C4A8 100%)',  images: [] },
  { id: 4, name: 'إيزابيلا — نايت بلو',      description: 'كعب بلوك أزرق داكن ملكي، يجمع الجرأة والأناقة الكلاسيكية',     price: 58000, sizes: [36,37,38,39,40,41], stock: 20, is_new: false, category: 'كعب بلوك',   gradient: 'linear-gradient(145deg,#1a237e 0%,#3949ab 100%)', images: [] },
  { id: 5, name: 'ريا — إيفوري بيرل',        description: 'مول ناعم بلون العاج المحاري، للإطلالة اليومية الراقية',          price: 45000, sizes: [36,37,38,39,40,41], stock: 30, is_new: false, category: 'مول',         gradient: 'linear-gradient(145deg,#B8A99A 0%,#E8DDD5 100%)', images: [] },
  { id: 6, name: 'زيرا — إيمرالد',           description: 'كعب كيتن بلون زمردي ملكي، قطعة فنية من الجلد الناعم',           price: 72000, sizes: [36,37,38,39,40],    stock: 9,  is_new: true,  category: 'كعب كيتن',   gradient: 'linear-gradient(145deg,#004D40 0%,#26A69A 100%)',  images: [] },
];

export const MOCK_ORDERS = [
  { id: 'VLR-20260510-0001', product_name: 'سيرينا — كلاسيك إليغانس', size: 38, price: 65000, wallet: 'جوالي',      status: 'جديد',         customer_name: 'فاطمة أحمد', customer_phone: '771234567', created_at: '2026-05-10' },
  { id: 'VLR-20260510-0002', product_name: 'أوريورا — بلاتينيوم',      size: 37, price: 78000, wallet: 'كاش موبايل',  status: 'قيد التحضير', customer_name: 'مريم علي',   customer_phone: '733456789', created_at: '2026-05-10' },
  { id: 'VLR-20260509-0003', product_name: 'لونا — رُوز غولد',         size: 39, price: 89000, wallet: 'واي كاش',    status: 'تم الشحن',    customer_name: 'نور محمد',   customer_phone: '712345678', created_at: '2026-05-09' },
  { id: 'VLR-20260508-0004', product_name: 'إيزابيلا — نايت بلو',      size: 40, price: 58000, wallet: 'OneCash',    status: 'مؤكد',         customer_name: 'سارة يوسف', customer_phone: '715678901', created_at: '2026-05-08' },
];

export const MOCK_SETTINGS = {
  store_name:  'Velora',
  tagline:     'REFINED . FEMININE . VELORA',
  description: 'أحذية فيلورا — حيث تلتقي الأناقة بالجمال اليمني الأصيل',
  whatsapp:    WA_DEFAULT,
  instagram:   '@velora.sho',
  tiktok:      '@velora258',
  facebook:    'Velora Yemen',
  logo_url:    null,
};

export const SALES_DATA = [
  { m: 'يناير', s: 1200000 }, { m: 'فبراير', s: 1850000 },
  { m: 'مارس',  s: 1400000 }, { m: 'أبريل',  s: 2200000 },
  { m: 'مايو',  s: 2900000 }, { m: 'يونيو',  s: 1900000 },
];
