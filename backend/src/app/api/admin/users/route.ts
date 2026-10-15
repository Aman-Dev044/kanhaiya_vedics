import { handler, json, escapeRegex } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { User } from "@/models/User";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

export const GET = handler(async (req) => {
  await requireAdmin(req);
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const filter = q
    ? { $or: ["name", "email", "phone"].map((f) => ({ [f]: new RegExp(escapeRegex(q), "i") })) }
    : {};
  const users = await User.find(filter).sort({ createdAt: -1 }).limit(500).lean();

  const totals = await Order.aggregate([
    { $match: { user: { $in: users.map((u) => u._id) }, status: { $ne: "cancelled" } } },
    { $group: { _id: "$user", orders: { $sum: 1 }, spent: { $sum: "$total" } } },
  ]);
  const byUser = new Map(totals.map((t) => [String(t._id), t]));

  return json({
    users: users.map(({ passwordHash: _p, __v: _v, ...u }) => ({
      ...u,
      orders: byUser.get(String(u._id))?.orders ?? 0,
      spent: byUser.get(String(u._id))?.spent ?? 0,
    })),
  });
});
