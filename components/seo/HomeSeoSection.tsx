import { Link } from "@/i18n/navigation";

export default function HomeSeoSection({
  eyebrow,
  title,
  body,
  resourcesTitle,
  resourceLabels,
}: {
  eyebrow: string;
  title: string;
  body: string[];
  resourcesTitle: string;
  resourceLabels: {
    glycine: string;
    glycolic: string;
    docs: string;
    manufacturing: string;
  };
}) {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container-inner">
        <p className="font-semibold text-primary text-sm uppercase tracking-[0.18em]">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl font-extrabold text-off-black text-3xl md:text-4xl leading-tight">
          {title}
        </h1>
        <div className="bg-light-dark mt-4 mb-6 w-16 h-px" />
        <div className="gap-6 grid lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
          <div className="space-y-4 max-w-4xl text-medium-dark leading-relaxed">
            {body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <aside className="bg-gray-section p-6 rounded-sm">
            <h3 className="font-bold text-off-black text-lg">{resourcesTitle}</h3>
            <div className="bg-light-dark mt-3 mb-4 w-12 h-px" />
            <div className="space-y-3 text-sm leading-relaxed">
              <Link
                href="/product/amino-acids/avigly-hp"
                className="block text-primary underline-offset-4 hover:underline"
              >
                {resourceLabels.glycine}
              </Link>
              <Link
                href="/product/alpha-hydroxy-acids/aviga-t"
                className="block text-primary underline-offset-4 hover:underline"
              >
                {resourceLabels.glycolic}
              </Link>
              <Link
                href="/media/downloads"
                className="block text-primary underline-offset-4 hover:underline"
              >
                {resourceLabels.docs}
              </Link>
              <Link
                href="/about-us/manufacturing-excellence"
                className="block text-primary underline-offset-4 hover:underline"
              >
                {resourceLabels.manufacturing}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
