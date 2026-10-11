// cache.ts - Make it safer
import {cache} from 'react';

export type CacheData = Record<string, any>;

const cacheStore = cache(() => {
  let data = {} as CacheData;
  return {
    get: () => ({ ...data }),
    set: (newData: Partial<CacheData>) => {
      data = { ...data, ...newData }; 
    },
    clear: () => {
      data = {};
    },
  };
});

export const getCache = (): CacheData => {
  return cacheStore().get();
};
export const setCache = (data: Partial<CacheData>) => {
  cacheStore().set(data)
};
export const clearCache = () => cacheStore().clear();