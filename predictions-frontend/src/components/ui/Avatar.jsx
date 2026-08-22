import { useEffect, useMemo, useState } from 'react';
import { dicebearDataUri } from '../../utils/dicebearAvatar';

export default function Avatar({ name = '', src, size = 34, className = '' }) {
  const [broken, setBroken] = useState(false);
  const fallback = useMemo(
    () => dicebearDataUri('lorelei', name || 'player', size),
    [name, size]
  );

  useEffect(() => {
    setBroken(false);
  }, [src]);

  const showPhoto = Boolean(src) && !broken;
  return (
    <img
      src={showPhoto ? src : fallback}
      alt={name}
      onError={() => setBroken(true)}
      className={`shrink-0 rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
