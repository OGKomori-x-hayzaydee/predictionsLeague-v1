export default function ScoreStepper({ team, value, onChange }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm text-text-secondary">{team}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border-control text-text-muted-1 hover:text-text-primary"
          aria-label={`Decrease ${team} score`}
        >
          −
        </button>
        <span className="w-10 text-center font-dmSerif text-4xl text-text-primary md:text-6xl">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(9, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border-control text-text-muted-1 hover:text-text-primary"
          aria-label={`Increase ${team} score`}
        >
          +
        </button>
      </div>
    </div>
  );
}
