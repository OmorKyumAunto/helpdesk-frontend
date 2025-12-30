export function getOrCreateUserId() {
  const key = "dbl_user_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const id = `web-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  localStorage.setItem(key, id);
  return id;
}
