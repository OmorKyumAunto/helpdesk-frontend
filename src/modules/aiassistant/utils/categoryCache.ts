export type TicketCategory = { id: number; title: string };

const KEY = "dbl_ticket_categories_cache_v1";
const TTL_MIN = 30;

type CacheShape = {
  ts: number;
  data: TicketCategory[];
};

export function loadCategoryCache(): TicketCategory[] | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CacheShape;
    if (!parsed?.ts || !Array.isArray(parsed?.data)) return null;

    const ageMin = (Date.now() - parsed.ts) / (60 * 1000);
    if (ageMin > TTL_MIN) return null;

    return parsed.data;
  } catch {
    return null;
  }
}

export function saveCategoryCache(categories: TicketCategory[]) {
  const payload: CacheShape = { ts: Date.now(), data: categories };
  try {
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function clearCategoryCache() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

export function findCategoryIdByTitle(categories: TicketCategory[], title: string) {
  const t = (title || "").trim().toLowerCase();

  // exact match
  const exact = categories.find((c) => c.title.trim().toLowerCase() === t);
  if (exact) return exact.id;

  // fallback: "contains" match (useful if AI returns slightly different)
  const partial = categories.find((c) => t.includes(c.title.trim().toLowerCase()));
  return partial?.id ?? null;
}
