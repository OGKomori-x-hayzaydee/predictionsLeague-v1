export default function KickerLabel({ children, as: Tag = 'span', className = '' }) {
  return (
    <Tag
      className={`font-outfit text-2xs font-medium uppercase tracking-[0.14em] text-text-muted-3 ${className}`}
    >
      {children}
    </Tag>
  );
}
