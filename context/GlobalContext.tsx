'use client';

import {createContext} from 'react';

export const GlobalContext = createContext<Partial<typeof window & Record<string, unknown>>>({});


export default GlobalContext;