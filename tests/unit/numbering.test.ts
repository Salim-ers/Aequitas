import { describe, expect, it } from "vitest";
import { formatDocumentNumber } from "@/src/invoices/numbering";

describe("Numérotation des documents", () => {
  it("respecte le format PREFIX-ANNEE-SEQUENCE", () => {
    expect(formatDocumentNumber("AEQ", 2026, 1)).toBe("AEQ-2026-000001");
    expect(formatDocumentNumber("AEQ", 2026, 148)).toBe("AEQ-2026-000148");
  });

  it("ne tronque pas au-delà du remplissage prévu", () => {
    expect(formatDocumentNumber("AEQ", 2026, 1234567)).toBe("AEQ-2026-1234567");
  });

  it("accepte un remplissage personnalisé", () => {
    expect(formatDocumentNumber("DEV", 2026, 7, 4)).toBe("DEV-2026-0007");
  });
});
