/**
 * §61 — Migrations exécutées depuis le cloud.
 * Lancé par GitHub Actions (job `migrate`) avec le DATABASE_URL de
 * l'environnement ciblé. Aucune installation locale de PostgreSQL n'est requise.
 *
 *   npx tsx scripts/migrate.ts
 */
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import ws from "ws";

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL absent. Ajoutez-le dans les secrets du workflow.");
    process.exit(1);
  }

  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString });

  try {
    const db = drizzle(pool);
    console.log(JSON.stringify({ level: "info", event: "migrate.start" }));
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log(JSON.stringify({ level: "info", event: "migrate.done" }));
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "migrate.failed",
        message: error instanceof Error ? error.message : "unknown",
      }),
    );
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

void main();
