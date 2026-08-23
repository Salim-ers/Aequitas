import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/src/auth/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Le handler est construit à la demande : rien ne doit exiger DATABASE_URL
 * au moment du build, seulement au moment de la requête.
 */
export async function GET(request: Request): Promise<Response> {
  return toNextJsHandler(getAuth()).GET(request);
}

export async function POST(request: Request): Promise<Response> {
  return toNextJsHandler(getAuth()).POST(request);
}
