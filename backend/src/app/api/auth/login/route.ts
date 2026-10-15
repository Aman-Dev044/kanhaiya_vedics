import bcrypt from "bcryptjs";
import { handler, HttpError, json, readJson } from "@/lib/http";
import { signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { User } from "@/models/User";

export const POST = handler(async (req) => {
  const { email, password } = loginSchema.parse(await readJson(req));
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, "Incorrect email or password");
  }
  return json({ token: signToken(user), user });
});
