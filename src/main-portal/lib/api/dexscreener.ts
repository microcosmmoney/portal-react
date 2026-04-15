// AI-generated · AI-managed · AI-maintained
export interface HourlyVolume {
  hour: string
  buyVolume: number
  sellVolume: number
  totalVolume: number
  tradeCount: number
}

export interface HeatmapCell {
  dow: number        // 1=Mon ... 7=Sun (ISO day of week)
  hour: number       // 0-23
  volume: number
  tradeCount: number
}

export interface MCCMarketData {
  price: number
  priceChange: {
    h1: number
    h24: number
  }
  volume: {
    h1: number
    h24: number
  }
  txns: {
    h1: { buys: number; sells: number }
    h24: { buys: number; sells: number }
  }
  liquidityUsd: number
  fdvUsd: number
  marketCapUsd: number
  dailyStats: {
    tradeCount: number
    miningCount: number
    marketMakingCount: number
    buyVolume: number
    sellVolume: number
  }
  hourlyVolumes: HourlyVolume[]
  weeklyHeatmap: HeatmapCell[]
  updatedAt: string
}

export async function fetchMCCMarketData(): Promise<MCCMarketData | null> {
  try {
    const response = await fetch('/api/stats/market')
    if (!response.ok) return null

    const json = await response.json()
    if (!json.success || !json.data) return null

    const d = json.data
    return {
      price: d.price || 0,
      priceChange: {
        h1: d.price_change_h1 || 0,
        h24: d.price_change_24h || 0,
      },
      volume: {
        h1: d.volume?.h1 || 0,
        h24: d.volume?.h24 || 0,
      },
      txns: {
        h1: d.txns?.h1 || { buys: 0, sells: 0 },
        h24: d.txns?.h24 || { buys: 0, sells: 0 },
      },
      liquidityUsd: d.liquidity_usd || 0,
      fdvUsd: d.fdv_usd || 0,
      marketCapUsd: d.market_cap_usd || 0,
      dailyStats: {
        tradeCount: d.daily_stats?.trade_count || 0,
        miningCount: d.daily_stats?.mining_count || 0,
        marketMakingCount: d.daily_stats?.buyback_count || 0,
        buyVolume: d.daily_stats?.buy_volume || 0,
        sellVolume: d.daily_stats?.sell_volume || 0,
      },
      hourlyVolumes: (d.hourly_volumes || []).map((h: Record<string, unknown>) => ({
        hour: h.hour as string,
        buyVolume: (h.buy_volume as number) || 0,
        sellVolume: (h.sell_volume as number) || 0,
        totalVolume: (h.total_volume as number) || 0,
        tradeCount: (h.trade_count as number) || 0,
      })),
      weeklyHeatmap: (d.weekly_heatmap || []).map((h: Record<string, unknown>) => ({
        dow: (h.dow as number) || 1,
        hour: (h.hour as number) || 0,
        volume: (h.volume as number) || 0,
        tradeCount: (h.trade_count as number) || 0,
      })),
      updatedAt: d.updated_at || '',
    }
  } catch (error) {
    console.error('Failed to fetch MCC market data:', error)
    return null
  }
}

// ── Custody Vault Dashboard Types ──

export interface CustodyVaultInfo {
  index: number
  vaultPda: string
  gasPayer: string
  usdcBalance: number
  mccBalance: number
  gasPayerSol: number
  gasConsumed: number
  txCount24h: number
  status: "active" | "idle"
}

export interface CustodyVaultSummary {
  totalUsdc: number
  totalMcc: number
  totalGasConsumed: number
  totalTx24h: number
  totalTrades24h: number
  activeVaults: number
  avgGasPerTx: number
  totalProfit: number
}

export interface CustodyAgentRoles {
  minerActive: boolean
  traderActive: boolean
}

export interface EcosystemMining {
  total_usd: number
  total_mcc: number
  total_count: number
}

export interface EcosystemBuyback {
  total_usd: number
  total_mcc: number
  total_count: number
  pool_usd_balance: number
}

export interface EcosystemLp {
  mcc_allocated: number
  usdc_balance: number
}

export interface EcosystemEpoch {
  current_epoch: number
  epoch_minted: number
  epoch_yield: number
  mining_vault_mcc: number
}

export interface CustodyVaultData {
  vaults: CustodyVaultInfo[]
  summary: CustodyVaultSummary
  agentRoles: CustodyAgentRoles
  mining: EcosystemMining
  buyback: EcosystemBuyback
  lp: EcosystemLp
  epoch: EcosystemEpoch
  updatedAt: string
}

