import jwt, { type SignOptions } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { User, type UserDoc } from "@/models/User";
import { HttpError } from "./http";

type TokenPayload = { sub: string; role: "customer" | "admin" };

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return s;
}

export function signToken(user: { _id: unknown; role: TokenPayload["role"] }) {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  };
  return jwt.sign({ sub: String(user._id), role: user.role }, secret(), options);
}

/** Returns the signed-in user, or null for guests / invalid tokens. */
export async function getAuthUser(req: NextRequest): Promise<UserDoc | null> {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, secret()) as TokenPayload;
    return await User.findById(payload.sub);
  } catch {
    return null;
  }
}

export async function requireUser(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) throw new HttpError(401, "Please log in to continue");
  return user;
}

export async function requireAdmin(req: NextRequest) {
  const user = await requireUser(req);
  if (user.role !== "admin") throw new HttpError(403, "Admin access required");
  return user;
}
