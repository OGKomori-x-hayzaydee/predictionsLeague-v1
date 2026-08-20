import { useNavigate } from 'react-router-dom';
import TeamCrest from '../ui/TeamCrest';
import KickerLabel from '../ui/KickerLabel';
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

function ScorerRow({ name, side = 'home' }) {
  return (
    <span className="flex items-center gap-2 text-[13.5px] text-text-tertiary">
      {side === 'away' && (
        <span className="h-[7px] w-[7px] shrink-0 rounded-full border-[1.5px] border-brand-teal" />
      )}
      {name}
      {side === 'home' && (
        <span className="h-[7px] w-[7px] shrink-0 rounded-full border-[1.5px] border-brand-teal" />
      )}
    </span>
  );
}

function meetingColor(result) {
  if (result === 'W') return '#5eead4';
  if (result === 'L') return '#f87171';
  return '#fcd34d';
}

/**
 * Fixture-preview card — the selected station's detail view (Spine.dc.html
 * desktop lines 131-266, mobile lines 2257-2336). Venue, kickoff, filed
 * status, and the user's own filed scoreline/scorers/chip/ceiling
 * (calculateCeilingPoints, via useFixtureSpine) are all real data. The
 * team-form strips and the AI-overview panel (predicted score/confidence,
 * last-5-meetings, crowd picks) use matchInsights.js.
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
      <div
        className="rounded-[14px] border border-border-card p-6 text-center text-sm text-text-muted-2"
        style={{ background: 'linear-gradient(180deg, #0a1120, #070d18)' }}
      >
        No fixture selected.
      </div>
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
    <div
      className="flex flex-col overflow-hidden rounded-[14px] border border-border-card"
      style={{ background: 'linear-gradient(180deg, #0a1120, #070d18)' }}
    >
      {/* Header bar — slot label + venue + kickoff + status + CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#16203a] px-[22px] py-[13px]">
        <div className="flex items-center gap-[11px] text-xs">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-teal">
            {formatSlot(date) || `${homeTeam} v ${awayTeam}`}
          </span>
          {venue && (
            <>
              <span className="h-3 w-px bg-[#233248]" />
              <span className="text-[12px] text-[#7c8aa2]">{venue}</span>
            </>
          )}
          {date && (
            <>
              <span className="h-3 w-px bg-[#233248]" />
              <span className="font-mono text-[11px] text-[#66748c]">{formatKickoff(date)}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3.5">
          <span
            className={`whitespace-nowrap rounded-xs border px-[9px] py-1 font-mono text-[10px] tracking-[0.12em] ${statusClasses}`}
          >
            {predicted ? 'FILED' : 'NOT FILED'}
          </span>
          <span className="hidden text-xs text-[#8fa0b8] sm:inline">
            {predicted ? `${ceiling} pts if it lands exactly` : 'nothing on the line'}
          </span>
          <button
            type="button"
            onClick={() => navigate('/fixtures')}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[9px] bg-brand-indigo-mid px-3.5 py-[9px] font-outfit text-[13px] font-semibold text-white transition-colors hover:bg-brand-indigo-hover"
          >
            {predicted ? 'Edit in reel' : 'File in reel'}
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <path d="M3 7.5h8.5M8 4l3.5 3.5L8 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body — filed scoreline or "nothing filed" */}
      {predicted ? (
        <div
          className={`grid items-start gap-[26px] px-7 ${
            isMobile ? 'grid-cols-1 justify-items-center py-5' : 'grid-cols-[1fr_auto_1fr] py-5'
          }`}
        >
          {/* Home side */}
          <div className="flex flex-col items-end gap-3 min-w-0">
            <div className="flex items-center gap-3.5">
              <div className="flex flex-col items-end gap-[3px]">
                <span className="font-dmSerif text-[22px] leading-tight text-text-primary whitespace-nowrap">
                  {homeTeam}
                </span>
                {insight && (
                  <span className="flex items-center gap-1">
                    {insight.homeForm.split('').map((ch, i) => (
                      <span key={i} className="font-mono text-[10px]" style={{ color: meetingColor(ch) }}>
                        {ch}
                      </span>
                    ))}
                  </span>
                )}
              </div>
              <TeamCrest team={homeTeam} size={crestSize} />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              {homeScorers.length > 0 ? (
                homeScorers.map((name) => <ScorerRow key={name} name={name} side="home" />)
              ) : (
                <span className="font-mono text-[11px] text-text-muted-4">no scorer named</span>
              )}
            </div>
          </div>

          {/* Score centre */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <span className={`font-dmSerif leading-[0.9] text-text-primary ${isMobile ? 'text-[42px]' : 'text-[62px]'}`}>
                {prediction.homeScore}
              </span>
              <span className={`font-dmSerif text-[#2c3a53] leading-none ${isMobile ? 'text-xl' : 'text-[30px]'}`}>–</span>
              <span className={`font-dmSerif leading-[0.9] text-text-primary ${isMobile ? 'text-[42px]' : 'text-[62px]'}`}>
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

          {/* Away side */}
          <div className="flex flex-col items-start gap-3 min-w-0">
            <div className="flex items-center gap-3.5">
              <TeamCrest team={awayTeam} size={crestSize} />
              <div className="flex flex-col gap-[3px]">
                <span className="font-dmSerif text-[22px] leading-tight text-text-primary whitespace-nowrap">
                  {awayTeam}
                </span>
                {insight && (
                  <span className="flex items-center gap-1">
                    {insight.awayForm.split('').map((ch, i) => (
                      <span key={i} className="font-mono text-[10px]" style={{ color: meetingColor(ch) }}>
                        {ch}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {awayScorers.length > 0 ? (
                awayScorers.map((name) => <ScorerRow key={name} name={name} side="away" />)
              ) : (
                <span className="font-mono text-[11px] text-text-muted-4">no scorer named</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 px-7 py-[22px]">
          <span className="font-dmSerif text-[25px] leading-tight text-text-primary">
            Nothing filed on {homeTeam} v {awayTeam}
          </span>
          <span className="max-w-[46em] text-[13px] text-[#8896ad]" style={{ textWrap: 'pretty' }}>
            {deadlineLabel
              ? `The read below is the model's, not yours. File a scoreline before the deadline (${deadlineLabel}) to put points on it.`
              : 'File a scoreline before the deadline to put points on it.'}
          </span>
        </div>
      )}

      {/* AI overview — 3-column grid matching prototype lines 214-265 */}
      <div className="flex flex-col gap-3 border-t border-[#16203a] bg-[#070d18] px-[22px] py-[15px]">
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
          <div
            className={`grid gap-[22px] items-start ${
              isMobile ? 'grid-cols-1' : 'grid-cols-[1.2fr_1px_0.85fr_1px_0.95fr]'
            }`}
          >
            {/* Column 1: AI predicted score + confidence */}
            <div className="flex flex-col gap-[9px] min-w-0">
              <div className="flex items-baseline gap-[11px]">
                <span className="font-dmSerif text-[28px] leading-none text-brand-indigo-pale">
                  {insight.predictedHome}–{insight.predictedAway}
                </span>
                <span className="font-mono text-[11px] text-brand-indigo">
                  {insight.confidence}% confidence
                </span>
              </div>
              <span className="flex h-1 overflow-hidden rounded-sm bg-[#131d2f]">
                <span
                  className="bg-gradient-to-r from-brand-indigo-mid to-brand-indigo"
                  style={{ width: `${insight.confidence}%` }}
                />
              </span>
              <p className="m-0 text-[12.5px] leading-relaxed text-[#8fa0b8]" style={{ textWrap: 'pretty' }}>
                {insight.blurb}
              </p>
            </div>

            {!isMobile && <span className="bg-[#16203a]" />}

            {/* Column 2: Last 5 Meetings */}
            <div className="flex flex-col gap-[10px] min-w-0">
              <span className="font-mono text-[10px] tracking-[0.12em] text-text-muted-4">
                LAST 5 MEETINGS
              </span>
              <div className="flex items-center gap-1.5">
                {insight.meetings.map((ch, i) => (
                  <span
                    key={i}
                    className="flex h-5 w-5 items-center justify-center rounded-[5px] border border-[#1d2a41] bg-[#101a2c] font-mono text-[10px]"
                    style={{ color: meetingColor(ch) }}
                  >
                    {ch}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[11px] text-[#66748c]">
                {insight.meetingsSummary}
              </span>
              <span className="text-xs leading-relaxed text-[#8fa0b8]" style={{ textWrap: 'pretty' }}>
                {insight.meetingsNote}
              </span>
            </div>

            {!isMobile && <span className="bg-[#16203a]" />}

            {/* Column 3: What the League is Picking */}
            <div className="flex flex-col gap-[10px] min-w-0">
              <span className="font-mono text-[10px] tracking-[0.12em] text-text-muted-4">
                WHAT THE LEAGUE IS PICKING
              </span>
              <span className="flex h-2 overflow-hidden rounded bg-[#101a2c]">
                {insight.crowd.map((c, i) => (
                  <span
                    key={i}
                    style={{
                      width: `${c.pct}%`,
                      background: i === 0 ? '#5eead4' : i === 1 ? '#475569' : '#818cf8',
                    }}
                  />
                ))}
              </span>
              <div className="flex flex-col gap-[5px]">
                {insight.crowd.map((c, i) => (
                  <span key={c.label} className="flex items-center gap-2 text-xs text-[#8fa0b8]">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: i === 0 ? '#5eead4' : i === 1 ? '#475569' : '#818cf8' }}
                    />
                    <span className="flex-1 truncate">{c.label}</span>
                    <span className="font-mono text-text-tertiary">{c.pct}%</span>
                  </span>
                ))}
              </div>
              <span className="font-mono text-[11px] text-[#66748c]">
                most-picked {insight.mostPicked}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
