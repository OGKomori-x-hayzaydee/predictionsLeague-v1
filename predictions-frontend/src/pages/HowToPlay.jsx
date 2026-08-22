import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../components/ui/Container';
import Button from '../components/ui/buttons/Button';
import ChipToken from '../components/ui/ChipToken';
import Navbar from '../components/landingPage/Navbar';
import Footer from '../components/landingPage/Footer';
import { CHIP_TAGS } from '../components/chips/chipHues';
import { CHIP_ALMANAC_COPY } from '../components/chips/chipsDemoData';
import { CHIP_CONFIG } from '../utils/chipManager';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

const SECTIONS = [
  { id: 'basics', label: 'Basics' },
  { id: 'scoring', label: 'Scoring' },
  { id: 'chips', label: 'Chips' },
  { id: 'faq', label: 'FAQ' },
];

const SECTION_OFFSET = 'scroll-mt-[calc(var(--shell-nav-h,4.5rem)+4.25rem)] lg:scroll-mt-[calc(var(--shell-nav-h,4.5rem)+1.5rem)]';
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal';

const SCORING = [
  { val: '15', label: 'Exact scoreline, every scorer named', note: 'the full mark — the only way to reach it is to name them all' },
  { val: '10', label: 'Exact scoreline', note: 'right result, right numbers, scorers incomplete' },
  { val: '+2', label: 'Each scorer you call correctly', note: '4 apiece with Scorer Focus played' },
  { val: '7', label: 'Correct draw called', note: 'draws pay more than a right winner' },
  { val: '5', label: 'Right winner, wrong scoreline', note: 'a win is a win, but the numbers pay' },
  { val: '0', label: 'Wrong outcome', note: 'no consolation points, no partial credit' },
  { val: '−1', label: 'Per goal beyond two off the total', note: 'goal-difference penalty, applied before chips' },
  { val: '+5', label: 'Defence++ clean sheet', note: 'per correctly called clean sheet when the chip is on the week' },
];

const FEATURED_CHIPS = ['doubleDown', 'wildcard'];
const COMPACT_CHIPS = ['scorerFocus', 'defensePlusPlus', 'allInWeek'];

const FAQ = [
  {
    q: 'What teams are the “Big Six”?',
    a: 'Arsenal, Chelsea, Liverpool, Manchester City, Manchester United, and Tottenham Hotspur. Each gameweek you file slips for matches involving these sides.',
  },
  {
    q: 'What happens if a match is postponed?',
    a: 'That slip is voided — no points. You file again when it is rescheduled.',
  },
  {
    q: 'Can I change a filed slip?',
    a: 'Yes, until 45 minutes before kickoff. After that the stamp is locked.',
  },
  {
    q: 'Can I play more than one chip in a week?',
    a: 'Yes. Stack as many as cooldowns and caps allow, including both multipliers on one match. Defence++ and All-In Week can both sit on the same gameweek.',
  },
  {
    q: 'How are ties broken?',
    a: 'Most exact scorelines, then most correct scorers, then fewest negative points.',
  },
  {
    q: 'How many leagues can I join?',
    a: 'Up to 10 private leagues, and you can create up to 3 of your own.',
  },
  {
    q: 'What are the seasonal awards?',
    a: 'Prediction Champion (highest points), Oracle (most exact scorelines), Goalscorer Guru (most named scorers), and Monthly Stars for the top sheet each month.',
  },
];

function chipAvailability(id) {
  const chip = CHIP_CONFIG[id];
  if (chip?.seasonLimit) return `${chip.seasonLimit} per season`;
  if (!chip?.cooldown || chip.cooldown <= 1) return 'Every gameweek';
  return `${chip.cooldown} GW cooldown`;
}

function scrollToId(id, behavior = 'smooth') {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = window.matchMedia('(min-width: 1024px)').matches ? 96 : 132;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior });
}

