"use client";

import { FaqItem } from "@/lib/seo";

export default function FaqSection({ title, faqs }: { title: string; faqs: FaqItem[] }) {
  if (!faqs?.length) return null;

  return (
    <section className="container-inner py-16">
      <h2 className="mb-8 font-extrabold text-3xl text-primary">{title}</h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={`${faq.question}-${index}`} className="border-b border-border pb-4">
            <h3 className="font-bold text-off-black text-lg">{faq.question}</h3>
            <p className="mt-2 text-medium-dark leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
