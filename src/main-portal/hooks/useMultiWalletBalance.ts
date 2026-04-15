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
}

export interface WalletInfo {
  wallet_address: string;
  wallet_type?: string;
  is_primary?: boolean;
}

export interface WalletBalanceDetail {
  wallet_address: string;
  is_primary: boolean;
  sol: number;
  mcc: number;
  usdc: number;
}

export interface MultiWalletBalanceData {
  totalSolBalance: number;
  totalUsdcBalance: number;
  totalMccBalance: number;
  totalUsdValue: number;
  tokens: TokenBalance[];
  walletDetails: WalletBalanceDetail[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useMultiWalletBalance(wallets: WalletInfo[]): MultiWalletBalanceData {
  const [walletDetails, setWalletDetails] = useState<WalletBalanceDetail[]>([]);
  const [mccPrice, setMccPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllBalances = useCallback(async () => {
    if (!wallets || wallets.length === 0) {
      setLoading(false);
      setWalletDetails([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [details, price] = await Promise.all([
        Promise.all(wallets.map(async (wallet) => {
          try {
            const balance = await getWalletBalance(wallet.wallet_address);
            let sol = 0, mcc = 0, usdc = 0;
            if (balance) {
              sol = balance.sol?.balance || 0;
              mcc = balance.tokens?.find(t => t.symbol === 'MCC')?.balance || 0;
              usdc = balance.tokens?.find(t => t.symbol === 'USDC')?.balance || 0;
            }
            return { wallet_address: wallet.wallet_address, is_primary: wallet.is_primary || false, sol, mcc, usdc };
          } catch {
            return { wallet_address: wallet.wallet_address, is_primary: wallet.is_primary || false, sol: 0, mcc: 0, usdc: 0 };
          }
        })),
        getMccPrice()
      ]);

      setWalletDetails(details);
      setMccPrice(price);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balances');
    } finally {
      setLoading(false);
    }
  }, [wallets]);

  useEffect(() => {
    fetchAllBalances();
  }, [fetchAllBalances]);

  const totalSolBalance = walletDetails.reduce((sum, w) => sum + w.sol, 0);
  const totalUsdcBalance = walletDetails.reduce((sum, w) => sum + w.usdc, 0);
  const totalMccBalance = walletDetails.reduce((sum, w) => sum + w.mcc, 0);

  const tokens: TokenBalance[] = [
    { symbol: 'MCC', name: 'Microcosm Coin', balance: totalMccBalance, price: mccPrice, usdValue: mccPrice ? totalMccBalance * mccPrice : 0 },
    { symbol: 'MCD', name: 'Microcosm Dollar', balance: 0, price: null, usdValue: 0 },
    { symbol: 'SOL', name: 'Solana', balance: totalSolBalance, price: null, usdValue: 0 },
    { symbol: 'USDC', name: 'USD Coin', balance: totalUsdcBalance, price: null, usdValue: 0 },
  ];

  tokens.sort((a, b) => b.usdValue - a.usdValue);
  const totalUsdValue = tokens.reduce((sum, t) => sum + t.usdValue, 0);

  return { totalSolBalance, totalUsdcBalance, totalMccBalance, totalUsdValue, tokens, walletDetails, loading, error, refresh: fetchAllBalances };
}
