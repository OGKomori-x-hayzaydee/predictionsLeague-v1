import { getTeamLogoSync } from '../../utils/teamLogos';

/**
 * Shared crest component — the v2 prototype has no team badges at all (crest
 * slots don't exist, teams are plain text), so this is a deliberate addition
 * across every screen using the existing local SVG assets + name-alias
 * resolver, matched purely by team display-name string (see plan §3).
 */
export default function TeamCrest({ team, size = 28, className = '' }) {
  const src = getTeamLogoSync(team, { size });
  return (
    <img
      src={src}
      alt={team || ''}
      className={`inline-block shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
