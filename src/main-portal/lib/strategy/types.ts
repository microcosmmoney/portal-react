// AI-generated · AI-managed · AI-maintained
export interface BaseParams {
  exchange: string
  symbol: string
  leverage: number
  margin_mode: string
  kline_period: string
  max_net_position: number
  global_drawdown_limit: number
  account_id: string
  stop_loss_enabled: boolean
  stop_loss_pct: number
}

export interface EnergyParams {
  max_capital_pct: number
  alt_hedge_enabled: boolean
  alt_add_pos_quantity_multiplier: number
  alt_add_pos_distance_multiplier: number
  alt_price_adjust_threshold_pct: number
  alt_quantity_adjust_threshold_pct: number
  sync_hedge_enabled: boolean
  sync_add_pos_loss_trigger_pct: number
  take_profit_trigger_pct: number
  sync_add_pos_quantity_multiplier: number
  tp_form_a_min_profit_pct: number
  tp_form_b_min_ratio_pct: number
  unilateral_add_enabled: boolean
  unilateral_add_mode: string
  unilateral_add_loss_trigger_pct: number
  unilateral_fib_base_pct: number
  unilateral_add_quantity_pct: number
  balance_check_enabled: boolean
  balance_min_ratio_pct: number
  balance_add_quantity_pct: number
  stop_loss_enabled: boolean
  stop_loss_pct: number
}

export interface PowerParams {
  start_condition_mode: string
  start_energy_profit_pct: number
  start_price_gap_pct: number
  start_pos_thickness_pct: number
  open_pos_quantity: number
  take_profit_pct: number
  max_open_orders: number
  stale_pos_cleanup_days: number
  order_merge_count_threshold: number
  order_merge_batch_multiplier: number
  order_cleanup_loss_trigger_pct: number
  open_order_price_buffer_pct: number
  open_order_spacing_multiplier: number
  max_total_orders: number
}

export interface StrategyParams {
  name: string
  base: BaseParams
  energy: EnergyParams
  power: PowerParams
}

export interface Account {
  account_name: string
  display_name: string
  is_default: boolean
}

export interface FundPoolInfo {
  fund_pool_total: number
  used_capital: number
  used_percentage: number
  remaining_capital: number
  recommended_max_pct: number
  pool_percentage: number
}

export interface ExchangeData {
  accounts: Record<string, Account>
}
