import { TreeNode } from "primereact/treenode";
type CacheItem = {
    data: TreeNode[];
  };
  
  const CACHE_KEY_PREFIX = "sales_flow_cache_";
  
 export const setCache = (key: string, data: TreeNode[]) => {
    const cacheItem: CacheItem = { data };
    try {
      localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  };
  
 export const getCache = (key: string): CacheItem | null => {
    const cachedItem = localStorage.getItem(CACHE_KEY_PREFIX + key);
    if (!cachedItem) return null;
  
    try {
      const parsedItem: CacheItem = JSON.parse(cachedItem);
      return parsedItem;
    } catch (error) {
      console.error("Failed to parse cached item:", error);
      return null;
    }
  };