import bcrypt from "bcryptjs";
import { handler, HttpError, json, readJson } from "@/lib/http";
import { signToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";
import { User } from "@/models/User";

export const POST = handler(async (req) => {
  const data = registerSchema.parse(await readJson(req));
  if (await User.exists({ email: data.email })) {
    throw new HttpError(409, "An account with this email already exists");
  }
  const user = await User.create({
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    passwordHash: await bcrypt.hash(data.password, 10),
  });
  return json({ token: signToken(user), user }, 201);
});
