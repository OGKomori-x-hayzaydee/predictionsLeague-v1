export default function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag
      className={`rounded-lg border border-border-card bg-surface-card ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
