import type { DistributionPlanType } from './user.types'

export interface MCCBalance {
  user_id: number;
  total_balance: number;
  available_balance: number;
  locked_balance: number;
  created_at: string;
  updated_at: string;
}

export interface MCCLockPeriod {
  lock_id: string;
  user_id: string;
  amount: number;
  lock_start: string;
  lock_end: string;
  reason: string;
  status: 'locked' | 'released';
}

export interface MCCMinting {
  minting_id: string;
  user_id: string;
  amount: number;
  reason: string;
  minted_at: string;
  total_minted_before: number;
  total_minted_after: number;
}

export interface MCCMintingStats {
  total_minted: number;
  current_rate: number;
  next_halving_at: number;
  next_halving_remaining: number;
  halving_count: number;
}

export interface MCCWithdrawalRequest {
  user_id: string;
  amount: number;
  address: string;
  network: string;
}

export interface MCCWithdrawal {
  withdrawal_id: string;
  user_id: string;
  amount: number;
  fee: number;
  net_amount: number;
  address: string;
  network: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'rejected';
  transaction_hash?: string;
  created_at: string;
  completed_at?: string;
}

export interface PDAPWithdrawRequest {
  user_id: number;
  amount: number;
  destination: string;
}

export interface PDAWithdrawResponse {
  status: string;
  tx_signature: string;
  withdraw_id?: number;
  user_id: number;
  amount: number;
  destination: string;
  explorer_url: string;
  confirmed_at: string;
}

export interface PDABalance {
  user_id: number;
  pda_address: string;
  token_account: string | null;
  balance: number;
  balance_lamports: number;
  error?: string;
}

export interface MCCDistributionDetails {
  user_mcc: number;
  team_mcc: number;
  magistrate_mcc: number;
  station_mcd: number;
  developer_mcd?: number;
}

export interface MCCHistoryRecord {
  id: string;
  type: 'mining' | 'transfer' | 'reward' | 'fee' | 'lock' | 'unlock' | 'system';
  amount: number;
  direction: 'in' | 'out';
  source: string;
  source_display: string;
  tx_hash?: string | null;
  status: string;
  memo: string;
  created_at: string;
  distribution_details?: MCCDistributionDetails;
}

export interface RechargeRecord {
  recharge_id: string;
  user_id: string;
  amount: number;
  currency: string;
  network: string;
  transaction_hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  confirmed_at?: string;
}

export interface VaultRecord {
  record_id: string;
  unit_id: string;
  amount: number;
  type: 'deposit' | 'distribution' | 'withdrawal';
  distribution_plan?: DistributionPlanType;
  created_by: string;
  created_at: string;
  recipients?: Array<{
    user_id: string;
    amount: number;
    share_type: string;
  }>;
}

export interface MCDBalance {
  account_type: 'user' | 'station_vault';
  account_id: string;
  balance: number;
  total_received: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface MCDTransaction {
  id: number;
  tx_type: 'daily_distribution' | 'spend' | 'transfer' | 'refund';
  from_account_type: 'station_vault' | 'user' | 'system';
  from_account_id: string;
  to_account_type: 'user' | 'station_vault' | 'system';
  to_account_id: string;
  amount: number;
  memo?: string;
  created_at: string;
}

export interface MCDDailyDistribution {
  id: number;
  territory_id: string;
  distribution_date: string;
  vault_balance_before: number;
  distribution_rate: number;
  total_distributed: number;
  recipients_count: number;
  total_mining_amount: number;
  created_at: string;
}

export interface MCDUserDailyReward {
  id: number;
  uid: string;
  territory_id: string;
  reward_date: string;
  mining_amount: number;
  station_total_mining: number;
  mining_ratio: number;
  mcd_received: number;
  created_at: string;
}

export interface MCDSpendRecord {
  id: number;
  uid: string;
  amount: number;
  product_type: string;
  product_id?: string;
  memo?: string;
  created_at: string;
}

export interface StationMCDVault {
  territory_id: string;
  station_name: string;
  mcd_balance: number;
  total_received: number;
  total_distributed: number;
  last_distribution_date?: string;
  created_at: string;
  updated_at: string;
}

export interface MCDSpendRequest {
  amount: number;
  product_type: string;
  product_id?: string;
  memo?: string;
}

export interface MCDSpendResponse {
  success: boolean;
  new_balance?: number;
  spend_record?: MCDSpendRecord;
  error?: string;
}

export interface MCDHistoryParams {
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
}

export interface MiningRequest {
  mcc_amount: number;
  stablecoin_type?: 'usdc' | 'usdt';
  reference?: string;
}

export interface MiningRequestResponse {
  request_id: string;
  uid?: string;
  token_type?: 'mcc' | 'mcd';
  mcc_amount: number;
  mcd_amount?: number;
  amount?: number;
  usdc_amount: number;
  usdc_amount_with_discount: number;
  usd_amount?: number;
  usd_amount_with_discount?: number;
  discount_percent: number;
  recipient: string;
  stablecoin_type?: string;
  stablecoin_mint?: string;
  expires_at: string;
}

export interface PaymentConfirmRequest {
  request_id: string;
  tx_signature: string;
  mcc_amount: number;
  usdc_amount: number;
  stablecoin_type?: 'usdc' | 'usdt';
  v3_atomic?: boolean;
}

export interface PaymentConfirmResponse {
  request_id: string;
  status: 'confirmed' | 'pending' | 'failed';
  mcc_distributed: {
    user: number;
    team: number;
    magistrate: number;
    station_vault: number;
  };
  message: string;
}

export interface MiningRatioInfo {
  current_stage: number;
  mined_mcc: number;
  total_minted: number;
  ratio: number;
  usdc_per_mcc: number;
  base_price: number;
  next_halving_at: number;
  source?: string;
}

export interface PublicMiningRequest {
  wallet_address?: string;
  mcc_amount: number;
  stablecoin_type?: 'usdc' | 'usdt';
  token_type?: 'mcc' | 'mcd';
}

export interface PublicPaymentConfirmRequest {
  wallet_address: string;
  tx_signature: string;
  request_id: string;
  mcc_amount: number;
  usd_amount: number;
  stablecoin_type?: 'usdc' | 'usdt';
  token_type?: 'mcc' | 'mcd';
  v3_atomic?: boolean;
}
