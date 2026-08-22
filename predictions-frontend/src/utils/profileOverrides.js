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
