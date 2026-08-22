import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import Button from '../ui/buttons/Button';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

export default function HeroSection() {
  const reduce = usePrefersReducedMotion();

  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden bg-surface-app pt-24">
      <Container size="4" className="relative z-10 px-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="relative w-full max-w-lg">
            <div className="rounded-lg border border-border-card bg-surface-card p-6 shadow-card sm:p-8">
              <p className="font-outfit text-xs uppercase tracking-[0.14em] text-brand-teal">Saturday 15:00 · GW8</p>
              <div className="mt-6 flex items-center justify-between gap-3">
                <span className="min-w-0 flex-1 text-left font-dmSerif text-2xl text-text-primary sm:text-3xl">Arsenal</span>
                <span className="font-dmSerif text-6xl leading-none text-text-primary sm:text-7xl">2–1</span>
                <span className="min-w-0 flex-1 text-right font-dmSerif text-2xl text-text-primary sm:text-3xl">Chelsea</span>
              </div>
              <div className="mt-6 flex items-end justify-between border-t border-dashed border-border-hairline pt-4">
                <span className="text-left text-xs text-text-muted">Saka · Havertz · Ceiling 18</span>
                <span
                  className={`${reduce ? '' : 'animate-[stampIn_0.5s_ease-out_both] '}rotate-[-8deg] rounded-sm border-[3px] border-brand-teal px-3 py-1 text-sm font-semibold tracking-[0.14em] text-brand-teal`}
                >
                  FILED
                </span>
              </div>
            </div>
          </div>

          <h1 className="mt-10 font-dmSerif text-4xl leading-[1.05] text-text-primary sm:text-6xl">
            Matchday ledger
          </h1>
          <p className="mt-4 max-w-xl font-outfit text-base leading-relaxed text-text-muted sm:text-lg">
            File the scoreline. Stamp it. Premier League predictions as slips and chips — not a generic fantasy board.
          </p>
          <Link to="/signup" className="mt-8">
            <Button size="lg">Open your ledger</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
