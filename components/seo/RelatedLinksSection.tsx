import { Link } from "@/i18n/navigation";

export type RelatedLinkItem = {
  href: string;
  title: string;
  description: string;
};

export default function RelatedLinksSection({
  title,
  links,
}: {
  title: string;
  links: RelatedLinkItem[];
}) {
  if (!links.length) return null;

  return (
    <section className="bg-gray-section py-12 md:py-16">
      <div className="container-inner">
        <h2 className="font-extrabold text-off-black text-2xl md:text-3xl">{title}</h2>
        <div className="bg-light-dark mt-3 mb-6 w-12 h-px" />
        <div className="gap-6 grid md:grid-cols-2 xl:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block bg-white p-6 rounded-sm border border-border hover:border-primary transition-colors"
            >
              <h3 className="font-bold text-off-black text-lg">{link.title}</h3>
              <p className="mt-3 text-medium-dark leading-relaxed">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