function Stamp({ reduce }) {
  return (
    <span
      className={`${reduce ? '' : 'animate-[stampIn_0.5s_ease-out_both] '}rounded-sm border border-brand-teal px-2 py-1 text-xs font-semibold tracking-[0.12em] text-brand-teal`}
    >
      FILED
    </span>
  );
}

function FiledSlip({
  kicker,
  home,
  away,
  score,
  homeScorers,
  awayScorers,
  footerLeft,
  reduce,
  children,
}) {
  return (
    <article className="rounded-lg border border-border-card bg-surface-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <p className="font-outfit text-xs uppercase tracking-[0.14em] text-brand-teal">{kicker}</p>
        <Stamp reduce={reduce} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="font-dmSerif text-xl text-text-primary">{home}</span>
        <span className="font-dmSerif text-5xl text-text-primary">{score}</span>
        <span className="font-dmSerif text-xl text-text-primary">{away}</span>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {[...homeScorers, ...awayScorers].map((name) => (
          <span
            key={name}
            className="rounded-full border border-border-card bg-surface-elevated px-3 py-1 text-xs text-text-secondary"
          >
            {name}
          </span>
        ))}
      </div>
      {children}
      {footerLeft && (
        <div className="mt-4 flex items-center justify-between border-t border-dashed border-border-hairline pt-3">
          <span className="text-xs text-text-muted">{footerLeft}</span>
          <span className="font-outfit text-xs tracking-[0.12em] text-brand-teal">LEDGER</span>
        </div>
      )}
    </article>
  );
}

function AnchorNav({ activeId, variant = 'bar' }) {
  const reduce = usePrefersReducedMotion();
  const links = SECTIONS.map((s) => {
    const current = activeId === s.id;
    return (
      <a
        key={s.id}
        href={`#${s.id}`}
        aria-current={current ? 'true' : undefined}
        onClick={(e) => {
          e.preventDefault();
          scrollToId(s.id, reduce ? 'auto' : 'smooth');
          window.history.replaceState(null, '', `#${s.id}`);
        }}
        className={`rounded-md px-3 py-2 font-outfit text-sm whitespace-nowrap transition-colors ${FOCUS} ${
          current
            ? 'bg-surface-nav-active text-brand-teal'
            : 'text-text-muted hover:bg-surface-elevated hover:text-text-primary'
        } ${variant === 'rail' ? 'block w-full text-left' : ''}`}
      >
        {s.label}
      </a>
    );
  });

  if (variant === 'rail') {
    return (
      <nav
        aria-label="On this page"
        className="sticky top-[calc(var(--shell-nav-h,4.5rem)+1.5rem)] hidden flex-col gap-1 lg:flex"
      >
        <p className="mb-2 font-outfit text-xs uppercase tracking-[0.14em] text-text-muted">On this page</p>
        {links}
      </nav>
    );
  }

  return (
    <nav
      aria-label="On this page"
      className="sticky top-[var(--shell-nav-h,4.5rem)] z-40 border-b border-border-card bg-surface-header/90 backdrop-blur-md lg:hidden"
    >
      <Container size="4" className="px-4">
        <div className="flex gap-1 overflow-x-auto py-2">{links}</div>
      </Container>
    </nav>
  );
}

