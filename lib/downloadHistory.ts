export type DownloadHistoryEntry = {
  id: string;
  slug: string;
  fileName: string;
  title: string;
  productTitle?: string;
  pagePath?: string;
  downloadedAt: string;
};

type DownloadHistoryMap = Record<string, DownloadHistoryEntry[]>;

const DOWNLOAD_HISTORY_STORAGE_KEY = "avid_download_history_v1";
const MAX_HISTORY_ITEMS_PER_USER = 100;
const USER_ID_KEYS = ["_id", "id", "user_id", "userId"] as const;
const USER_EMAIL_KEYS = ["email", "email_id", "emailId"] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeHistoryKey = (value: unknown) => String(value || "").trim().toLowerCase();

export const getUserHistoryKeys = (user: unknown): string[] => {
  if (!isRecord(user)) return [];

  const keys: string[] = [];

  USER_EMAIL_KEYS.forEach((field) => {
    const value = normalizeHistoryKey(user[field]);
    if (value) keys.push(value);
  });

  USER_ID_KEYS.forEach((field) => {
    const value = normalizeHistoryKey(user[field]);
    if (value) keys.push(value);
  });

  return Array.from(new Set(keys));
};

export const getUserHistoryKey = (user: unknown): string | null => {
  const keys = getUserHistoryKeys(user);
  return keys[0] || null;
};

const readHistoryMap = (): DownloadHistoryMap => {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(DOWNLOAD_HISTORY_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return {};

    const map: DownloadHistoryMap = {};
    Object.entries(parsed).forEach(([key, value]) => {
      if (!Array.isArray(value)) return;
      map[key] = value.filter(isRecord).map((item) => ({
        id: String(item.id || ""),
        slug: String(item.slug || ""),
        fileName: String(item.fileName || "download"),
        title: String(item.title || "Downloaded file"),
        productTitle: item.productTitle ? String(item.productTitle) : undefined,
        pagePath: item.pagePath ? String(item.pagePath) : undefined,
        downloadedAt: String(item.downloadedAt || new Date(0).toISOString()),
      }));
    });
    return map;
  } catch {
    return {};
  }
};

const writeHistoryMap = (map: DownloadHistoryMap) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DOWNLOAD_HISTORY_STORAGE_KEY, JSON.stringify(map));
};

export const addDownloadHistory = (
  userKey: string,
  data: {
    slug: string;
    fileName: string;
    title: string;
    productTitle?: string;
    pagePath?: string;
  }
) => {
  if (!userKey || typeof window === "undefined") return;
  const normalizedKey = normalizeHistoryKey(userKey);
  if (!normalizedKey) return;

  const historyMap = readHistoryMap();
  const current = historyMap[normalizedKey] || [];

  const entry: DownloadHistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    slug: data.slug,
    fileName: data.fileName,
    title: data.title,
    productTitle: data.productTitle,
    pagePath: data.pagePath,
    downloadedAt: new Date().toISOString(),
  };

  historyMap[normalizedKey] = [entry, ...current].slice(0, MAX_HISTORY_ITEMS_PER_USER);
  writeHistoryMap(historyMap);
};

export const getDownloadHistory = (userKey: string): DownloadHistoryEntry[] => {
  if (!userKey || typeof window === "undefined") return [];
  const historyMap = readHistoryMap();
  return historyMap[normalizeHistoryKey(userKey)] || [];
};

export const getDownloadHistoryByKeys = (userKeys: string[]): DownloadHistoryEntry[] => {
  if (!Array.isArray(userKeys) || userKeys.length === 0 || typeof window === "undefined") return [];

  const historyMap = readHistoryMap();
  const seen = new Set<string>();
  const merged: DownloadHistoryEntry[] = [];

  userKeys
    .map((key) => normalizeHistoryKey(key))
    .filter(Boolean)
    .forEach((key) => {
      const entries = historyMap[key] || [];
      entries.forEach((entry) => {
        const dedupeKey = `${entry.slug}|${entry.fileName}|${entry.downloadedAt}`;
        if (seen.has(dedupeKey)) return;
        seen.add(dedupeKey);
        merged.push(entry);
      });
    });

  return merged.sort(
    (a, b) => new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime()
  );
};
