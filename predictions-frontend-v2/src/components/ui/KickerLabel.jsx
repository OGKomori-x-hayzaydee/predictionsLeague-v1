export default function KickerLabel({ children, as: Tag = 'span', className = '' }) {
  return (
    <Tag
      className={`font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-text-muted-3 ${className}`}
    >
      {children}
    </Tag>
  );
}
