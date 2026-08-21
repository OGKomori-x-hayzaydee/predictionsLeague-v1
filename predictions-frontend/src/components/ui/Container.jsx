/**
 * Plain max-width/centering wrapper — replaces @radix-ui/themes' `Container`
 * (Radix removal, see plan). Radix's `size` prop mapped to roughly the same
 * max-widths (1=448px/28rem, 2=688px/43rem, 3=880px/55rem, 4=1136px/71rem),
 * expressed in rem so it scales with root font-size rather than being a
 * fixed pixel value.
 */
const MAX_WIDTHS = {
  1: 'max-w-[28rem]',
  2: 'max-w-[43rem]',
  3: 'max-w-[55rem]',
  4: 'max-w-[71rem]',
};

export default function Container({ size = 4, className = '', children, ...rest }) {
  const maxWidth = MAX_WIDTHS[size] || MAX_WIDTHS[4];
  return (
    <div className={`mx-auto w-full ${maxWidth} ${className}`} {...rest}>
      {children}
    </div>
  );
}
