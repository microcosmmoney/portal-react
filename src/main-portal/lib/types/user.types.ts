import type { UnitType } from './common.types'

export interface WalletInfo {
  userId: string;
  balance: number;
  transactionCount: number;
  lastTransaction: Transaction | null;
  isMock: boolean;
}

export type TransactionType = 'deposit' | 'transfer' | 'refund';

export interface Transaction {
  txHash: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
  to?: string;
  from?: string;
  balanceBefore: number;
  balanceAfter: number;
}

export interface TransactionResult {
  success: boolean;
  txHash: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  transaction: Transaction;
}

export type UserRole = 'agent' | 'user';

export interface UserInfo {
  uid: string;
  email: string | null;
  role: UserRole;
  apiKeysConfigured: boolean;
  created_at?: string;
  numeric_id?: number;
  short_id?: string;
  location_id?: string;
  unit_level?: number;
  territory_id?: string;
  source_project_id?: string;
}

export type StrategyStatus = 'running' | 'stopped' | 'paused';

export interface Strategy {
  strategy_id: string;
  strategy_name: string;
  user_id: string;
  status: StrategyStatus;
  exchange: string;
  symbol: string;
  created_at: string;
  updated_at?: string;
  parameters?: Record<string, unknown>;
  total_profit?: number;
  win_rate?: number;
  total_trades?: number;
}

export enum UserRank {
  MINER = 'Miner',
  COMMANDER = 'Commander',
  PIONEER = 'Pioneer',
  WARDEN = 'Warden',
  ADMIRAL = 'Admiral'
}

export const ACTIVE_RANKS = [UserRank.MINER, UserRank.COMMANDER, UserRank.PIONEER, UserRank.WARDEN, UserRank.ADMIRAL];

export interface TerritoryHoldings {
  station: number;
  matrix: number;
  sector: number;
  system: number;
}

export interface NextLevelRequirement {
  tier: 'station' | 'matrix' | 'sector' | 'system';
  have: number;
  need: number;
  description: string;
}

export interface LevelProgress {
  user_id?: string;
  uid?: string;
  wallet?: string | null;
  current_level: number;
  current_rank: UserRank;
  next_level: number | null;
  next_rank: UserRank | null;
  progress_percent: number;
  holdings: TerritoryHoldings;
  next_level_requirement: NextLevelRequirement | null;
}

export interface UserLevelStatus extends LevelProgress {
  database_level?: string;
  database_unit_level?: number;
  is_synced?: boolean;
}

export interface LevelSystemConfig {
  level_system: 'nft_holding_based';
  levels: Array<{
    level: number;
    rank: string;
    requirement: string;
  }>;
}

export interface MiningWeight {
  user_id: string;
  total_weight: number;
  profit_weight: number;
  duration_weight: number;
  strategy_weight: number;
  mcc_holding_weight: number;
  last_updated: string;
}

export interface TechBonusDetail {
  unit_id: string;
  unit_type: UnitType;
  bonus_percentage: number;
  is_lit: boolean;
  parent_unit_id?: string;
}

export type DistributionPlanType = 'plan_1' | 'plan_2' | 'plan_3' | 'plan_4' | 'plan_5';

export interface DistributionPlan {
  plan_id: number;
  plan_type: DistributionPlanType;
  name: string;
  manager_share: number;
  vault_share: number;
  member_share: number;
  system_reserve: number;
  charity_share: number;
}

export interface StationKPI {
  unit_id: string;
  current_members: number;
  target_members: number;
  total_usdt_volume: number;
  target_usdt_volume: number;
  is_qualified: boolean;
  member_progress: number;
  volume_progress: number;
}

export interface IncomeSummaryByLevel {
  record_count: number;
  total_income: string;
}

export interface ManagerIncomeSummary {
  success: boolean;
  user_id: string;
  income_by_level: {
    station?: IncomeSummaryByLevel;
    matrix?: IncomeSummaryByLevel;
    sector?: IncomeSummaryByLevel;
    system?: IncomeSummaryByLevel;
  };
  total_income: string;
  start_date?: string;
  end_date?: string;
  error?: string;
}

export interface StationIncomeSummary {
  success: boolean;
  territory_id: string;
  record_count: number;
  total_minted: string;
  distribution_summary: {
    team_share: string;
    station_vault_share: string;
    station_manager_share: string;
    matrix_manager_share: string;
    sector_manager_share: string;
    system_manager_share: string;
    mining_pool_share: string;
  };
  start_date?: string;
  end_date?: string;
  error?: string;
}

export interface TeamCustodySummary {
  success: boolean;
  wallets: Array<{
    wallet_type: string;
    wallet_address?: string;
    total_received: string;
  }>;
  total_received: string;
  error?: string;
}

export interface IncomeDistributionRecord {
  id: number;
  source_territory_id: string;
  source_user_id: string;
  distribution_date: string;
  total_minted_mcc: string;
  team_share: string;
  station_vault_share: string;
  station_manager_share: string;
  matrix_manager_share: string;
  sector_manager_share: string;
  system_manager_share: string;
  mining_pool_share: string;
  station_manager_id?: string;
  matrix_manager_id?: string;
  sector_manager_id?: string;
  system_manager_id?: string;
  created_at: string;
}

export interface IncomeHistoryResponse {
  success: boolean;
  records: IncomeDistributionRecord[];
  total: number;
  page: number;
  page_size: number;
  error?: string;
}
