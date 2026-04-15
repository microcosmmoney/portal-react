export type TerritoryNftType = 'station' | 'matrix' | 'sector';

export interface TerritoryNftCollection {
  authority: string;
  collection_mint: string;
  total_minted: number;
  station_count: number;
  matrix_count: number;
  sector_count: number;
  is_paused: boolean;
}

export interface TerritoryNftMetadata {
  mint: string;
  owner: string;
  nft_type: TerritoryNftType;
  unit_id: string;
  name: string;
  symbol: string;
  uri: string;
  image?: string;
  created_at: number;
}

export interface TerritoryNftMintRequest {
  nft_type: TerritoryNftType;
  unit_id: string;
  recipient_wallet?: string;
  name: string;
  symbol: string;
  uri: string;
}

export interface TerritoryNftTransferRequest {
  mint: string;
  to_wallet: string;
}

export type OnchainAuctionStatus = 'pending' | 'active' | 'ended' | 'settled' | 'cancelled';

export interface OnchainAuctionConfig {
  authority: string;
  treasury_wallet: string;
  min_bid_increment_bps: number;
  platform_fee_bps: number;
  min_auction_duration: number;
  max_auction_duration: number;
  total_auctions: number;
  active_auctions: number;
  is_paused: boolean;
}

export interface OnchainAuction {
  auction_id: number;
  nft_mint: string;
  nft_type: TerritoryNftType;
  unit_id: string;
  seller: string;
  starting_price: number;
  current_bid: number;
  current_bidder: string | null;
  reserve_price: number;
  min_bid_increment: number;
  start_time: number;
  end_time: number;
  status: OnchainAuctionStatus;
  bid_count: number;
  escrow_account: string;
}

export interface OnchainBid {
  auction_id: number;
  bidder: string;
  amount: number;
  timestamp: number;
  is_winning: boolean;
}

export interface CreateOnchainAuctionRequest {
  nft_mint: string;
  starting_price: number;
  reserve_price?: number;
  duration_seconds: number;
}

export interface PlaceOnchainBidRequest {
  auction_id: number;
  bid_amount: number;
}

export interface FragmentConfig {
  authority: string;
  fragment_token_program: string;
  total_vaults: number;
  total_fragments_issued: number;
  is_paused: boolean;
}

export interface FragmentVault {
  vault_id: number;
  nft_mint: string;
  nft_type: TerritoryNftType;
  unit_id: string;
  fragment_mint: string;
  total_supply: number;
  circulating_supply: number;
  total_fragments: number;
  fragments_sold: number;
  is_active: boolean;
  price_per_fragment: number;
  is_redeemable: boolean;
  created_at: number;
  creator: string;
}

export interface FragmentHolding {
  vault_id: number;
  fragment_mint: string;
  holder: string;
  wallet: string;
  amount: number;
  fragment_amount: number;
  share_percentage: number;
  percentage: number;
}

export interface FragmentizeRequest {
  nft_mint: string;
  total_fragments: number;
  price_per_fragment: number;
}

export interface BuyFragmentRequest {
  vault_id: number;
  amount: number;
}

export interface RedeemNftRequest {
  vault_id: number;
}

export type LoanStatus = 'Active' | 'Repaid' | 'Liquidated';

export interface LendingPool {
  authority: string;
  mcc_mint: string;
  lp_mint: string;
  vault: string;
  total_deposits: number;
  total_borrows: number;
  utilization_rate: number;
  base_rate: number;
  optimal_utilization: number;
  slope1: number;
  slope2: number;
  current_borrow_rate: number;
  current_supply_rate: number;
  is_paused: boolean;
}

export interface LendingPoolStats {
  total_deposits: number;
  total_deposits_formatted: number;
  total_borrows: number;
  total_borrows_formatted: number;
  available_liquidity: number;
  available_liquidity_formatted: number;
  utilization_rate_percent: number;
  borrow_apr_percent: number;
  supply_apr_percent: number;
  ltv_percent: number;
}

export interface UserLendingPosition {
  wallet: string;
  lp_balance: number;
  lp_value_in_mcc: number;
  depositValue: number;
  active_loans_count: number;
  total_borrowed: number;
  total_collateral_value: number;
}

export interface Loan {
  loan_id: number;
  borrower: string;
  principal: number;
  interest_accrued: number;
  total_owed: number;
  collateral_nft_mint: string;
  collateral_nft_type: TerritoryNftType;
  collateral_value: number;
  ltv: number;
  borrow_rate: number;
  start_time: number;
  last_update: number;
  missed_payments: number;
  status: LoanStatus;
}

export interface LendingDepositRequest {
  amount: number;
  wallet?: string;
}

export interface LendingWithdrawRequest {
  lp_amount: number;
  wallet?: string;
}

export interface LendingBorrowRequest {
  amount: number;
  collateral_nft_mint: string;
  wallet?: string;
}

export interface LendingRepayRequest {
  loan_id: number;
  amount: number;
  wallet?: string;
}

export interface LendingLiquidateRequest {
  borrower_wallet: string;
  loan_id: number;
  liquidator_wallet?: string;
}

export interface InterestCalculation {
  principal: number;
  annual_rate: number;
  days: number;
  interest: number;
  total: number;
}

export interface BorrowCostEstimate {
  principal: number;
  collateral_value: number;
  ltv: number;
  annual_rate: number;
  monthly_interest: number;
  total_interest_30_days: number;
}
