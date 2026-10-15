import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";

/**
 * Called by the admin panel after saving products or settings so the public pages update
 * immediately. The caller's token is verified against the backend — only admins may trigger it.
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${API_URL}/api/auth/me`, { headers: { authorization: auth }, cache: "no-store" }).catch(() => null);
  const data = res?.ok ? await res.json() : null;
  if (data?.user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { tags } = (await req.json().catch(() => ({}))) as { tags?: string[] };
  for (const tag of tags?.length ? tags : ["settings", "products"]) revalidateTag(tag);
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true });
}
