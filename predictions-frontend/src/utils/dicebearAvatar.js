import { createAvatar } from '@dicebear/core';
import * as avataaars from '@dicebear/avataaars';
import * as bottts from '@dicebear/bottts';
import * as funEmoji from '@dicebear/fun-emoji';
import * as lorelei from '@dicebear/lorelei';
import * as notionists from '@dicebear/notionists';
import * as thumbs from '@dicebear/thumbs';

export const AVATAR_STYLES = [
  { id: 'avataaars', label: 'Avataaars', style: avataaars },
  { id: 'bottts', label: 'Bots', style: bottts },
  { id: 'funEmoji', label: 'Emoji', style: funEmoji },
  { id: 'lorelei', label: 'Lorelei', style: lorelei },
  { id: 'notionists', label: 'Notionists', style: notionists },
  { id: 'thumbs', label: 'Thumbs', style: thumbs },
];

export function dicebearDataUri(styleOrId, seed, size = 128) {
  const entry = typeof styleOrId === 'string'
    ? AVATAR_STYLES.find((s) => s.id === styleOrId)
    : { style: styleOrId };
  const style = entry?.style || lorelei;
  return createAvatar(style, { seed: seed || 'player', size }).toDataUri();
}

export function dicebearSvgFile(styleOrId, seed) {
  const entry = typeof styleOrId === 'string'
    ? AVATAR_STYLES.find((s) => s.id === styleOrId)
    : { style: styleOrId };
  const style = entry?.style || lorelei;
  const svg = createAvatar(style, { seed: seed || 'player', size: 256 }).toString();
  return new File([svg], 'avatar.svg', { type: 'image/svg+xml' });
}

export function randomAvatarSeed() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `seed-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
