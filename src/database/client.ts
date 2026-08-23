import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema";
import { serverEnv } from "@/src/lib/env";

/**
 * §5 / §61 — Neon PostgreSQL via l'intégration Vercel Marketplace.
 * Le pool WebSocket est utilisé (et non neon-http) parce que la numérotation
 * de factures exige de vraies transactions SQL.
 * Initialisation paresseuse : un build sans DATABASE_URL ne doit pas échouer.
 */

if (typeof WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

export type Database = NeonDatabase<typeof schema>;

let pool: Pool | null = null;
let dbInstance: Database | null = null;

export function getDb(): Database {
  if (!dbInstance) {
    const { DATABASE_URL } = serverEnv();
    pool = new Pool({ connectionString: DATABASE_URL });
    dbInstance = drizzle(pool, { schema, casing: "snake_case" });
  }
  return dbInstance;
}

export { schema };
