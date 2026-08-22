import Container from '../ui/Container';

export default function AppPreview() {
  return (
    <section className="bg-surface-bar py-16 md:py-24">
      <Container size="4" className="px-6">
        <p className="font-outfit text-xs uppercase tracking-[0.14em] text-brand-teal">The desk</p>
        <h2 className="mt-2 font-dmSerif text-3xl text-text-primary md:text-4xl">Foil first. Rail in orbit.</h2>
        <p className="mt-3 max-w-xl text-text-muted">
          The next fixture is a collectible slip. Everything else — chips, rivals, last week — sits around it.
        </p>
        <div className="relative mt-10 overflow-hidden rounded-lg border border-border-card bg-surface-card p-6 shadow-card">
          <span className="pointer-events-none absolute inset-0 animate-[cardShimmer_2.8s_ease-in-out_1] bg-[linear-gradient(110deg,transparent_40%,color-mix(in_srgb,var(--brand-teal)_18%,transparent)_50%,transparent_60%)]" />
          <div className="relative flex items-center justify-between gap-3 border-b border-border-hairline pb-3">
            <span className="font-outfit text-xs uppercase tracking-[0.14em] text-brand-teal">Next up · GW8</span>
            <span className="text-xs text-text-muted">4 of 6 filed</span>
          </div>
          <div className="relative mt-8 flex flex-col items-center gap-3">
            <span className="text-xs uppercase tracking-[0.14em] text-text-muted">Saturday 17:30</span>
            <div className="flex w-full items-center justify-center gap-6">
              <span className="font-dmSerif text-2xl text-text-primary">Liverpool</span>
              <span className="font-dmSerif text-6xl leading-none text-text-primary lg:text-7xl">1–1</span>
              <span className="font-dmSerif text-2xl text-text-primary">City</span>
            </div>
            <span className="mt-2 rotate-[-8deg] rounded-sm border-[3px] border-brand-teal px-3 py-1 text-xs font-semibold tracking-[0.14em] text-brand-teal">
              FILED
            </span>
            <span className="font-outfit text-2xs text-text-muted">Ceiling 14 · Double Down on the table</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
