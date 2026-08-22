import Button from './buttons/Button';

export default function PageError({
  title = 'Something went wrong',
  body = 'Try again in a moment.',
  onRetry,
  onHome,
}) {
  return (
    <div className="flex min-h-[40dvh] flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="font-dmSerif text-2xl text-text-primary">{title}</p>
      <p className="max-w-sm text-sm text-text-muted">{body}</p>
      {(onRetry || onHome) && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {onRetry && <Button onClick={onRetry}>Retry</Button>}
          {onHome && (
            <Button variant="secondary" onClick={onHome}>
              Home
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
