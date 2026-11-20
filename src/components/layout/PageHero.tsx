interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="border-b border-border bg-card">
      <div className="section-container py-10 md:py-14">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-navy md:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>}
      </div>
    </section>
  );
}
