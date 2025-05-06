import { TreeNode } from "primereact/treenode";

type CacheItem = {
  data: TreeNode[];
};

const CACHE_KEY_PREFIX = "sales_flow_cache_";

/**
 * Stores data in localStorage with a prefixed key.
 */
export const setCache = (key: string, data: TreeNode[]): void => {
  const cacheItem: CacheItem = { data };

  try {
    const serialized = JSON.stringify(cacheItem);
    localStorage.setItem(CACHE_KEY_PREFIX + key, serialized);
  } catch (error) {
    console.error("[SalesFlow Cache] Failed to save data:", error);
  }
};

/**
 * Retrieves data from localStorage by key.
 */
export const getCache = (key: string): CacheItem | null => {
  const cachedItem = localStorage.getItem(CACHE_KEY_PREFIX + key);
  if (!cachedItem) return null;

  try {
    const parsed: CacheItem = JSON.parse(cachedItem);
    return parsed;
  } catch (error) {
    console.error("[SalesFlow Cache] Failed to parse cached item:", error);
    return null;
  }
};