function FaqItem({ question, answer, reduce }) {
  const [open, setOpen] = useState(false);
  const panelId = `faq-${question.slice(0, 24).replace(/\W+/g, '-').toLowerCase()}`;

  return (
    <div className="overflow-hidden rounded-lg border border-border-card bg-surface-card">
      <button
        type="button"
        className={`flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-elevated ${FOCUS}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="font-outfit text-base font-medium text-text-primary">{question}</span>
        <svg
          width="14"
          height="8"
          viewBox="0 0 14 8"
          fill="none"
          className={`shrink-0 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="px-5 pt-0 pb-5 font-outfit text-sm leading-relaxed text-text-muted">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChipCard({ id, large }) {
  const hue = 'var(--brand-teal)';
  const tag = CHIP_TAGS[id];
  const name = CHIP_CONFIG[id]?.name || id;
  const copy = CHIP_ALMANAC_COPY[id] || {};

  return (
    <article
      className={`rounded-lg border border-border-card bg-surface-card p-5 ${large ? 'md:p-6' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <ChipToken tag={tag} hue={hue} size={large ? 52 : 36} />
          <div>
            <h3 className={`font-dmSerif text-text-primary ${large ? 'text-2xl' : 'text-lg'}`}>{name}</h3>
            <p className="font-outfit text-xs text-text-muted">{chipAvailability(id)}</p>
          </div>
        </div>
        <span className="rounded-sm border border-brand-teal px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-brand-teal uppercase">
          {CHIP_CONFIG[id]?.scope === 'gameweek' ? 'Week' : 'Match'}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-text-muted">{copy.explain}</p>
      {copy.forWhat && <p className="mt-2 text-sm text-text-secondary">{copy.forWhat}</p>}
    </article>
  );
}

export default function HowToPlay() {
  const [activeSection, setActiveSection] = useState('basics');
  const location = useLocation();
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-140px 0px -45% 0px', threshold: 0.1 }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const id = location.hash.replace('#', '');
    if (!id) return;
    const t = window.setTimeout(() => scrollToId(id, reduce ? 'auto' : 'smooth'), 50);
    return () => window.clearTimeout(t);
  }, [location.hash, reduce]);

  return (
    <div className="min-h-dvh bg-surface-app text-text-primary">
      <Navbar />

      <section className="bg-surface-app pt-28 pb-10 md:pt-32 md:pb-12">
        <Container size="4" className="px-6">
          <div className="mx-auto max-w-lg">
            <p className="text-center font-outfit text-xs uppercase tracking-[0.14em] text-brand-teal">
              How to play
            </p>
            <h1 className="mt-2 text-center font-dmSerif text-2xl text-text-muted md:text-3xl">
              The rules live on the slip
            </h1>
            <div className="relative mt-8">
              <p className="mb-2 hidden font-outfit text-xs tracking-[0.14em] text-text-muted uppercase md:block">
                Scoreline first
              </p>
              <FiledSlip
                kicker="Saturday 15:00"
                home="Arsenal"
                away="Chelsea"
                score="2–1"
                homeScorers={['Saka', 'Ødegaard']}
                awayScorers={['Palmer']}
                footerLeft="Ceiling 21 pts if every name lands"
                reduce={reduce}
              />
              <p className="mt-3 text-center font-outfit text-xs text-text-muted md:text-left">
                Teal stamp = filed. Numbers are the call. Scorers sit under the line.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <AnchorNav activeId={activeSection} />

      <Container size="4" className="px-6 pb-20">
        <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12 lg:pt-10">
          <AnchorNav activeId={activeSection} variant="rail" />

          <div className="flex flex-col gap-20 pt-12 lg:pt-0">
            <section id="basics" className={SECTION_OFFSET}>
              <p className="font-outfit text-xs uppercase tracking-[0.14em] text-brand-teal">The week</p>
              <h2 className="mt-2 font-dmSerif text-3xl text-text-primary">File six slips, then lock</h2>
              <ol className="mt-8 space-y-5 border-l border-border-card pl-5">
                {[
                  ['Big Six only', 'Arsenal, Chelsea, Liverpool, City, United, Spurs — every gameweek.'],
                  ['Write the call', 'Scoreline first, then scorers, then chips on the same slip.'],
                  ['45-minute lock', 'Edit until 45 minutes before kickoff. After that the stamp holds.'],
                ].map(([title, body]) => (
                  <li key={title}>
                    <h3 className="font-dmSerif text-xl text-text-primary">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-text-muted">{body}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section id="scoring" className={SECTION_OFFSET}>
              <p className="font-outfit text-xs uppercase tracking-[0.14em] text-brand-teal">What a call is worth</p>
              <h2 className="mt-2 font-dmSerif text-3xl text-text-primary">Match points</h2>
              <p className="mt-3 max-w-xl text-sm text-text-muted">
                One ledger. Chips multiply after the line is scored — Defence++ is the clean-sheet bonus on the same sheet.
              </p>

              <div className="mt-8 overflow-hidden rounded-lg border border-border-card bg-surface-card">
                <table className="w-full text-left">
                  <caption className="sr-only">Match points</caption>
                  <tbody>
                    {SCORING.map((row, i) => (
                      <tr key={row.label} className={i > 0 ? 'border-t border-border-hairline' : ''}>
                        <th
                          scope="row"
                          className="w-16 px-4 py-3.5 font-dmSerif text-2xl font-normal text-brand-teal md:w-20 md:text-3xl"
                        >
                          {row.val}
                        </th>
                        <td className="px-2 py-3.5 pr-4">
                          <p className="font-outfit text-sm text-text-primary md:text-base">{row.label}</p>
                          <p className="mt-0.5 text-xs text-text-muted md:text-sm">{row.note}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 max-w-lg">
                <FiledSlip
                  kicker="Worked example · GW 8"
                  home="United"
                  away="Liverpool"
                  score="2–1"
                  homeScorers={['Rashford', 'Fernandes']}
                  awayScorers={[]}
                  reduce={true}
                >
                  <dl className="mt-5 space-y-2 border-t border-dashed border-border-hairline pt-4 font-outfit text-sm">
                    <div className="flex justify-between gap-4 text-text-muted">
                      <dt>Actual</dt>
                      <dd className="text-text-secondary">2–1 · Rashford, Sancho</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-text-muted">Exact scoreline</dt>
                      <dd className="font-dmSerif text-xl text-text-primary">10</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-text-muted">Rashford named</dt>
                      <dd className="font-dmSerif text-xl text-text-primary">+2</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-text-muted">Fernandes missed</dt>
                      <dd className="font-dmSerif text-xl text-text-muted">0</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-border-hairline pt-2">
                      <dt className="text-text-primary">This slip</dt>
                      <dd className="font-dmSerif text-3xl text-brand-teal">12</dd>
                    </div>
                  </dl>
                </FiledSlip>
              </div>
            </section>

            <section id="chips" className={SECTION_OFFSET}>
              <p className="font-outfit text-xs uppercase tracking-[0.14em] text-brand-teal">Stamps</p>
              <h2 className="mt-2 font-dmSerif text-3xl text-text-primary">Chips on the slip</h2>
              <p className="mt-3 max-w-xl text-sm text-text-muted">
                Double Down and Wildcard are the swing calls. The other three are quieter — still teal-stamped, not a rainbow board.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {FEATURED_CHIPS.map((id) => (
                  <ChipCard key={id} id={id} large />
                ))}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {COMPACT_CHIPS.map((id) => (
                  <ChipCard key={id} id={id} />
                ))}
              </div>
            </section>

            <section id="faq" className={SECTION_OFFSET}>
              <p className="font-outfit text-xs uppercase tracking-[0.14em] text-brand-teal">Common questions</p>
              <h2 className="mt-2 font-dmSerif text-3xl text-text-primary">FAQ</h2>
              <div className="mt-8 max-w-3xl space-y-3">
                {FAQ.map((item) => (
                  <FaqItem key={item.q} question={item.q} answer={item.a} reduce={reduce} />
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border-card bg-surface-bar px-6 py-10 text-center">
              <h2 className="font-dmSerif text-3xl text-text-primary">Ready to file this weekend?</h2>
              <p className="mx-auto mt-3 max-w-md text-text-muted">
                Open a ledger, stamp a gameweek, and climb with people you actually watch matches with.
              </p>
              <div className="mt-6 flex justify-center">
                <Link to="/signup">
                  <Button size="lg">Sign up free</Button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
}
