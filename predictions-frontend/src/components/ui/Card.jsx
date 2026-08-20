export default function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag
      className={`rounded-[14px] border border-border-card bg-surface-card ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
