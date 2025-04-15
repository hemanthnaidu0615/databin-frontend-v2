type CacheItem = {
    data: any;
    tooltipData: any;
  };
  
  const CACHE_KEY_PREFIX = "sales_by_region_cache_";
  
  export const setCache = (key: string, data: any, tooltipData: any) => {
    const cacheItem: CacheItem = { data, tooltipData };
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