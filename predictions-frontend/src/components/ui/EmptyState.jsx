import Button from './buttons/Button';
import KickerLabel from './KickerLabel';

export default function EmptyState({
  kicker = 'Nothing here',
  title,
  body,
  action,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {kicker && <KickerLabel>{kicker}</KickerLabel>}
      {title && <h2 className="max-w-md font-dmSerif text-2xl text-text-primary">{title}</h2>}
      {body && <p className="max-w-sm text-sm leading-relaxed text-text-muted">{body}</p>}
      {action}
      {!action && actionLabel && onAction && (
        <Button onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
