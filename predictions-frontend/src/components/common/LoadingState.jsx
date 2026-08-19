export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-text-muted-2">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-control border-t-brand-teal" />
      <p className="font-mono text-xs uppercase tracking-wide">{message}</p>
    </div>
  );
}
