// AI-generated · AI-managed · AI-maintained
import type { StrategyParams } from './types'

export const initialStrategyParams: StrategyParams = {
  name: 'Double Helix',
  base: {
    exchange: 'Binance',
    symbol: 'BTCUSDT',
    leverage: 50,
    margin_mode: 'Cross',
    kline_period: '1m',
    max_net_position: 0.001,
    global_drawdown_limit: 0.20,
    account_id: "main",
    stop_loss_enabled: false,
    stop_loss_pct: 0.05
  },
  energy: {
    max_capital_pct: 0.20,
    alt_hedge_enabled: true,
    alt_add_pos_quantity_multiplier: 2,
    alt_add_pos_distance_multiplier: 1.0,
    alt_price_adjust_threshold_pct: 0.1,
    alt_quantity_adjust_threshold_pct: 0.1,
    sync_hedge_enabled: true,
    sync_add_pos_loss_trigger_pct: 0.10,
    take_profit_trigger_pct: 0.01,
    sync_add_pos_quantity_multiplier: 0.5,
    tp_form_a_min_profit_pct: 0.01,
    tp_form_b_min_ratio_pct: 0.5,
    unilateral_add_enabled: false,
    unilateral_add_mode: 'fixed',
    unilateral_add_loss_trigger_pct: 0.05,
    unilateral_fib_base_pct: 0.01,
    unilateral_add_quantity_pct: 0.20,
    balance_check_enabled: true,
    balance_min_ratio_pct: 0.25,
    balance_add_quantity_pct: 0.50,
    stop_loss_enabled: false,
    stop_loss_pct: 0.05
  },
  power: {
    start_condition_mode: "profit",
    start_energy_profit_pct: 0.01,
    start_price_gap_pct: 0.02,
    start_pos_thickness_pct: 0.002,
    open_pos_quantity: 0.002,
    take_profit_pct: 0.001,
    max_open_orders: 20,
    stale_pos_cleanup_days: 18,
    order_merge_count_threshold: 10,
    order_merge_batch_multiplier: 1,
    order_cleanup_loss_trigger_pct: 0.01,
    open_order_price_buffer_pct: 0.001,
    open_order_spacing_multiplier: 1.0,
    max_total_orders: 100
  }
}
