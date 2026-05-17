export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

export type UnitType = 'station' | 'matrix' | 'sector' | 'system';

export interface Unit {
  unit_id: string;
  unit_name: string;
  unit_type: UnitType;
  description?: string;
  image_url?: string;
  location?: string;
  parent_id?: string;
  parent_unit_id?: string;
  manager_uid?: string;
  manager_id?: string;
  manager_wallet?: string;
  max_capacity?: number;
  capacity?: number;
  current_members?: number;
  vault_balance?: number;
  auction_status?: string;
  created_at: string;
  updated_at?: string;
  short_id?: string;
  full_path?: string;
  territory_id?: string;
  manager_display_name?: string;
  manager_avatar_url?: string;
  image_status?: 'pending' | 'approved' | 'rejected';
}

export interface Member {
  member_id: string;
  unit_id: string;
  user_id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  joined_at: string;
}

export type AuctionType = 'first' | 'second';

export type AuctionStatus = 'active' | 'ended' | 'cancelled';

export interface Auction {
  auction_id: number;
  unit_id: string;
  unit_name?: string;
  unit_type?: UnitType;
  auction_type: AuctionType;
  starting_price: number;
  current_price: number;
  reserve_price?: number;
  bid_increment: number;
  status: AuctionStatus;
  start_time: string;
  end_time: string;
  winner_id?: string;
  created_by: string;
  created_at: string;
  bid_count?: number;
  time_remaining?: string;
}

export type BidStatus = 'active' | 'outbid' | 'won' | 'lost' | 'refunded';

export interface Bid {
  bid_id: number;
  auction_id: number;
  user_id: string;
  bid_amount: number;
  deposit_amount: number;
  transaction_hash: string;
  status: BidStatus;
  created_at: string;
  auction?: Auction;
  unit_name?: string;
}

export interface PlaceBidRequest {
  auction_id: number;
  bid_amount: number;
  deposit_amount: number;
  transaction_hash: string;
}

export interface AuctionHistoryParams {
  unit_id?: string;
  limit?: number;
  offset?: number;
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export interface QueryParams {
  page?: number;
  per_page?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: string | number | boolean | undefined;
}

export interface OperationResult {
  success: boolean;
  message?: string;
  error?: string;
}

export type ManagerLevel = 'station' | 'matrix' | 'sector' | 'system';

export const ManagerRoleNames: Record<ManagerLevel, string> = {
  station: 'Commander',
  matrix: 'Pioneer',
  sector: 'Warden',
  system: 'Admiral'
};

export const ManagerShareRatios: Record<ManagerLevel, number> = {
  station: 0.16,
  matrix: 0.12,
  sector: 0.08,
  system: 0.04
};

export type QueueStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface UserQueueStatus {
  success: boolean;
  in_queue: boolean;
  is_onboarded?: boolean;
  territory_id?: string;
  station_name?: string;
  user_type?: string;
  user_rank?: string;
  position?: number;
  estimated_wait_minutes?: number;
  preferred_territory_id?: string;
  joined_at?: string;
  status?: QueueStatus;
  error?: string;
}


export interface PreparedTransaction {
  transaction: string;
  message: string;
  accounts: string[];
}
