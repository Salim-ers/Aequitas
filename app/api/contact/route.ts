import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";
import { getDb } from "@/src/database/client";
import { contactMessages } from "@/src/database/schema";
import { logger } from "@/src/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** §72 — Formulaire de contact réel : stockage en base + anti-spam. */

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  company: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(10).max(4000),
  // Champ piège : rempli uniquement par un robot.
  website: z.string().max(0).optional().or(z.literal("")),
});

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Vérifiez les champs du formulaire." },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    // Le piège a été rempli : on répond comme si tout allait bien, sans écrire.
    logger.info("contact.honeypot_triggered");
    return NextResponse.json({ received: true });
  }

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const ipHash = forwarded
    ? createHash("sha256").update(`${forwarded}:${process.env.AUTH_SECRET ?? ""}`).digest("hex")
    : null;

  await getDb().insert(contactMessages).values({
    name: parsed.data.name,
    email: parsed.data.email,
    company: parsed.data.company || null,
    message: parsed.data.message,
    ipHash,
  });

  logger.info("contact.message_received");
  return NextResponse.json({ received: true });
}
