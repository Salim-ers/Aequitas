import { sql } from "drizzle-orm";
import { timestamp, uuid, numeric } from "drizzle-orm/pg-core";

/** Colonnes communes : UUID applicatif + horodatages timestamptz (§5). */
export const idColumn = () => uuid("id").primaryKey().defaultRandom();

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
};

/** Montant monétaire : numeric(19,4), lu en string par le driver (§83). */
export const money = (name: string) => numeric(name, { precision: 19, scale: 4 });

/** Taux exprimé en pourcentage, ex. 20.0000. */
export const rate = (name: string) => numeric(name, { precision: 9, scale: 4 });

/** Quantité décimale. */
export const quantity = (name: string) => numeric(name, { precision: 19, scale: 6 });
