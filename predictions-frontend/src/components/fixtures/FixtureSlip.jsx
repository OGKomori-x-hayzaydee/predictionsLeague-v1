import TeamCrest from '../ui/TeamCrest';
import { buildLedgerRows, namedScorers, slipHeadline } from './predictionLedger';

function formatKickoff(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.toLocaleDateString(undefined, { weekday: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} ${time}`;
}

/**
 * The prediction slip in its "resting" (non-editing) presentation —
 * Spine.dc.html's "newspaper back page" filed card / amber unfiled CTA
 * (desktop lines 540-575 + 684-751, mobile lines 2359-2406). Used both as
 * the desktop right-rail preview (`variant="rail"`) and the mobile main
 * card (`variant="mobile"`); `main` is a larger centered variant for the
 * desktop resting (filed, not editing) state.
 *
 * Reflects whatever is passed as `prediction` — the caller decides whether
 * that's the committed filed prediction or the in-progress editor draft,
 * so this component stays a pure presentational read of real data.
 */
export default function FixtureSlip({
  fixture,
  prediction,
  filed,
  ceiling,
  variant = 'rail',
  onEdit,
  gameweekLabel,
  deadlineLabel,
}) {
  if (!fixture) return null;
  const { homeTeam, awayTeam, venue, date } = fixture;

  if (!filed) {
    const anyPicked = (prediction?.homeScore ?? 0) > 0 || (prediction?.awayScore ?? 0) > 0;
    return (
      <div
        className={`flex flex-col gap-[14px] rounded-[18px] border border-border-card bg-surface-card p-5 ${
          variant === 'main' ? 'w-full max-w-[420px] text-center' : ''
        }`}
      >
        <div className="flex items-baseline justify-between gap-2.5">
          <span className="font-mono text-[10px] tracking-[0.14em] text-text-muted-3">
            THE SLIP{gameweekLabel ? ` · ${gameweekLabel}` : ''}
          </span>
          <span className="font-mono text-[10px] tracking-[0.12em] text-brand-amber-mid">
            {anyPicked ? 'DRAFT' : 'UNFILED'}
          </span>
        </div>
        <h2 className="font-dmSerif text-xl leading-tight text-text-primary">
          Nothing filed on {homeTeam} v {awayTeam}
        </h2>
        <p className="text-[12.5px] leading-relaxed text-text-muted-1">
          {deadlineLabel
            ? `Add a scoreline to put points on this one. Editable until ${deadlineLabel}.`
            : 'Add a scoreline to put points on this one.'}
        </p>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center justify-center gap-2 rounded-full border border-brand-amber-pale bg-brand-amber px-4 py-[11px] font-outfit text-[13.5px] font-semibold text-[#2a2103] transition-colors hover:brightness-95"
          >
            {anyPicked ? 'Continue slip' : 'File a prediction'} &rsaquo;
          </button>
        )}
      </div>
    );
  }

  const homeScore = prediction?.homeScore ?? 0;
  const awayScore = prediction?.awayScore ?? 0;
  const scorers = namedScorers(prediction?.homeScorers, prediction?.awayScorers);
  const ledger = buildLedgerRows(prediction || {});
  const headline = slipHeadline(homeTeam, awayTeam, homeScore, awayScore);
  const isMain = variant === 'main';

  return (
    <div
      className={`relative flex flex-col gap-3.5 overflow-hidden rounded-[18px] border border-brand-teal-mid/40 bg-gradient-to-b from-[#0c1424] to-[#080e1a] p-5 ${
        isMain ? 'w-full max-w-[560px]' : ''
      }`}
    >
      <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand-teal-mid via-brand-indigo-mid to-brand-amber" />

      <div className="flex items-baseline justify-between gap-2.5">
        <span className="font-mono text-[10px] tracking-[0.14em] text-text-muted-3">
          THE SLIP{gameweekLabel ? ` · ${gameweekLabel}` : ''}
        </span>
        <span className="font-mono text-[10px] tracking-[0.12em] text-brand-teal">FILED</span>
      </div>

      <div className="relative">
        <h2 className={`m-0 max-w-[78%] font-dmSerif leading-tight text-text-primary ${isMain ? 'text-[28px]' : 'text-xl'}`}>
          {headline}
        </h2>
        <span
          className="absolute right-0 top-0 rotate-[-8deg] rounded-6 border-[3px] border-brand-teal-mid/60 px-2.5 py-1 font-mono text-[11.5px] font-bold tracking-[0.08em] text-brand-teal animate-[stampIn_.42s_cubic-bezier(.2,1.4,.4,1)_both]"
        >
          FILED
        </span>
      </div>

      <div className="flex items-center justify-center gap-3.5">
        <TeamCrest team={homeTeam} size={isMain ? 36 : 28} />
        <span className={`font-dmSerif leading-none text-text-primary ${isMain ? 'text-[46px]' : 'text-[38px]'}`}>
          {homeScore}–{awayScore}
        </span>
        <TeamCrest team={awayTeam} size={isMain ? 36 : 28} />
      </div>

      <div className="h-px bg-border-base" />

      <div className="flex flex-wrap justify-center gap-1.5">
        {scorers.length > 0 ? (
          scorers.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="flex items-center gap-1.5 rounded-full border border-border-card bg-surface-card-3 px-2.5 py-1 text-xs text-text-tertiary"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full border-[1.5px] border-brand-teal" />
              {name}
            </span>
          ))
        ) : (
          <span className="font-mono text-[10.5px] text-text-muted-5">no scorers named</span>
        )}
      </div>

      <div className="h-px bg-border-base" />

      <div className="flex items-center gap-4">
        {ledger.map((row) => (
          <span key={row.label} className="flex flex-col leading-tight">
            <span className="font-mono text-[9px] tracking-[0.1em] text-text-muted-4">{row.label}</span>
            <span className="font-mono text-[12.5px] text-text-tertiary">{row.value}</span>
          </span>
        ))}
        <span className="ml-auto flex flex-col items-end leading-tight">
          <span className="font-mono text-[9px] tracking-[0.14em] text-text-muted-2">CEILING</span>
          <span className="font-dmSerif text-2xl text-brand-amber">{ceiling}</span>
        </span>
      </div>

      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center justify-center gap-2 rounded-full bg-brand-indigo-mid px-4 py-[11px] font-outfit text-[13px] font-semibold text-white transition-colors hover:bg-brand-indigo-hover"
        >
          Edit slip
        </button>
      )}

      {(venue || date) && (
        <span className="text-center font-mono text-[10px] text-text-muted-4">
          {[formatKickoff(date), venue].filter(Boolean).join(' · ')}
        </span>
      )}
    </div>
  );
}
