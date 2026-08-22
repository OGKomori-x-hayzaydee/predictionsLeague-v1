import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { dicebearDataUri } from '../../utils/dicebearAvatar';

export default function Avatar({ name = '', src, size = 34, className = '', animateFallback = true }) {
  const [broken, setBroken] = useState(false);
  const fallback = useMemo(
    () => dicebearDataUri('lorelei', name || 'player', size),
    [name, size]
  );

  useEffect(() => {
    setBroken(false);
  }, [src]);

  const showPhoto = Boolean(src) && !broken;
  const img = (
    <img
      src={showPhoto ? src : fallback}
      alt={name}
      onError={() => setBroken(true)}
      className={`shrink-0 rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );

  if (showPhoto || !animateFallback) {
    return img;
  }

  return (
    <motion.span
      className="inline-flex shrink-0"
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {img}
    </motion.span>
  );
}
