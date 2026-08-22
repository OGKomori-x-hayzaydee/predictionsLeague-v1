import Avatar from '../ui/Avatar';

export default function StandingsTable({ standings }) {
  return (
    <div className="divide-y divide-border-base">
      {standings.map((m) => (
        <div
          key={m.id || m.username}
          className={`flex items-center gap-3 px-4 py-2.5 ${m.isCurrentUser ? 'bg-brand-teal/5' : ''}`}
        >
          <span className="w-6 font-outfit text-xs text-text-muted-2">{m.position}</span>
          <Avatar name={m.displayName || m.username} src={m.avatar} size={26} animateFallback={false} />
          <span className={`flex-1 truncate text-sm ${m.isCurrentUser ? 'text-brand-teal' : 'text-text-secondary'}`}>
            {m.displayName || m.username}
            {m.isAdmin && <span className="ml-1 text-text-muted-3">· admin</span>}
          </span>
          <span className="font-outfit text-xs text-text-muted-2">{m.predictions ?? 0} calls</span>
          <span className="w-12 text-right font-dmSerif text-sm text-text-primary">{m.points}</span>
        </div>
      ))}
    </div>
  );
}
