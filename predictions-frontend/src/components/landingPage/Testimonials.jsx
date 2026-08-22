import Container from '../ui/Container';

export default function Testimonials() {
  return (
    <section className="bg-surface-app py-16 md:py-24">
      <Container size="4" className="px-6">
        <figure className="mx-auto max-w-2xl rounded-lg border border-border-card bg-surface-card px-6 py-8 shadow-card md:px-10">
          <p className="font-outfit text-xs uppercase tracking-[0.14em] text-brand-teal">From a private league</p>
          <blockquote className="mt-4 font-dmSerif text-2xl leading-snug text-text-primary md:text-3xl">
            “The banter when someone’s bold call actually comes off is the whole point. We file slips, not spreadsheets.”
          </blockquote>
          <figcaption className="mt-6 font-outfit text-sm text-text-muted">
            Sarah M. · Liverpool supporter, five-person league
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