export async function fetchCustodyVaultData(): Promise<CustodyVaultData | null> {
  try {
    const response = await fetch('/api/stats/custody-vaults')
    if (!response.ok) return null

    const json = await response.json()
    if (!json.success || !json.data) return null

    const d = json.data
    return {
      vaults: (d.vaults || []).map((v: Record<string, unknown>) => ({
        index: (v.index as number) || 0,
        vaultPda: (v.vault_pda as string) || "",
        gasPayer: (v.gas_payer as string) || "",
        usdcBalance: (v.usdc_balance as number) || 0,
        mccBalance: (v.mcc_balance as number) || 0,
        gasPayerSol: (v.gas_payer_sol as number) || 0,
        gasConsumed: (v.gas_consumed as number) || 0,
        txCount24h: (v.tx_count_24h as number) || 0,
        status: (v.status as string) === "active" ? "active" : "idle",
      })),
      summary: {
        totalUsdc: (d.summary?.total_usdc as number) || 0,
        totalMcc: (d.summary?.total_mcc as number) || 0,
        totalGasConsumed: (d.summary?.total_gas_consumed as number) || 0,
        totalTx24h: (d.summary?.total_tx_24h as number) || 0,
        totalTrades24h: (d.summary?.total_trades_24h as number) || 0,
        activeVaults: (d.summary?.active_vaults as number) || 0,
        avgGasPerTx: (d.summary?.avg_gas_per_tx as number) || 0,
        totalProfit: (d.summary?.total_profit as number) || 0,
      },
      agentRoles: {
        minerActive: !!d.agent_roles?.miner_active,
        traderActive: !!d.agent_roles?.trader_active,
      },
      mining: d.mining || { total_usd: 0, total_mcc: 0, total_count: 0 },
      buyback: d.buyback || { total_usd: 0, total_mcc: 0, total_count: 0, pool_usd_balance: 0 },
      lp: d.lp || { mcc_allocated: 0, usdc_balance: 0 },
      epoch: d.epoch || { current_epoch: 0, epoch_minted: 0, epoch_yield: 0, mining_vault_mcc: 0 },
      updatedAt: (d.updated_at as string) || '',
    }
  } catch (error) {
    console.error('Failed to fetch custody vault data:', error)
    return null
  }
}

// ── Solscan Links ──

export const SOLSCAN_LINKS = {
  mccToken: "https://solscan.io/token/MCCn6eqiTGzaiPKECg3viPmkdkS9YmkguqKvRcTxCsb",
  mcdToken: "https://solscan.io/token/MCDAhpfpKrsvXd1i95jToVd5SRL2xrZbeEriBbBJAn2",
  miningVault: "https://solscan.io/account/63CtMuLQTjTRctGXKEEzHu2zFWh9pbckbMDd3sqb8p3H",
  buybackVault: "https://solscan.io/account/C4NDtuAVkGaLyGdJNARfvguHFFuKpDf8XPGkYb6QV1Ha",
  teamVault: "https://solscan.io/account/TEA5FQrMTkmHoYCGpYfA2973xeXJ3UXHUe12oHdYoYb",
  poolPda: "https://solscan.io/account/GSBWtaX9WcBh8jUcmbXtQ1afQPHKSUKvsTxkqpJU3G9S",
  cpmmPool: "https://solscan.io/account/4AiaTd9bAWf3u8ScZWhXadJF1roc8bJKEKvaDudKacZd",
  custodyProgram: "https://solscan.io/account/CUS3ZFhcYqAj95ZTbjYu1yMT8DLdAQo8kTYova4NJJtr",
  programId: "https://solscan.io/account/REDEh89TzpwCtoWQuuNPtxskrVoUDQgowR7e7sZpWj9",
  transaction: (sig: string) => `https://solscan.io/tx/${sig}`,
  account: (address: string) => `https://solscan.io/account/${address}`,
}

/** Official Market Making Custody Vault PDAs (#0-#9) */
export const CUSTODY_VAULT_ADDRESSES = [
  "8GgSjyrnXfxzF9A2ptTVbwr5x7HbApBZAiNfLtasZymG",
  "GPGfHSzEMQG1w5fCGXoM4Qyq4AJKe2jEoE5Bp7FTEvvv",
  "Ay6nzAC1iNqNtBDqkWvjfkZRVJaw61v4tkNKs1h5QEsx",
  "8H4N2rT9JT3xxxVqFRiSECHY9dcbU51KjxsEfsBJSr5N",
  "8TzH83qkXUn2uifjVSFsfaBzpKvpf2h1FnKkP6gx33xo",
  "AkCWQ1Cgef3kD33YZN6RcbNdcG2uzGPqTm298DsRpEBh",
  "2ts8u1L21vZsJRHmB9SvGYw715bRp9wfM9gj9P8VZhah",
  "FtuVwEijmLiKLFriSQaQ5mQVexHpDEjGYojiCaXzNhrp",
  "HJiPgHoWrjmV8cguayJu6ggaBa2Kue5cbcdnt3T3eKbe",
  "2H1uXk3wwrhkxssKj5dKSK8cUVq5BxeLAvgfF2CweVoc",
] as const

export const RAYDIUM_POOL_URL = "https://raydium.io/swap/?inputMint=MCCn6eqiTGzaiPKECg3viPmkdkS9YmkguqKvRcTxCsb&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"

export const JUPITER_TRADE_URL = "https://jup.ag/tokens/MCCn6eqiTGzaiPKECg3viPmkdkS9YmkguqKvRcTxCsb"

export const BIRDEYE_TOKEN_URL = "https://birdeye.so/token/MCCn6eqiTGzaiPKECg3viPmkdkS9YmkguqKvRcTxCsb?chain=solana"

export const GMGN_TOKEN_URL = "https://gmgn.ai/sol/token/MCCn6eqiTGzaiPKECg3viPmkdkS9YmkguqKvRcTxCsb"

export const OKX_DEX_URL = "https://web3.okx.com/zh-hans/token/solana/MCCn6eqiTGzaiPKECg3viPmkdkS9YmkguqKvRcTxCsb"

export const DEXSCREENER_URL = "https://dexscreener.com/solana/4AiaTd9bAWf3u8ScZWhXadJF1roc8bJKEKvaDudKacZd"
