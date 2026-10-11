'use client';

import {createContext, ReactNode, useContext} from 'react';
import type {CacheData as CD} from '@/lib/cache/ssr-cache';

const CacheContext = createContext<CD | null>(null);

export const useCache = (): CD => {
  const ctx = useContext(CacheContext);
  if (!ctx) throw new Error('useCache must be used within CacheProvider');
  return ctx;
};

export const CacheProvider = ({
  children,
  data = {},
}: {
  children: ReactNode;
  data?: CD;
}) => {
  return (
    <CacheContext.Provider value={data}>
      {children}
    </CacheContext.Provider>
  );
};