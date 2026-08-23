import Stripe from "stripe";
import { stripeEnv } from "@/src/lib/env";

/** §14 — Client Stripe, instancié paresseusement pour ne pas casser un build sans clés. */

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!client) {
    const { STRIPE_SECRET_KEY } = stripeEnv();
    client = new Stripe(STRIPE_SECRET_KEY, {
      appInfo: { name: "Aequitas", url: "https://aequitas.fr" },
      typescript: true,
      maxNetworkRetries: 2,
    });
  }
  return client;
}
