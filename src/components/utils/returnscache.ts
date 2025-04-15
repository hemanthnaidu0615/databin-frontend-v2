type CacheItem = {
    data: any;
    calculatedData: any;
  };
  
const CACHE_KEY_PREFIX_RETURNS = "returns_page_cache_";

export const setReturnsCache = (key: string, data: any) => {
  const cacheItem: CacheItem = { data, calculatedData: null }; // Adjust as needed
  try {
    localStorage.setItem(CACHE_KEY_PREFIX_RETURNS + key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error("Error saving returns data to localStorage:", error);
  }
};

export const getReturnsCache = (key: string): CacheItem | null => {
  const cachedItem = localStorage.getItem(CACHE_KEY_PREFIX_RETURNS + key);
  if (!cachedItem) return null;

  try {
    const parsedItem: CacheItem = JSON.parse(cachedItem);
    return parsedItem;
  } catch (error) {
    console.error("Failed to parse cached returns item:", error);
    return null;
  }
};