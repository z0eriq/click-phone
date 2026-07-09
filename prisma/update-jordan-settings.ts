import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSetting.upsert({
    where: { key: "whatsapp" },
    update: { value: "962785954444" },
    create: { key: "whatsapp", value: "962785954444", group: "contact" },
  });
  await prisma.siteSetting.upsert({
    where: { key: "tax_rate" },
    update: { value: "0.16" },
    create: { key: "tax_rate", value: "0.16", group: "commerce" },
  });
  await prisma.siteSetting.upsert({
    where: { key: "shipping_cost" },
    update: { value: "5" },
    create: { key: "shipping_cost", value: "5", group: "commerce" },
  });
  await prisma.siteSetting.upsert({
    where: { key: "free_shipping_threshold" },
    update: { value: "100" },
    create: { key: "free_shipping_threshold", value: "100", group: "commerce" },
  });
  await prisma.siteSetting.upsert({
    where: { key: "currency" },
    update: { value: "JOD" },
    create: { key: "currency", value: "JOD", group: "commerce" },
  });

  await prisma.coupon.updateMany({
    where: { code: "CLICK10" },
    data: { minOrder: 50, maxDiscount: 50 },
  });

  await prisma.coupon.deleteMany({ where: { code: "WELCOME50" } });

  console.log("✅ Jordan settings updated in database.");
}

main()
  .finally(() => prisma.$disconnect());
