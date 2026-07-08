# CLICK PHONE - كليك فون

متجر إلكتروني احترافي متكامل لبيع الهواتف الذكية والإلكترونيات.

## التقنيات

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes
- **Database:** MySQL + Prisma ORM
- **Auth:** JWT Authentication
- **State:** Zustand
- **Charts:** Recharts

## المميزات

### المتجر
- تصميم فاخر مستوحى من Apple/Samsung
- دعم العربية والإنجليزية (RTL/LTR)
- الوضع الداكن والفاتح
- بحث مباشر Live Search
- فلترة متقدمة (السعر، الشركة، الفئة، التقييم)
- سلة تسوق مع كوبونات خصم
- حساب عميل كامل

### لوحة التحكم
- Dashboard مع إحصائيات ورسوم بيانية
- إدارة المنتجات (إضافة، تعديل، حذف، استيراد/تصدير Excel)
- إدارة التصنيفات والماركات
- إدارة الطلبات مع تحديث الحالة
- إدارة العملاء والصلاحيات
- إدارة المحتوى (بنرات، مدونة، FAQ)
- إعدادات الموقع و SEO

### الأمان
- JWT Authentication
- تشفير كلمات المرور (bcrypt)
- Rate Limiting
- XSS/CSRF Protection Headers
- سجل النشاطات

## التثبيت

### المتطلبات
- Node.js 18+
- MySQL 8+

### الخطوات

```bash
# 1. تثبيت الحزم
npm install

# 2. إعداد قاعدة البيانات
# عدّل DATABASE_URL في ملف .env

# 3. إنشاء الجداول
npx prisma db push

# 4. إدخال البيانات التجريبية
npm run db:seed

# 5. تشغيل المشروع
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

## حسابات تجريبية

| الدور | البريد | كلمة المرور |
|-------|--------|-------------|
| Admin | admin@clickphone.iq | admin123 |
| Manager | manager@clickphone.iq | manager123 |
| Customer | customer@example.com | customer123 |

## لوحة التحكم

[http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## معلومات التواصل

- **الهاتف:** 0785954444
- **واتساب:** +962 785 954 444
- **البريد الإلكتروني:** click@aloush.online
- **فيسبوك:** [صفحة فيسبوك](https://web.facebook.com/profile.php?id=61567285796866)
- **الموقع:** [Google Maps](https://maps.app.goo.gl/7W7ncszchVNWCJhE7)

## هيكل المشروع

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API Routes
│   ├── admin/            # لوحة التحكم
│   ├── shop/             # المتجر
│   ├── account/          # حساب العميل
│   └── ...               # صفحات أخرى
├── components/           # مكونات React
│   ├── ui/               # مكونات UI أساسية
│   ├── layout/           # Header, Footer
│   ├── shop/             # مكونات المتجر
│   └── home/             # الصفحة الرئيسية
├── lib/                  # مكتبات مساعدة
│   ├── auth.ts           # JWT Authentication
│   ├── prisma.ts         # Prisma Client
│   ├── i18n.ts           # الترجمة
│   └── utils.ts          # أدوات عامة
└── store/                # Zustand Stores
prisma/
├── schema.prisma         # مخطط قاعدة البيانات
└── seed.ts               # بيانات تجريبية
```

## النشر

```bash
npm run build
npm start
```

### متغيرات البيئة للإنتاج

```env
DATABASE_URL=mysql://user:pass@host:3306/click_phone
JWT_SECRET=your-super-secret-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## الترخيص

جميع الحقوق محفوظة © CLICK PHONE
