'use client';

import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMCC } from '../hooks/useMCC';
import { useMCD } from '../hooks/useMCD';
import { useUserRank } from '../hooks/useUserRank';
import type {
  MCCBalance,
  MCCLockPeriod,
  MCCMinting,
  MCCMintingStats,
  MiningWeight,
  UserRank,
  PDABalance,
  MCDBalance,
  MCDTransaction,
  MCDUserDailyReward,
  TerritoryHoldings,
  NextLevelRequirement,
} from '../lib/types/api';

interface PDAInfo {
  pda_address: string;
  token_account: string;
  bump: number;
}

interface WalletContextType {
  connected: boolean;
  address: string | null;

  balance: MCCBalance | null;
  totalBalance: number;
  availableBalance: number;
  lockedBalance: number;

  pdaBalance: PDABalance | null;
  pdaInfo: PDAInfo | null;
  onChainBalance: number;

  lockPeriods: MCCLockPeriod[];

  mintingHistory: MCCMinting[];
  mintingStats: MCCMintingStats | null;

  mcdBalance: MCDBalance | null;
  mcdAmount: number;
  mcdTotalReceived: number;
  mcdTotalSpent: number;
  mcdTransactions: MCDTransaction[];
  mcdDailyRewards: MCDUserDailyReward[];

  userRank: UserRank | null;
  currentLevel: number | null;
  nextRank: UserRank | null;
  nextLevel: number | null;
  progressPercent: number;
  holdings: TerritoryHoldings;
  nextLevelRequirement: NextLevelRequirement | null;

  miningWeight: MiningWeight | null;

  loading: boolean;
  isRefreshing: boolean;
  error: string | null;

  refreshBalance: () => Promise<void>;
  refreshMinting: () => Promise<void>;
  refreshRank: () => Promise<void>;
  refreshPDABalance: () => Promise<void>;
  refreshMCD: () => Promise<void>;
}

const EMPTY_HOLDINGS: TerritoryHoldings = { station: 0, matrix: 0, sector: 0, system: 0 };

const WalletContext = createContext<WalletContextType>({
  connected: false,
  address: null,

  balance: null,
  totalBalance: 0,
  availableBalance: 0,
  lockedBalance: 0,

  pdaBalance: null,
  pdaInfo: null,
  onChainBalance: 0,

  lockPeriods: [],

  mintingHistory: [],
  mintingStats: null,

  mcdBalance: null,
  mcdAmount: 0,
  mcdTotalReceived: 0,
  mcdTotalSpent: 0,
  mcdTransactions: [],
  mcdDailyRewards: [],

  userRank: null,
  currentLevel: null,
  nextRank: null,
  nextLevel: null,
  progressPercent: 0,
  holdings: EMPTY_HOLDINGS,
  nextLevelRequirement: null,

  miningWeight: null,

  loading: true,
  isRefreshing: false,
  error: null,

  refreshBalance: async () => {},
  refreshMinting: async () => {},
  refreshRank: async () => {},
  refreshPDABalance: async () => {},
  refreshMCD: async () => {},
});

export const useWallet = () => useContext(WalletContext);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const mccData = useMCC(user?.uid);

  const mcdData = useMCD(user?.uid);

  const rankData = useUserRank(user?.uid);

  const loading = mccData.loading || mcdData.loading || rankData.loading;

  const error = mccData.error || mcdData.error || rankData.error;

  return (
    <WalletContext.Provider
      value={{
        connected: !!user,
        address: user?.uid || null,

        balance: mccData.balance,
        totalBalance: mccData.totalBalance,
        availableBalance: mccData.availableBalance,
        lockedBalance: mccData.lockedBalance,

        pdaBalance: mccData.pdaBalance,
        pdaInfo: mccData.pdaInfo,
        onChainBalance: mccData.onChainBalance,

        lockPeriods: mccData.lockPeriods,

        mintingHistory: mccData.mintingHistory,
        mintingStats: mccData.mintingStats,

        mcdBalance: mcdData.balance,
        mcdAmount: mcdData.mcdBalance,
        mcdTotalReceived: mcdData.totalReceived,
        mcdTotalSpent: mcdData.totalSpent,
        mcdTransactions: mcdData.transactions,
        mcdDailyRewards: mcdData.dailyRewards,

        userRank: rankData.rank,
        currentLevel: rankData.currentLevel,
        nextRank: rankData.nextRank,
        nextLevel: rankData.nextLevel,
        progressPercent: rankData.progressPercent,
        holdings: rankData.holdings,
        nextLevelRequirement: rankData.nextLevelRequirement,

        miningWeight: rankData.miningWeight,

        loading,
        isRefreshing: mccData.isRefreshing,
        error,

        refreshBalance: mccData.refresh,
        refreshMinting: mccData.refreshMinting,
        refreshRank: rankData.refresh,
        refreshPDABalance: mccData.refreshPDABalance,
        refreshMCD: mcdData.refresh,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
