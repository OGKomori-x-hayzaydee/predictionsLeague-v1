import { useNavigate } from 'react-router-dom';
import TeamCrest from '../ui/TeamCrest';
import KickerLabel from '../ui/KickerLabel';
import Card from '../ui/Card';
import { CHIP_CONFIG } from '../../utils/chipManager';
import { CHIP_HUES, DEFAULT_CHIP_HUE } from './chipHues';
import { getMatchInsight } from '../../utils/matchInsights';

function formatKickoff(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.toLocaleDateString(undefined, { weekday: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} ${time}`;
}

// Familiar broadcast-slot naming (Friday Night, Saturday Lunchtime, ...) —
// pure formatting over the real kickoff date, no schedule/broadcast data.
function formatSlot(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.getDay();
  const hour = d.getHours() + d.getMinutes() / 60;
  if (day === 5) return 'Friday Night';
  if (day === 6) return hour < 13 ? 'Saturday Lunchtime' : hour < 17.5 ? 'Saturday 3pm' : 'Saturday Evening';
  if (day === 0) return hour < 15 ? 'Sunday Early' : 'Sunday Late';
  if (day === 1) return 'Monday Night';
  return d.toLocaleDateString(undefined, { weekday: 'long' });
}

function meetingClasses(result) {
  if (result === 'W') return 'border-brand-teal-mid/40 bg-brand-teal-deep/15 text-brand-teal';
  if (result === 'L') return 'border-[#b4530966] bg-[#78350f26] text-brand-amber-mid';
  return 'border-border-card bg-surface-card-3 text-text-muted-2';
}

function ScorerPill({ name, hue, size = 'md' }) {
  const dotClass = size === 'sm' ? 'h-1.5 w-1.5' : 'h-[7px] w-[7px]';
  return (
    <span
      className={`flex items-center gap-2 ${size === 'sm' ? 'rounded-full border border-border-card bg-surface-card-3 px-2.5 py-1 text-xs' : 'text-[13.5px]'} text-text-tertiary`}
    >
      <span className={`shrink-0 rounded-full border-[1.5px] ${dotClass}`} style={{ borderColor: hue }} />
      {name}
    </span>
  );
}

/**
 * Fixture-preview card — the selected station's detail view (Spine.dc.html
 * desktop lines 131-266, mobile lines 2257-2336). Venue, kickoff, filed
 * status, and the user's own filed scoreline/scorers/chip/ceiling
 * (calculateCeilingPoints, via useFixtureSpine) are all real data. The
 * team-form strips and the AI-overview panel (predicted score/confidence,
 * last-5-meetings, crowd picks) have no backing data source on this backend
 * (no team-form/odds/AI service, no match-history archive) — see
 * utils/matchInsights.js for the deterministic sample data standing in for
 * them until a real source exists.
 */
export default function FixturePreviewCard({
  fixture,
  ceiling,
  variant = 'desktop',
  aiOpen = true,
  onToggleAi,
  deadlineLabel,
}) {
  const navigate = useNavigate();
  const isMobile = variant === 'mobile';

  if (!fixture) {
    return (
      <Card className="p-6 text-center text-sm text-text-muted-2">
        No fixture selected.
      </Card>
    );
  }

  const { homeTeam, awayTeam, venue, date, predicted } = fixture;
  const prediction = fixture.userPrediction;
  const chipId = prediction?.chips?.[0];
  const chip = chipId ? CHIP_CONFIG[chipId] : null;
  const chipHue = chipId ? CHIP_HUES[chipId] || DEFAULT_CHIP_HUE : null;
  const insight = getMatchInsight(fixture);

  const homeScorers = (prediction?.homeScorers || []).filter(Boolean);
  const awayScorers = (prediction?.awayScorers || []).filter(Boolean);
  const crestSize = isMobile ? 24 : 48;

  const statusClasses = predicted
    ? 'bg-brand-teal-deep/15 border-brand-teal-mid/40 text-brand-teal'
    : 'bg-[#78350f26] border-[#b4530966] text-brand-amber-mid';

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-base px-[22px] py-[13px]">
        <div className="flex items-center gap-[11px] text-xs">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-teal">
            {formatSlot(date) || `${homeTeam} v ${awayTeam}`}
          </span>
          {venue && (
            <>
              <span className="h-3 w-px bg-[#233248]" />
              <span className="text-text-muted-3">{venue}</span>
            </>
          )}
          {date && (
            <>
              <span className="h-3 w-px bg-[#233248]" />
              <span className="font-mono text-[11px] text-text-muted-3">{formatKickoff(date)}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3.5">
          <span
            className={`whitespace-nowrap rounded-xs border px-[9px] py-1 font-mono text-[10px] tracking-[0.12em] ${statusClasses}`}
          >
            {predicted ? 'FILED' : 'NOT FILED'}
          </span>
          <span className="hidden text-xs text-text-muted-1 sm:inline">
            {predicted ? `${ceiling} pts if it lands exactly` : 'nothing on the line'}
          </span>
          <button
            type="button"
            onClick={() => navigate('/fixtures')}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-9 bg-brand-indigo-mid px-3.5 py-[9px] font-outfit text-[13px] font-semibold text-white transition-colors hover:bg-brand-indigo-hover"
          >
            {predicted ? 'Edit in reel' : 'File in reel'}
          </button>
        </div>
      </div>

      {predicted ? (
        <div
          className={`flex items-center gap-6 px-6 py-6 ${isMobile ? 'flex-col' : 'justify-center gap-[26px] py-[22px]'}`}
        >
          <div className="flex flex-1 flex-col items-center gap-3 sm:items-end">
            <div className="flex items-center gap-3.5">
              <span className="font-dmSerif text-lg text-text-primary sm:text-[22px]">{homeTeam}</span>
              <TeamCrest team={homeTeam} size={crestSize} />
            </div>
            {insight && (
              <span className="font-mono text-[10px] tracking-[0.14em] text-text-muted-4">
                {insight.homeForm}
              </span>
            )}
            <div className="flex flex-wrap justify-end gap-1.5">
              {homeScorers.length > 0 ? (
                homeScorers.map((name) => (
                  <ScorerPill key={name} name={name} hue="#5eead4" size={isMobile ? 'sm' : 'md'} />
                ))
              ) : (
                <span className="font-mono text-[11px] text-text-muted-4">no scorer named</span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <span className="font-dmSerif text-4xl leading-none text-text-primary sm:text-[52px]">
                {prediction.homeScore}
              </span>
              <span className="font-dmSerif text-2xl text-text-muted-4">–</span>
              <span className="font-dmSerif text-4xl leading-none text-text-primary sm:text-[52px]">
                {prediction.awayScore}
              </span>
            </div>
            {chip && (
              <span
                className="flex items-center gap-[7px] whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.1em]"
                style={{ background: `${chipHue}1f`, borderColor: `${chipHue}55`, color: chipHue }}
              >
                {chip.name}
                <span className="opacity-75">{chip.icon}</span>
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
            <div className="flex items-center gap-3.5">
              <TeamCrest team={awayTeam} size={crestSize} />
              <span className="font-dmSerif text-lg text-text-primary sm:text-[22px]">{awayTeam}</span>
            </div>
            {insight && (
              <span className="font-mono text-[10px] tracking-[0.14em] text-text-muted-4">
                {insight.awayForm}
              </span>
            )}
            <div className="flex flex-wrap gap-1.5">
              {awayScorers.length > 0 ? (
                awayScorers.map((name) => (
                  <ScorerPill key={name} name={name} hue={isMobile ? '#818cf8' : '#5eead4'} size={isMobile ? 'sm' : 'md'} />
                ))
              ) : (
                <span className="font-mono text-[11px] text-text-muted-4">no scorer named</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 px-6 py-6">
          <span className="font-dmSerif text-xl text-text-primary sm:text-2xl">
            Nothing filed on {homeTeam} v {awayTeam}
          </span>
          <span className="max-w-[46em] text-sm text-text-muted-2">
            {deadlineLabel
              ? `File a scoreline before the deadline (${deadlineLabel}) to put points on it.`
              : 'File a scoreline before the deadline to put points on it.'}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-border-base bg-surface-card-2 px-[22px] py-4">
        <button
          type="button"
          onClick={isMobile ? onToggleAi : undefined}
          disabled={!isMobile}
          className={`flex items-center gap-[9px] text-left ${isMobile ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-brand-indigo" />
          <KickerLabel as="span" className="tracking-[0.16em] text-text-muted-3">
            AI overview
          </KickerLabel>
          {isMobile && (
            <span className="ml-auto font-mono text-xs text-text-muted-2">{aiOpen ? '▴' : '▾'}</span>
          )}
        </button>
        {(!isMobile || aiOpen) && insight && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-2.5">
                <span className="font-dmSerif text-xl text-text-primary">
                  {insight.predictedHome}-{insight.predictedAway}
                </span>
                <span className="font-mono text-[11px] text-brand-teal">{insight.confidence}% confidence</span>
              </div>
              <div className="relative h-1 overflow-hidden rounded-full bg-surface-card-3">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-brand-teal-mid"
                  style={{ width: `${insight.confidence}%` }}
                />
              </div>
              <p className="text-xs leading-relaxed text-text-muted-1">{insight.blurb}</p>
            </div>

            <div className="flex flex-col gap-2">
              <KickerLabel as="span" className="tracking-[0.14em] text-text-muted-3">
                Last 5 meetings
              </KickerLabel>
              <div className="flex gap-1">
                {insight.meetings.map((result, i) => (
                  <span
                    key={i}
                    className={`flex h-5 w-5 items-center justify-center rounded-xs border font-mono text-[10px] ${meetingClasses(result)}`}
                  >
                    {result}
                  </span>
                ))}
              </div>
              <p className="text-xs text-text-muted-2">{insight.meetingsSummary}</p>
              <p className="text-xs text-text-muted-3">{insight.meetingsNote}</p>
            </div>

            <div className="flex flex-col gap-2">
              <KickerLabel as="span" className="tracking-[0.14em] text-text-muted-3">
                What the league is picking
              </KickerLabel>
              <div className="flex flex-col gap-1.5">
                {insight.crowd.map((c) => (
                  <div key={c.label} className="flex items-center gap-2">
                    <span className="w-[88px] shrink-0 truncate text-xs text-text-muted-1">{c.label}</span>
                    <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface-card-3">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-brand-indigo-mid/70"
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right font-mono text-[11px] text-text-muted-2">{c.pct}%</span>
                  </div>
                ))}
              </div>
              <p className="font-mono text-[11px] text-text-muted-3">most-picked {insight.mostPicked}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
