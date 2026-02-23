"use client";

import { InfoSection } from "@/lib/seo-content";

export default function InfoSections({ title, sections }: { title: string; sections: InfoSection[] }) {
  if (!sections?.length) return null;

  return (
    <section className="container-inner py-16">
      <h2 className="mb-8 font-extrabold text-3xl text-primary">{title}</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {sections.map((section, index) => (
          <article key={`${section.title}-${index}`}>
            <h3 className="font-bold text-off-black text-lg">{section.title}</h3>
            <p className="mt-2 text-medium-dark leading-relaxed">{section.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
