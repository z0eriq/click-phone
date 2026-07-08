import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthFromRequest, isAdmin } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthFromRequest(request);
    if (!session || !isAdmin(session.role)) {
      return apiError("Unauthorized", 401);
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      todayOrders,
      monthOrders,
      todayRevenue,
      monthRevenue,
      lastMonthRevenue,
      topProducts,
      topCustomers,
      recentOrders,
      ordersByStatus,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfDay }, paymentStatus: "PAID" },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfMonth }, paymentStatus: "PAID" },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
          paymentStatus: "PAID",
        },
        _sum: { total: true },
      }),
      prisma.orderItem.groupBy({
        by: ["productId", "name"],
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.order.groupBy({
        by: ["userId"],
        _sum: { total: true },
        _count: true,
        orderBy: { _sum: { total: "desc" } },
        take: 5,
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: true,
      }),
    ]);

    // Monthly sales chart data (last 6 months)
    const salesChart = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const revenue = await prisma.order.aggregate({
        where: {
          createdAt: { gte: monthStart, lte: monthEnd },
          paymentStatus: "PAID",
        },
        _sum: { total: true },
        _count: true,
      });
      salesChart.push({
        month: monthStart.toLocaleString("en", { month: "short" }),
        revenue: Number(revenue._sum.total || 0),
        orders: revenue._count,
      });
    }

    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lte: 5 }, isActive: true },
      select: { id: true, name: true, stock: true, sku: true },
      take: 10,
    });

    return apiResponse({
      stats: {
        totalOrders,
        totalCustomers,
        totalProducts,
        todayOrders,
        monthOrders,
        todayRevenue: Number(todayRevenue._sum.total || 0),
        monthRevenue: Number(monthRevenue._sum.total || 0),
        lastMonthRevenue: Number(lastMonthRevenue._sum.total || 0),
        profit: Number(monthRevenue._sum.total || 0) * 0.25,
      },
      topProducts: topProducts.map((p) => ({
        name: p.name,
        quantity: p._sum.quantity,
        revenue: Number(p._sum.total || 0),
      })),
      topCustomers,
      recentOrders: recentOrders.map((o) => ({
        ...o,
        total: Number(o.total),
      })),
      ordersByStatus,
      salesChart,
      lowStockProducts,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return apiError("Failed to fetch dashboard data", 500);
  }
}
