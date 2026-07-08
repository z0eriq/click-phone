import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthFromRequest, logActivity } from "@/lib/auth";
import { apiResponse, apiError, rateLimit } from "@/lib/api-utils";
import { generateOrderNumber, TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { z } from "zod";

const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().min(1),
      price: z.number(),
      name: z.string(),
      sku: z.string(),
    })
  ).min(1),
  shippingName: z.string().min(2),
  shippingPhone: z.string().min(7),
  shippingAddress: z.string().min(5),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 10, 60000);
  if (limited) return limited;

  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) return apiError("Invalid order data", 400);

    const session = await getAuthFromRequest(request);
    const { items, shippingName, shippingPhone, shippingAddress, notes, couponCode } = parsed.data;

    let subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    let couponId: string | undefined;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive) {
        if (coupon.discountType === "percentage") {
          discount = subtotal * (Number(coupon.discountValue) / 100);
          if (coupon.maxDiscount) discount = Math.min(discount, Number(coupon.maxDiscount));
        } else {
          discount = Number(coupon.discountValue);
        }
        couponId = coupon.id;
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * TAX_RATE;
    const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = afterDiscount + tax + shipping;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session?.userId,
        couponId,
        subtotal,
        discount,
        tax,
        shipping,
        total,
        shippingName,
        shippingPhone,
        shippingAddress,
        notes,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // Update stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          salesCount: { increment: item.quantity },
        },
      });
    }

    if (session) {
      await logActivity(session.userId, "CREATE_ORDER", "Order", order.id, undefined, request);
      await prisma.notification.create({
        data: {
          userId: session.userId,
          type: "ORDER",
          title: "Order Placed",
          titleAr: "تم إنشاء الطلب",
          message: `Your order #${order.orderNumber} has been placed successfully.`,
          messageAr: `تم إنشاء طلبك #${order.orderNumber} بنجاح.`,
          link: `/account/orders/${order.id}`,
        },
      });
    }

    return apiResponse({ order: { id: order.id, orderNumber: order.orderNumber, total: Number(order.total) } });
  } catch (error) {
    console.error("Order error:", error);
    return apiError("Failed to create order", 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthFromRequest(request);
    if (!session) return apiError("Unauthorized", 401);

    const orders = await prisma.order.findMany({
      where: { userId: session.userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return apiResponse({
      orders: orders.map((o) => ({
        ...o,
        subtotal: Number(o.subtotal),
        discount: Number(o.discount),
        tax: Number(o.tax),
        shipping: Number(o.shipping),
        total: Number(o.total),
      })),
    });
  } catch {
    return apiError("Failed to fetch orders", 500);
  }
}
