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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const getUserHistoryKey = (user: unknown): string | null => {
  if (!isRecord(user)) return null;

  const rawId =
    user._id ||
    user.id ||
    user.user_id ||
    user.userId ||
    user.email ||
    user.email_id ||
    user.emailId;

  if (!rawId) return null;
  return String(rawId).trim().toLowerCase();
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

  const historyMap = readHistoryMap();
  const current = historyMap[userKey] || [];

  const entry: DownloadHistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    slug: data.slug,
    fileName: data.fileName,
    title: data.title,
    productTitle: data.productTitle,
    pagePath: data.pagePath,
    downloadedAt: new Date().toISOString(),
  };

  historyMap[userKey] = [entry, ...current].slice(0, MAX_HISTORY_ITEMS_PER_USER);
  writeHistoryMap(historyMap);
};

export const getDownloadHistory = (userKey: string): DownloadHistoryEntry[] => {
  if (!userKey || typeof window === "undefined") return [];
  const historyMap = readHistoryMap();
  return historyMap[userKey] || [];
};
