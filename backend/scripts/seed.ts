/**
 * Seeds products, site settings and the first admin account.
 *   npm run seed            -> inserts anything missing, never overwrites admin edits
 *   npm run seed -- --reset -> overwrites the seeded products with the catalogue defaults
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Product } from "../src/models/Product";
import { User } from "../src/models/User";
import { getSettings } from "../src/models/Settings";
import { catalog } from "./catalog";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set in .env");
  const reset = process.argv.includes("--reset");

  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "kanhaiya_vedics" });
  console.log(`Connected to database "${mongoose.connection.name}"`);

  for (const product of catalog) {
    const res = await Product.updateOne(
      { slug: product.slug },
      reset ? { $set: product } : { $setOnInsert: product },
      { upsert: true },
    );
    console.log(`  product ${product.slug}: ${res.upsertedCount ? "created" : reset ? "reset" : "exists"}`);
  }

  await getSettings();
  console.log("  settings: ready");

  const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.role !== "admin") {
        existing.role = "admin";
        await existing.save();
      }
      console.log(`  admin ${email}: exists`);
    } else {
      await User.create({
        name: process.env.ADMIN_NAME || "Admin",
        email,
        role: "admin",
        passwordHash: await bcrypt.hash(password, 10),
      });
      console.log(`  admin ${email}: created`);
    }
  }

  await Promise.all([Product.syncIndexes(), User.syncIndexes()]);
  await mongoose.disconnect();
  console.log("Seed complete.");
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
