import { handler, json } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { Enquiry } from "@/models/Enquiry";

export const dynamic = "force-dynamic";

export const GET = handler(async (req) => {
  await requireAdmin(req);

  const since = new Date();
  since.setDate(since.getDate() - 13);
  since.setHours(0, 0, 0, 0);

  const [revenue, byStatus, daily, customers, newEnquiries, products, recentOrders] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
    ]),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { createdAt: { $gte: since }, status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    User.countDocuments({ role: "customer" }),
    Enquiry.countDocuments({ status: "new", type: { $ne: "newsletter" } }),
    Product.find({}, { name: 1, slug: 1, variants: 1, isActive: 1 }),
    Order.find().sort({ createdAt: -1 }).limit(6),
  ]);

  const lowStock = products.flatMap((p) =>
    p.variants
      .filter((v) => v.stock <= 10)
      .map((v) => ({ product: p.name, slug: p.slug, variant: v.label, stock: v.stock })),
  );

  return json({
    revenue: revenue[0]?.total ?? 0,
    orders: revenue[0]?.count ?? 0,
    ordersByStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
    daily,
    customers,
    newEnquiries,
    productCount: products.length,
    lowStock,
    recentOrders,
  });
});
