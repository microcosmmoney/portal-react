// AI-generated · AI-managed · AI-maintained
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getWalletBalance, getMccPrice } from '../lib/api/blockchain';

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  price: number | null;
  change24h?: number;
  icon?: string;
}

export interface SolanaBalanceData {
  walletAddress: string | null;
  solBalance: number;
  usdcBalance: number;
  mccBalance: number;
  totalUsdValue: number;
  tokens: TokenBalance[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useSolanaBalance(walletAddress: string | null): SolanaBalanceData {
  const [solBalance, setSolBalance] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [mccBalance, setMccBalance] = useState(0);
  const [mccPrice, setMccPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [walletBalance, price] = await Promise.all([
        getWalletBalance(walletAddress),
        getMccPrice()
      ]);

      setMccPrice(price);

      if (walletBalance) {
        setSolBalance(walletBalance.sol?.balance || 0);
        setUsdcBalance(walletBalance.tokens?.find(t => t.symbol === 'USDC')?.balance || 0);
        setMccBalance(walletBalance.tokens?.find(t => t.symbol === 'MCC')?.balance || 0);
      } else {
        setSolBalance(0);
        setUsdcBalance(0);
        setMccBalance(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balances');
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const tokens: TokenBalance[] = [
    { symbol: 'MCC', name: 'Microcosm Coin', balance: mccBalance, price: mccPrice, usdValue: mccPrice ? mccBalance * mccPrice : 0 },
    { symbol: 'MCD', name: 'Microcosm Dollar', balance: 0, price: null, usdValue: 0 },
    { symbol: 'SOL', name: 'Solana', balance: solBalance, price: null, usdValue: 0 },
    { symbol: 'USDC', name: 'USD Coin', balance: usdcBalance, price: null, usdValue: 0 },
  ];

  tokens.sort((a, b) => b.usdValue - a.usdValue);
  const totalUsdValue = tokens.reduce((sum, t) => sum + t.usdValue, 0);

  return { walletAddress, solBalance, usdcBalance, mccBalance, totalUsdValue, tokens, loading, error, refresh: fetchBalances };
}
