// AI-generated · AI-managed · AI-maintained
'use client'

import useSWR from 'swr'
import { fetchApi } from '../lib/api-service'

interface PositionData {
  amount?: number
  entryPrice?: number
}

interface PowerStartCheck {
  profit_check?: { passed: boolean; current: number; threshold: number }
  gap_check?: { passed: boolean; current: number; threshold: number }
  thickness_check?: { passed: boolean; thickness_pct: number }
  orders_check?: { passed: boolean; long_count: number; short_count: number; max_orders: number }
}

export interface LiveState {
  total_unrealized_pnl?: number
  energy_unrealized_pnl?: number
  price_gap_pct?: number
  price_gap_abs?: number
  current_drawdown_pct?: number
  current_price?: number
  wallet_balance?: number

  total_long_pos_amount?: number
  total_short_pos_amount?: number

  power_open_orders_long?: number
  power_open_orders_short?: number
  power_tp_orders_long?: number
  power_tp_orders_short?: number
  power_total_realized_pnl?: number
  power_closed_trades_long?: number
  power_closed_trades_short?: number

  energy_realized_pnl?: number

  user_manual_long_position?: number
  user_manual_short_position?: number
  user_manual_realized_pnl?: number

  power_start_mode?: string
  power_start_check?: PowerStartCheck

  positions?: {
    energy?: {
      LONG?: PositionData
      SHORT?: PositionData
    }
    power?: {
      LONG?: { amount?: number; open_orders?: number; tp_orders?: number }
      SHORT?: { amount?: number; open_orders?: number; tp_orders?: number }
    }
    total_long?: PositionData
    total_short?: PositionData
  }

  raw_snapshot?: {
    positions?: Array<{
      positionSide: 'LONG' | 'SHORT'
      unRealizedProfit: string
      positionAmt: string
      entryPrice: string
      markPrice: string
    }>
  }

  start_time?: string
  duration?: string

  power_today_realized_pnl?: number
  energy_today_realized_pnl?: number

  power_win_rate?: number
  power_profit_factor?: number
  energy_win_rate?: number
  energy_profit_factor?: number

  energy_hedge_count?: number
  energy_sync_hedge_count?: number
  energy_tp_form_a_count?: number
  energy_tp_form_b_count?: number

  power_stale_converted_count?: number
  power_avg_holding_duration?: number
  power_longest_stale_duration?: number
  power_avg_stale_duration?: number
  power_stale_cleanup_count?: number
  power_protection_trigger_count?: number

  power_total_fees?: number
  energy_total_fees?: number
  power_today_fees?: number
  energy_today_fees?: number
  power_month_fees?: number
  energy_month_fees?: number

  manual_open_count?: number
  manual_close_count?: number
  manual_chase_count?: number
  manual_cancel_count?: number

}

export interface PowerParams {
  start_price_gap_pct?: number
  open_pos_quantity?: number
  start_pos_thickness_pct?: number
  max_open_orders?: number
  start_energy_profit_pct?: number
}

export interface Strategy {
  id: string
  name?: string
  strategy_name?: string
  symbol?: string
  is_active: boolean
  base?: {
    symbol?: string
  }
  power?: PowerParams
  params?: {
    power?: PowerParams
  }
  live_state?: LiveState
  created_at?: string
  updated_at?: string
}

const fetcher = async (url: string) => fetchApi(url)

export function useStrategies(refreshInterval: number = 15000) {
  return useSWR<Strategy[]>(
    '/strategies',
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: true,
      dedupingInterval: 5000,
      errorRetryCount: 3,
    }
  )
}

export function useStrategyDetails(strategyId: string | null, refreshInterval: number = 15000) {
  return useSWR<Strategy>(
    strategyId ? `/strategies/${strategyId}` : null,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: true,
      dedupingInterval: 5000,
      errorRetryCount: 3,
    }
  )
}
