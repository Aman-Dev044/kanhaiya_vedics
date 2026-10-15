import mongoose from "mongoose";
import { handler, json } from "@/lib/http";

export const dynamic = "force-dynamic";

export const GET = handler(async () =>
  json({
    ok: true,
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date(),
  }),
);
