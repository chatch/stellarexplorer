import { createContext } from 'react';

import type SorobanServer from './lib/stellar/server_soroban';
import type HorizonServer from './lib/stellar/server';

export const HorizonServerHandleContext = createContext<HorizonServer|null>(null);
export const SorobanServerHandleContext = createContext<SorobanServer|null>(null);