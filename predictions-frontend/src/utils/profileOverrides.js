const KEY = 'pl.profileOverrides';

export function readProfileOverrides() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function writeProfileOverrides(partial) {
  const next = { ...readProfileOverrides(), ...partial };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function mergeProfile(server) {
  const over = readProfileOverrides();
  if (!server && !over.username && !over.profilePicture && !over.avatar) return server;
  return {
    ...(server || {}),
    ...over,
    username: over.username || server?.username,
    profilePicture: over.profilePicture || over.avatar || server?.profilePicture || server?.avatar,
    avatar: over.avatar || over.profilePicture || server?.avatar || server?.profilePicture,
  };
}

/** Prefer the signed-in user's saved avatar on league member rows. */
export function overlayOwnAvatar(members, extraSrc) {
  if (!Array.isArray(members) || members.length === 0) return members;
  const over = readProfileOverrides();
  const own = over.avatar || over.profilePicture || extraSrc || null;
  if (!own) return members;
  return members.map((m) => (m.isCurrentUser ? { ...m, avatar: own } : m));
}
