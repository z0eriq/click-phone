export type Locale = "ar" | "en";

export const defaultLocale: Locale = "ar";
export const locales: Locale[] = ["ar", "en"];

export const translations = {
  ar: {
    // Navigation
    home: "الرئيسية",
    about: "من نحن",
    shop: "المتجر",
    offers: "العروض",
    latestPhones: "أحدث الهواتف",
    accessories: "الإكسسوارات",
    maintenance: "الصيانة",
    blog: "المدونة",
    faq: "الأسئلة الشائعة",
    contact: "اتصل بنا",
    privacy: "سياسة الخصوصية",
    terms: "الشروط والأحكام",

    // Store
    addToCart: "أضف للسلة",
    buyNow: "اشترِ الآن",
    outOfStock: "نفذت الكمية",
    inStock: "متوفر",
    search: "ابحث عن منتج...",
    filter: "فلترة",
    sort: "ترتيب",
    price: "السعر",
    brand: "الشركة",
    category: "الفئة",
    color: "اللون",
    storage: "السعة",
    rating: "التقييم",
    reviews: "المراجعات",
    specifications: "المواصفات",
    relatedProducts: "منتجات مشابهة",
    suggestedProducts: "منتجات مقترحة",

    // Cart
    cart: "سلة التسوق",
    checkout: "إتمام الطلب",
    subtotal: "المجموع الفرعي",
    discount: "الخصم",
    tax: "الضريبة",
    shipping: "الشحن",
    total: "الإجمالي",
    coupon: "كوبون الخصم",
    applyCoupon: "تطبيق",
    emptyCart: "سلة التسوق فارغة",
    continueShopping: "متابعة التسوق",

    // Auth
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    forgotPassword: "نسيت كلمة المرور?",
    myAccount: "حسابي",
    myOrders: "طلباتي",
    wishlist: "المفضلة",
    addresses: "العناوين",
    notifications: "الإشعارات",

    // Contact
    callUs: "اتصل بنا",
    whatsapp: "واتساب",
    directions: "الاتجاهات",
    followUs: "تابعنا",

    // General
    viewAll: "عرض الكل",
    learnMore: "اعرف المزيد",
    loading: "جاري التحميل...",
    noResults: "لا توجد نتائج",
    freeShipping: "شحن مجاني",
    warranty: "ضمان أصلي",
    support: "دعم فني",
    darkMode: "الوضع الداكن",
    lightMode: "الوضع الفاتح",

    // Hero
    heroTitle: "كليك فون",
    heroSubtitle: "وجهتك الأولى للهواتف الذكية والإلكترونيات",
    heroDescription: "اكتشف أحدث الهواتف الذكية، الأجهزة اللوحية، الساعات الذكية والإكسسوارات بأفضل الأسعار",
    shopNow: "تسوق الآن",

    // Footer
    footerDesc: "متجر كليك فون - وجهتك الموثوقة لشراء الهواتف الذكية والإلكترونيات في العراق",
    quickLinks: "روابط سريعة",
    customerService: "خدمة العملاء",
    allRightsReserved: "جميع الحقوق محفوظة",
  },
  en: {
    home: "Home",
    about: "About Us",
    shop: "Shop",
    offers: "Offers",
    latestPhones: "Latest Phones",
    accessories: "Accessories",
    maintenance: "Maintenance",
    blog: "Blog",
    faq: "FAQ",
    contact: "Contact Us",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",

    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    search: "Search products...",
    filter: "Filter",
    sort: "Sort",
    price: "Price",
    brand: "Brand",
    category: "Category",
    color: "Color",
    storage: "Storage",
    rating: "Rating",
    reviews: "Reviews",
    specifications: "Specifications",
    relatedProducts: "Related Products",
    suggestedProducts: "Suggested Products",

    cart: "Shopping Cart",
    checkout: "Checkout",
    subtotal: "Subtotal",
    discount: "Discount",
    tax: "Tax",
    shipping: "Shipping",
    total: "Total",
    coupon: "Coupon Code",
    applyCoupon: "Apply",
    emptyCart: "Your cart is empty",
    continueShopping: "Continue Shopping",

    login: "Login",
    register: "Register",
    logout: "Logout",
    forgotPassword: "Forgot Password?",
    myAccount: "My Account",
    myOrders: "My Orders",
    wishlist: "Wishlist",
    addresses: "Addresses",
    notifications: "Notifications",

    callUs: "Call Us",
    whatsapp: "WhatsApp",
    directions: "Directions",
    followUs: "Follow Us",

    viewAll: "View All",
    learnMore: "Learn More",
    loading: "Loading...",
    noResults: "No results found",
    freeShipping: "Free Shipping",
    warranty: "Original Warranty",
    support: "Tech Support",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",

    heroTitle: "CLICK PHONE",
    heroSubtitle: "Your #1 Destination for Smartphones & Electronics",
    heroDescription: "Discover the latest smartphones, tablets, smartwatches and accessories at the best prices",
    shopNow: "Shop Now",

    footerDesc: "CLICK PHONE - Your trusted destination for smartphones and electronics in Iraq",
    quickLinks: "Quick Links",
    customerService: "Customer Service",
    allRightsReserved: "All Rights Reserved",
  },
} as const;

export type TranslationKey = keyof typeof translations.ar;

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] || translations.ar[key];
}

export function getLocalizedField(
  item: object,
  field: string,
  locale: Locale
): string {
  const record = item as Record<string, unknown>;
  const arField = `${field}Ar`;
  if (locale === "ar" && record[arField]) return record[arField] as string;
  return (record[field] as string) || "";
}
