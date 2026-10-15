import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { connectDB } from "./db";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export function json<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

function toErrorResponse(err: unknown) {
  if (err instanceof HttpError) {
    return json({ error: err.message, details: err.details }, err.status);
  }
  if (err instanceof ZodError) {
    return json(
      {
        error: err.issues[0]?.message || "Invalid request",
        details: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      400,
    );
  }
  if (err instanceof mongoose.Error.CastError) {
    return json({ error: "Invalid id" }, 400);
  }
  if (typeof err === "object" && err && "code" in err && (err as { code: number }).code === 11000) {
    return json({ error: "A record with these details already exists" }, 409);
  }
  console.error("[api] unhandled error:", err);
  return json({ error: "Something went wrong. Please try again." }, 500);
}

type Ctx<P> = { params: Promise<P> };

/** Wraps a route handler with DB connection + uniform error handling. */
export function handler<P = Record<string, string>>(
  fn: (req: NextRequest, ctx: Ctx<P>) => Promise<Response>,
) {
  return async (req: NextRequest, ctx: Ctx<P>) => {
    try {
      await connectDB();
      return await fn(req, ctx);
    } catch (err) {
      return toErrorResponse(err);
    }
  };
}

export async function readJson(req: NextRequest) {
  try {
    return await req.json();
  } catch {
    throw new HttpError(400, "Request body must be valid JSON");
  }
}

export function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
