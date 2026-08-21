import TeamCrest from './TeamCrest';

/**
 * Crest cells used by Record All-time ("Who you read well") and Profile
 * Record ("Strongest and weakest ground") — same cell language, different
 * grouping. `tone` forces highlight; otherwise ≥60% reads as strong.
 */
export default function TeamCrestGrid({ teams = [], className = 'grid-cols-4 sm:grid-cols-6' }) {
  return (
    <div className={`grid gap-1.5 ${className}`}>
      {teams.map((t) => {
        const tone = t.tone ?? (t.accuracy >= 60 ? 'strong' : 'neutral');
        const strong = tone === 'strong';
        const weak = tone === 'weak';
        return (
          <div
            key={t.team}
            title={`${t.team} · ${t.accuracy}% of ${t.predictions} calls`}
            className="flex flex-col items-center gap-1.5 rounded-9 border px-1 py-2.5"
            style={{
              background: strong
                ? 'color-mix(in srgb, var(--brand-teal-deep) 18%, transparent)'
                : weak
                  ? 'color-mix(in srgb, var(--state-error) 10%, var(--surface-card-3))'
                  : 'var(--surface-card-3)',
              borderColor: strong
                ? 'color-mix(in srgb, var(--brand-teal-mid) 45%, transparent)'
                : weak
                  ? 'color-mix(in srgb, var(--state-error-mid) 30%, transparent)'
                  : 'var(--border-base)',
              boxShadow: strong ? '0 0 14px color-mix(in srgb, var(--brand-teal) 16%, transparent)' : undefined,
            }}
          >
            <TeamCrest team={t.team} size={22} className={strong ? '' : 'opacity-55 grayscale'} />
            <span
              className="font-outfit text-2xs"
              style={{
                color: strong ? 'var(--brand-teal)' : weak ? 'var(--state-error-mid)' : 'var(--text-primary)',
              }}
            >
              {t.accuracy}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
