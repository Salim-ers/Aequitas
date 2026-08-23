/**
 * Attribution du rôle plateforme.
 *
 * §98 — Il n'existe volontairement aucune interface pour se promouvoir
 * soi-même : ce serait une élévation de privilège à un clic. Le rôle est
 * accordé hors bande, par quelqu'un qui détient déjà le DATABASE_URL.
 *
 *   npx tsx scripts/grant-admin.ts vous@exemple.fr
 *   npx tsx scripts/grant-admin.ts vous@exemple.fr --revoke
 *
 * `better-auth` déclare `platformRole` avec `input: false` : la colonne ne
 * peut pas être renseignée à l'inscription, même en forgeant la requête.
 */
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

const ROLE_GRANTED = "ADMIN";
const ROLE_REVOKED = "USER";

function log(event: string, extra: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ level: "info", event, ...extra }));
}

async function main(): Promise<void> {
  const [email, ...flags] = process.argv.slice(2);
  const revoke = flags.includes("--revoke");

  if (!email || !email.includes("@")) {
    console.error("Usage : npx tsx scripts/grant-admin.ts <email> [--revoke]");
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL absent. Exportez-le avant de lancer ce script.");
    process.exit(1);
  }

  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString });
  const role = revoke ? ROLE_REVOKED : ROLE_GRANTED;

  try {
    const result = await pool.query<{ id: string; email: string; platform_role: string }>(
      `update users
          set platform_role = $1::platform_role, updated_at = now()
        where lower(email) = lower($2)
        returning id, email, platform_role`,
      [role, email],
    );

    const user = result.rows[0];
    if (!user) {
      console.error(
        `Aucun compte pour « ${email} ». Créez-le d'abord via /inscription, puis relancez.`,
      );
      process.exitCode = 1;
      return;
    }

    log(revoke ? "admin.revoked" : "admin.granted", {
      email: user.email,
      platformRole: user.platform_role,
    });
    console.log(
      revoke
        ? `Rôle plateforme retiré à ${user.email}.`
        : `${user.email} est administrateur plateforme. L'espace /admin lui est ouvert.`,
    );
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "admin.grant_failed",
        message: error instanceof Error ? error.message : "unknown",
      }),
    );
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

void main();
