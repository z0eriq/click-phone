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

  // Banners
  await prisma.banner.createMany({
    data: [
      {
        title: "CLICK PHONE",
        titleAr: "كليك فون",
        subtitle: "Your #1 Phone Store in Jordan",
        subtitleAr: "وجهتك الأولى للهواتف في الأردن",
        image: "https://images.unsplash.com/photo-1695048064999-71d9461b2ed2?w=1400&h=600&fit=crop",
        link: "/shop",
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
    update: {
      minOrder: 50,
      maxDiscount: 50,
    },
    create: {
      code: "CLICK10",
      description: "10% off your order",
      discountType: "percentage",
      discountValue: 10,
      minOrder: 50,
      maxDiscount: 50,
      usageLimit: 100,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "WELCOME5" },
    update: {},
    create: {
      code: "WELCOME5",
      description: "5 JOD off first order",
      discountType: "fixed",
      discountValue: 5,
      minOrder: 30,
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
        answer: "Delivery within Irbid takes 1-2 days. Other Jordanian cities 2-4 days.",
        answerAr: "التوصيل داخل إربد 1-2 يوم. باقي مدن الأردن 2-4 أيام.",
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
    { key: "tax_rate", value: "0.16", group: "commerce" },
    { key: "shipping_cost", value: "5", group: "commerce" },
    { key: "free_shipping_threshold", value: "100", group: "commerce" },
    { key: "currency", value: "JOD", group: "commerce" },
    { key: "country", value: "Jordan", group: "general" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
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
