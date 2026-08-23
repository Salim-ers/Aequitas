import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "@/src/database/client";
import { isDatabaseConfigured, isStripeConfigured } from "@/src/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Sonde de déploiement : ne révèle aucun secret, uniquement des booléens. */
export async function GET(): Promise<NextResponse> {
  const checks = {
    database: false,
    stripe: isStripeConfigured(),
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    environment: process.env.VERCEL_ENV ?? "development",
  };

  if (isDatabaseConfigured()) {
    try {
      await getDb().execute(sql`select 1`);
      checks.database = true;
    } catch {
      checks.database = false;
    }
  }

  const healthy = checks.database;
  return NextResponse.json(checks, { status: healthy ? 200 : 503 });
}
