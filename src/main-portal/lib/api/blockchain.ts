// AI-generated · AI-managed · AI-maintained
import { fetchApi } from './core'

export interface TokenBalance {
  symbol: string
  mint: string
  balance: number
  raw_balance: number
  decimals: number
  usd_value: number
}

export interface WalletBalance {
  wallet: string
  sol: TokenBalance
  tokens: TokenBalance[]
  total_usd_value: number
  cached_at: string
  from_cache: boolean
}

export interface PoolStatus {
  pool_address: string
  usdc_vault: string
  usdc_balance: number
  usdt_vault: string
  usdt_balance: number
  total_mcc_bought: number
  total_market_made: number
  status: 'active' | 'empty' | 'paused'
  updated_at: string
}

export async function getMccPrice(): Promise<number | null> {
  try {
    const response = await fetch('/api/blockchain-service/mining/ratio')
    const data = await response.json()
    if (data.success && data.data?.usdc_per_mcc) {
      return data.data.usdc_per_mcc as number
    }
    return null
  } catch {
    return null
  }
}

export async function getWalletBalance(
  walletAddress: string,
  forceRefresh = false
): Promise<WalletBalance | null> {
  try {
    const queryParams = forceRefresh ? '?force=true' : ''
    const response = await fetchApi(
      `/blockchain/balance/wallet/${walletAddress}${queryParams}`,
      { method: 'GET' },
      true
    )

    if (response.success && response.data) {
      return response.data as WalletBalance
    }
    return null
  } catch (error) {
    console.error('[Blockchain API] \u83b7\u53d6\u94b1\u5305\u4f59\u989d\u5931\u8d25:', error)
    return null
  }
}

export async function getMCCBalance(
  walletAddress: string,
  forceRefresh = false
): Promise<TokenBalance | null> {
  try {
    const queryParams = forceRefresh ? '?force=true' : ''
    const response = await fetchApi(
      `/blockchain/balance/wallet/${walletAddress}/mcc${queryParams}`,
      { method: 'GET' },
      true
    )

    if (response.success && response.data) {
      return response.data as TokenBalance
    }
    return null
  } catch (error) {
    console.error('[Blockchain API] \u83b7\u53d6 MCC \u4f59\u989d\u5931\u8d25:', error)
    return null
  }
}

export async function refreshWalletBalance(
  walletAddress: string
): Promise<WalletBalance | null> {
  try {
    const response = await fetchApi(
      `/blockchain/balance/wallet/${walletAddress}/refresh`,
      { method: 'POST' }
    )

    if (response.success && response.data) {
      return response.data as WalletBalance
    }
    return null
  } catch (error) {
    console.error('[Blockchain API] \u5237\u65b0\u94b1\u5305\u4f59\u989d\u5931\u8d25:', error)
    return null
  }
}

export async function invalidateWalletCache(
  walletAddress: string,
  txType?: string
): Promise<boolean> {
  try {
    const response = await fetchApi(
      `/blockchain/balance/invalidate/${walletAddress}`,
      {
        method: 'POST',
        body: JSON.stringify({ tx_type: txType })
      }
    )

    return response.success === true
  } catch (error) {
    console.error('[Blockchain API] \u5931\u6548\u7f13\u5b58\u5931\u8d25:', error)
    return false
  }
}

export async function getPoolStatus(
  forceRefresh = false
): Promise<PoolStatus | null> {
  try {
    const queryParams = forceRefresh ? '?force=true' : ''
    const response = await fetchApi(
      `/blockchain/balance/pool/reincarnation${queryParams}`,
      { method: 'GET' },
      true
    )

    if (response.success && response.data) {
      return response.data as PoolStatus
    }
    return null
  } catch (error) {
    console.error('[Blockchain API] \u83b7\u53d6\u8f6e\u56de\u6c60\u72b6\u6001\u5931\u8d25:', error)
    return null
  }
}

export function getTokenFromBalance(
  balance: WalletBalance | null,
  symbol: string
): TokenBalance | null {
  if (!balance) return null

  if (symbol.toUpperCase() === 'SOL') {
    return balance.sol
  }

  return balance.tokens.find(
    t => t.symbol.toUpperCase() === symbol.toUpperCase()
  ) || null
}

export function formatTokenBalance(
  balance: number,
  decimals = 2
): string {
  return balance.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

export interface McdAccountStatus {
  uid: string
  has_account: boolean
  is_miner: boolean
  territory_id: string | null
  can_receive_mcd: boolean
}

export interface McdAccountResult {
  uid: string
  territory_id: string
  status: 'created' | 'exists'
  tx_signature?: string
}

export interface ZombieAccount {
  uid: string
  email: string
  display_name: string | null
  wallet_address: string | null
  mcd_balance: number
  inactive_days: number
  last_login_at: string | null
  account_created_at: string | null
}

export interface ZombieAccountsResult {
  accounts: ZombieAccount[]
  total: number
  summary: {
    total_zombie_accounts: number
    estimated_rent_recovery: number
    min_inactive_days: number
  }
}

export interface ClosureResult {
  uid: string
  rent_recovered: number
  tx_signature: string | null
  closure_id: number
}

export interface BatchClosureResult {
  closed_count: number
  failed_count: number
  total_rent_recovered: number
  results: Array<{
    uid: string
    success: boolean
    error?: string
    rent_recovered: number
  }>
}

export interface RentStatistics {
  summary: {
    total_accounts: number
    zombie_accounts: number
    cumulative_closures: number
    cumulative_rent_recovered: number
  }
  daily_stats: Array<{
    date: string
    closed_count: number
    rent_recovered: number
  }>
}

export interface ClosureHistory {
  closures: Array<{
    id: number
    uid: string
    user_mcd_pda: string
    rent_recovered: number
    tx_signature: string | null
    closed_by: string
    reason: string
    user_email: string | null
    last_active_at: string | null
    closed_at: string
  }>
  total: number
}

// ──────────────────────────────────────────────────────────────
// System Address Management
// ──────────────────────────────────────────────────────────────

export interface SystemAddress {
  id: number
  category: string
  subcategory?: string
  name: string
  address: string
  description?: string
  status: string
  address_type?: string
  parent_address?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
  archived_at?: string
  archived_reason?: string
}

export interface SystemAddressStats {
  total: number
  categories: number
  by_category: Record<string, number>
  by_status: Record<string, number>
}

