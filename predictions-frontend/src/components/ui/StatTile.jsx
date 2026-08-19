import KickerLabel from './KickerLabel';

export default function StatTile({ label, value, note, accent, className = '' }) {
  return (
    <div className={`rounded-md border border-border-card bg-surface-card-2 p-4 ${className}`}>
      <KickerLabel>{label}</KickerLabel>
      <div className="mt-1.5 font-dmSerif text-2xl leading-none" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
      {note && <div className="mt-1.5 text-xs text-text-muted-2">{note}</div>}
    </div>
  );
}
