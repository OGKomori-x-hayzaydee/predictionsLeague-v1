import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

const STEPS = [
  { n: '01', title: 'Open the slip', body: 'Big Six fixtures land on the desk as filing slips — not a fixture dump.' },
  { n: '02', title: 'Call the line', body: 'Home, away, scorers. The stamp waits until you file.' },
  { n: '03', title: 'Week locks', body: 'Chips sit on the slip. Deadlines close 45 minutes before kickoff.' },
];

export default function HowItWorks() {
  const reduce = usePrefersReducedMotion();

  return (
    <section className="bg-surface-app py-16 md:py-24">
      <Container size="4" className="px-6">
        <p className="font-outfit text-xs uppercase tracking-[0.14em] text-brand-teal">The week</p>
        <h2 className="mt-2 font-dmSerif text-3xl text-text-primary md:text-4xl">File, then stamp</h2>
        <p className="mt-3 max-w-xl text-text-muted">
          Same motion as the foil above — pick a fixture, write the scoreline, lock the week.
        </p>

        <div className="relative mt-10">
          <motion.div
            className="absolute top-4 right-[12%] left-[12%] hidden h-px bg-brand-teal/35 md:block"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: 'left' }}
          />
          <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
            {STEPS.map((step) => (
              <li key={step.n} className="relative">
                <span className="font-dmSerif text-3xl text-brand-teal">{step.n}</span>
                <h3 className="mt-2 font-dmSerif text-xl text-text-primary">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-10 font-outfit text-sm text-text-muted">
          Want the numbers?{' '}
          <Link
            to="/howToPlay#scoring"
            className="text-brand-teal underline decoration-brand-teal/40 underline-offset-4 hover:text-brand-teal-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
          >
            Scoring ledger
          </Link>
        </p>
      </Container>
    </section>
  );
}
