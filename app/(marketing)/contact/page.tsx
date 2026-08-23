import type { Metadata } from "next";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question sur Aequitas, une demande Enterprise, un incident de sécurité.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-4 font-display text-[2.25rem] leading-tight tracking-[-0.015em] text-ink">
            Nous écrire
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-slate">
            Pour une demande Enterprise, une question sur la facturation électronique, ou
            le signalement d&apos;une vulnérabilité.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-5 py-14">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
