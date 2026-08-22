export default function LoadingState({ message = 'Loading...', compact = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-text-muted ${
        compact ? 'min-h-24 py-6' : 'min-h-[40dvh]'
      }`}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-control border-t-brand-teal" />
      <p className="font-outfit text-xs uppercase tracking-wide">{message}</p>
    </div>
  );
}
