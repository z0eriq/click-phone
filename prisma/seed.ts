import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CLICK PHONE database...");

  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@clickphone.iq" },
    update: {},
    create: {
      email: "admin@clickphone.iq",
      password: adminPassword,
      name: "مدير النظام",
      phone: "0785954444",
      role: "ADMIN",
    },
  });

  const managerPassword = await bcrypt.hash("manager123", 12);
  await prisma.user.upsert({
    where: { email: "manager@clickphone.iq" },
    update: {},
    create: {
      email: "manager@clickphone.iq",
      password: managerPassword,
      name: "مدير المبيعات",
      role: "MANAGER",
    },
  });

  const customerPassword = await bcrypt.hash("customer123", 12);
  await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      password: customerPassword,
      name: "أحمد محمد",
      phone: "07701234567",
      role: "CUSTOMER",
    },
  });

  // Brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: "apple" },
      update: {},
      create: { name: "Apple", nameAr: "أبل", slug: "apple", sortOrder: 1 },
    }),
    prisma.brand.upsert({
      where: { slug: "samsung" },
      update: {},
      create: { name: "Samsung", nameAr: "سامسونج", slug: "samsung", sortOrder: 2 },
    }),
    prisma.brand.upsert({
      where: { slug: "xiaomi" },
      update: {},
      create: { name: "Xiaomi", nameAr: "شاومي", slug: "xiaomi", sortOrder: 3 },
    }),
    prisma.brand.upsert({
      where: { slug: "nothing" },
      update: {},
      create: { name: "Nothing", nameAr: "نثينج", slug: "nothing", sortOrder: 4 },
    }),
    prisma.brand.upsert({
      where: { slug: "huawei" },
      update: {},
      create: { name: "Huawei", nameAr: "هواوي", slug: "huawei", sortOrder: 5 },
    }),
  ]);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "phones" },
      update: {},
      create: {
        name: "Smartphones",
        nameAr: "هواتف ذكية",
        slug: "phones",
        icon: "smartphone",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "tablets" },
      update: {},
      create: {
        name: "Tablets",
        nameAr: "أجهزة لوحية",
        slug: "tablets",
        icon: "tablet",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "watches" },
      update: {},
      create: {
        name: "Smart Watches",
        nameAr: "ساعات ذكية",
        slug: "watches",
        icon: "watch",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "Accessories",
        nameAr: "إكسسوارات",
        slug: "accessories",
        icon: "headphones",
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "chargers" },
      update: {},
      create: {
        name: "Chargers",
        nameAr: "شواحن",
        slug: "chargers",
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: "cases" },
      update: {},
      create: {
        name: "Cases & Protection",
        nameAr: "كفرات وحماية",
        slug: "cases",
        sortOrder: 6,
      },
    }),
  ]);

  const phonesCat = categories[0];
  const accessoriesCat = categories[3];
  const appleBrand = brands[0];
  const samsungBrand = brands[1];
  const xiaomiBrand = brands[2];

  // Products
  const products = [
    {
      name: "iPhone 16 Pro Max",
      nameAr: "آيفون 16 برو ماكس",
      slug: "iphone-16-pro-max",
      sku: "CP-IP16PM-256",
      barcode: "194253898123",
      price: 1850000,
      comparePrice: 1950000,
      stock: 15,
      brandId: appleBrand.id,
      categoryId: phonesCat.id,
      isFeatured: true,
      isNew: true,
      description: "The most advanced iPhone ever with A18 Pro chip, titanium design, and pro camera system.",
      descriptionAr: "أقوى آيفون على الإطلاق مع شريحة A18 Pro وتصميم تيتانيوم ونظام كاميرا احترافي.",
      image: "https://images.unsplash.com/photo-1695048064999-71d9461b2ed2?w=600&h=600&fit=crop",
      specs: [
        { group: "Display", groupAr: "الشاشة", key: "Size", keyAr: "الحجم", value: "6.9 inch Super Retina XDR", valueAr: "6.9 بوصة Super Retina XDR" },
        { group: "Performance", groupAr: "الأداء", key: "Chip", keyAr: "المعالج", value: "A18 Pro", valueAr: "A18 Pro" },
        { group: "Camera", groupAr: "الكاميرا", key: "Main", keyAr: "الرئيسية", value: "48MP Fusion", valueAr: "48 ميجابكسل" },
      ],
      variants: [
        { name: "256GB Natural Titanium", color: "Natural Titanium", colorHex: "#8B8680", storage: "256GB", sku: "CP-IP16PM-256-NT", stock: 5 },
        { name: "512GB Black Titanium", color: "Black Titanium", colorHex: "#3C3C3C", storage: "512GB", sku: "CP-IP16PM-512-BT", stock: 5 },
        { name: "1TB Desert Titanium", color: "Desert Titanium", colorHex: "#C4A882", storage: "1TB", sku: "CP-IP16PM-1TB-DT", stock: 5 },
      ],
    },
    {
      name: "Samsung Galaxy S25 Ultra",
      nameAr: "سامسونج جالاكسي S25 ألترا",
      slug: "samsung-galaxy-s25-ultra",
      sku: "CP-SGS25U-256",
      price: 1650000,
      comparePrice: 1750000,
      stock: 20,
      brandId: samsungBrand.id,
      categoryId: phonesCat.id,
      isFeatured: true,
      isOnSale: true,
      description: "Galaxy AI powered flagship with S Pen, 200MP camera, and titanium frame.",
      descriptionAr: "رائد مزود بذكاء Galaxy AI مع قلم S Pen وكاميرا 200 ميجابكسل وإطار تيتانيوم.",
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
      specs: [
        { group: "Display", groupAr: "الشاشة", key: "Size", keyAr: "الحجم", value: "6.8 inch Dynamic AMOLED 2X", valueAr: "6.8 بوصة Dynamic AMOLED 2X" },
        { group: "Camera", groupAr: "الكاميرا", key: "Main", keyAr: "الرئيسية", value: "200MP", valueAr: "200 ميجابكسل" },
      ],
      variants: [
        { name: "256GB Titanium Black", color: "Black", colorHex: "#000000", storage: "256GB", sku: "CP-SGS25U-256-BK", stock: 10 },
        { name: "512GB Titanium Gray", color: "Gray", colorHex: "#808080", storage: "512GB", sku: "CP-SGS25U-512-GY", stock: 10 },
      ],
    },
    {
      name: "Xiaomi 15 Ultra",
      nameAr: "شاومي 15 ألترا",
      slug: "xiaomi-15-ultra",
      sku: "CP-XM15U-512",
      price: 1200000,
      stock: 25,
      brandId: xiaomiBrand.id,
      categoryId: phonesCat.id,
      isNew: true,
      isFeatured: true,
      description: "Leica co-engineered cameras with Snapdragon 8 Elite processor.",
      descriptionAr: "كاميرات Leica المشتركة مع معالج Snapdragon 8 Elite.",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop",
      specs: [],
      variants: [
        { name: "512GB Black", color: "Black", colorHex: "#000000", storage: "512GB", sku: "CP-XM15U-512-BK", stock: 15 },
        { name: "512GB White", color: "White", colorHex: "#FFFFFF", storage: "512GB", sku: "CP-XM15U-512-WH", stock: 10 },
      ],
    },
    {
      name: "AirPods Pro 2",
      nameAr: "إيربودز برو 2",
      slug: "airpods-pro-2",
      sku: "CP-APP2",
      price: 350000,
      comparePrice: 380000,
      stock: 50,
      brandId: appleBrand.id,
      categoryId: accessoriesCat.id,
      isOnSale: true,
      description: "Active Noise Cancellation with Adaptive Audio and USB-C charging.",
      descriptionAr: "إلغاء ضوضاء نشط مع صوت تكيفي وشحن USB-C.",
      image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop",
      specs: [],
      variants: [],
    },
    {
      name: "Samsung Galaxy Watch 7",
      nameAr: "سامسونج جالاكسي واتش 7",
      slug: "samsung-galaxy-watch-7",
      sku: "CP-SGW7",
      price: 450000,
      stock: 30,
      brandId: samsungBrand.id,
      categoryId: categories[2].id,
      isNew: true,
      description: "Advanced health monitoring with AI-powered insights.",
      descriptionAr: "مراقبة صحية متقدمة مع رؤى مدعومة بالذكاء الاصطناعي.",
      image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop",
      specs: [],
      variants: [
        { name: "44mm Green", color: "Green", colorHex: "#2E8B57", storage: "32GB", sku: "CP-SGW7-44-GR", stock: 15 },
        { name: "40mm Cream", color: "Cream", colorHex: "#FFFDD0", storage: "32GB", sku: "CP-SGW7-40-CR", stock: 15 },
      ],
    },
    {
      name: "Nothing Phone (3)",
      nameAr: "نثينج فون 3",
      slug: "nothing-phone-3",
      sku: "CP-NP3-256",
      price: 850000,
      stock: 18,
      brandId: brands[3].id,
      categoryId: phonesCat.id,
      isNew: true,
      description: "Unique Glyph Interface with flagship performance.",
      descriptionAr: "واجهة Glyph الفريدة مع أداء رائد.",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
      specs: [],
      variants: [],
    },
  ];

  for (const p of products) {
    const { image, specs, variants, ...productData } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...productData,
        images: {
          create: [{ url: image, isPrimary: true, sortOrder: 0 }],
        },
        specs: {
          create: specs,
        },
        variants: {
          create: variants,
        },
      },
    });
  }

  // Banners
  await prisma.banner.createMany({
    data: [
      {
        title: "iPhone 16 Pro Max",
        titleAr: "آيفون 16 برو ماكس",
        subtitle: "The Future is Here",
        subtitleAr: "المستقبل هنا",
        image: "https://images.unsplash.com/photo-1695048064999-71d9461b2ed2?w=1400&h=600&fit=crop",
        link: "/shop/iphone-16-pro-max",
        position: "home",
        sortOrder: 1,
      },
      {
        title: "Summer Sale",
        titleAr: "تخفيضات الصيف",
        subtitle: "Up to 30% Off",
        subtitleAr: "خصم حتى 30%",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1400&h=600&fit=crop",
        link: "/offers",
        position: "home",
        sortOrder: 2,
      },
    ],
    skipDuplicates: true,
  });

  // Coupons
  await prisma.coupon.upsert({
    where: { code: "CLICK10" },
    update: {},
    create: {
      code: "CLICK10",
      description: "10% off your order",
      discountType: "percentage",
      discountValue: 10,
      minOrder: 100000,
      maxDiscount: 200000,
      usageLimit: 100,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "WELCOME50" },
    update: {},
    create: {
      code: "WELCOME50",
      description: "50,000 IQD off first order",
      discountType: "fixed",
      discountValue: 50000,
      minOrder: 200000,
      usageLimit: 500,
    },
  });

  // FAQs
  await prisma.fAQ.createMany({
    data: [
      {
        question: "Do you offer warranty?",
        questionAr: "هل تقدمون ضمان؟",
        answer: "Yes, all our products come with official manufacturer warranty.",
        answerAr: "نعم، جميع منتجاتنا تأتي بضمان الشركة المصنعة الرسمي.",
        category: "general",
        sortOrder: 1,
      },
      {
        question: "What payment methods do you accept?",
        questionAr: "ما طرق الدفع المتاحة؟",
        answer: "We accept cash on delivery, bank transfer, and card payments.",
        answerAr: "نقبل الدفع عند الاستلام والتحويل البنكي والبطاقات.",
        category: "payment",
        sortOrder: 2,
      },
      {
        question: "Do you offer phone repair?",
        questionAr: "هل تقدمون صيانة للهواتف؟",
        answer: "Yes, we have a professional repair service with original spare parts.",
        answerAr: "نعم، لدينا خدمة صيانة احترافية بقطع غيار أصلية.",
        category: "maintenance",
        sortOrder: 3,
      },
      {
        question: "How long does delivery take?",
        questionAr: "كم يستغرق التوصيل؟",
        answer: "Delivery within Baghdad takes 1-2 days. Other cities 2-5 days.",
        answerAr: "التوصيل داخل بغداد 1-2 يوم. المحافظات الأخرى 2-5 أيام.",
        category: "shipping",
        sortOrder: 4,
      },
    ],
    skipDuplicates: true,
  });

  // Blog posts
  await prisma.blogPost.createMany({
    data: [
      {
        title: "iPhone 16 Pro Max Review",
        titleAr: "مراجعة آيفون 16 برو ماكس",
        slug: "iphone-16-pro-max-review",
        excerpt: "A comprehensive review of Apple's latest flagship.",
        excerptAr: "مراجعة شاملة لأحدث هاتف رائد من أبل.",
        content: "<p>The iPhone 16 Pro Max represents Apple's most ambitious smartphone yet...</p>",
        contentAr: "<p>يمثل آيفون 16 برو ماكس أطموح هاتف ذكي من أبل حتى الآن...</p>",
        image: "https://images.unsplash.com/photo-1695048064999-71d9461b2ed2?w=800&h=400&fit=crop",
        author: "CLICK PHONE Team",
        isPublished: true,
        publishedAt: new Date(),
      },
      {
        title: "Best Budget Phones 2025",
        titleAr: "أفضل الهواتف الاقتصادية 2025",
        slug: "best-budget-phones-2025",
        excerpt: "Top affordable smartphones that don't compromise on quality.",
        excerptAr: "أفضل الهواتف الذكية بأسعار معقولة دون التنازل عن الجودة.",
        content: "<p>Looking for a great phone without breaking the bank? Here are our top picks...</p>",
        contentAr: "<p>تبحث عن هاتف رائع دون إنفاق ثروة؟ إليك أفضل اختياراتنا...</p>",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=400&fit=crop",
        author: "CLICK PHONE Team",
        isPublished: true,
        publishedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  // Site settings
  const settings = [
    { key: "site_name", value: "CLICK PHONE", group: "general" },
    { key: "site_name_ar", value: "كليك فون", group: "general" },
    { key: "site_description", value: "Your #1 destination for smartphones in Irbid, Jordan", group: "seo" },
    { key: "phone", value: "0785954444", group: "contact" },
    { key: "whatsapp", value: "962785954444", group: "contact" },
    { key: "email", value: "click@aloush.online", group: "contact" },
    { key: "facebook", value: "https://web.facebook.com/profile.php?id=61567285796866", group: "social" },
    { key: "maps_url", value: "https://maps.app.goo.gl/7W7ncszchVNWCJhE7", group: "contact" },
    { key: "tax_rate", value: "0.05", group: "commerce" },
    { key: "shipping_cost", value: "5000", group: "commerce" },
    { key: "free_shipping_threshold", value: "100000", group: "commerce" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  // Sample orders
  const customer = await prisma.user.findUnique({ where: { email: "customer@example.com" } });
  const iphone = await prisma.product.findUnique({ where: { slug: "iphone-16-pro-max" } });

  if (customer && iphone) {
    await prisma.order.upsert({
      where: { orderNumber: "CP250708DEMO1" },
      update: {},
      create: {
        orderNumber: "CP250708DEMO1",
        userId: customer.id,
        status: "DELIVERED",
        paymentStatus: "PAID",
        subtotal: 1850000,
        tax: 92500,
        shipping: 0,
        total: 1942500,
        shippingName: "أحمد محمد",
        shippingPhone: "07701234567",
        shippingAddress: "بغداد، الكرادة",
        items: {
          create: [{
            productId: iphone.id,
            name: iphone.name,
            sku: iphone.sku,
            price: 1850000,
            quantity: 1,
            total: 1850000,
          }],
        },
      },
    });
  }

  console.log("✅ Seed completed!");
  console.log("📧 Admin: admin@clickphone.iq / admin123");
  console.log("📧 Manager: manager@clickphone.iq / manager123");
  console.log("📧 Customer: customer@example.com / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
