import { fetchApi } from '../core'
import type {
  APIResponse,
  TerritoryNftCollection, TerritoryNftMetadata, TerritoryNftMintRequest, TerritoryNftTransferRequest,
  OnchainAuctionConfig, OnchainAuction, OnchainBid,
  CreateOnchainAuctionRequest, PlaceOnchainBidRequest,
  FragmentConfig, FragmentVault, FragmentHolding,
  FragmentizeRequest, BuyFragmentRequest, RedeemNftRequest,
  LendingPool, LendingPoolStats, UserLendingPosition, Loan,
  LendingDepositRequest, LendingWithdrawRequest, LendingBorrowRequest,
  LendingRepayRequest, LendingLiquidateRequest,
  InterestCalculation, BorrowCostEstimate, PreparedTransaction
} from '../../types/api'

export const getTerritoryNftCollection = (): Promise<APIResponse<TerritoryNftCollection>> => fetchApi('/organization-service/territory/config')
export const getTerritoryNftMetadata = (mint: string): Promise<APIResponse<TerritoryNftMetadata>> => fetchApi(`/organization-service/territory/nft/${mint}`)

export const getUserTerritoryNfts = (wallet?: string): Promise<APIResponse<TerritoryNftMetadata[]>> =>
  fetchApi(wallet ? `/organization-service/territory/list/${wallet}` : '/organization-service/territory/list')

export const getUnitTerritoryNft = (unitId: string): Promise<APIResponse<TerritoryNftMetadata>> => fetchApi(`/organization-service/territory/unit/${unitId}/nft`)

export const prepareMintTerritoryNft = (data: TerritoryNftMintRequest): Promise<APIResponse<{ transaction: string; mint: string; message: string }>> =>
  fetchApi('/organization-service/territory/mint/prepare', { method: 'POST', body: JSON.stringify(data) })

export const prepareTransferTerritoryNft = (data: TerritoryNftTransferRequest): Promise<APIResponse<{ transaction: string; message: string }>> =>
  fetchApi('/organization-service/territory/transfer/prepare', { method: 'POST', body: JSON.stringify(data) })

export const getOnchainAuctionConfig = (): Promise<APIResponse<OnchainAuctionConfig>> => fetchApi('/organization-service/auction-solana/config')
export const getActiveOnchainAuctions = (): Promise<APIResponse<OnchainAuction[]>> => fetchApi('/organization-service/auction-solana/active')
export const getOnchainAuctionDetails = (auctionId: number): Promise<APIResponse<OnchainAuction>> => fetchApi(`/organization-service/auction-solana/auction/${auctionId}`)
export const getOnchainAuctionBids = (auctionId: number): Promise<APIResponse<OnchainBid[]>> => fetchApi(`/organization-service/auction-solana/auction/${auctionId}/bids`)

export const getUserOnchainBids = (wallet?: string): Promise<APIResponse<OnchainBid[]>> =>
  fetchApi(wallet ? `/organization-service/auction-solana/bids/${wallet}` : '/organization-service/auction-solana/my-bids')

export const getUserOnchainAuctions = (wallet?: string): Promise<APIResponse<OnchainAuction[]>> =>
  fetchApi(wallet ? `/organization-service/auction-solana/auctions/${wallet}` : '/organization-service/auction-solana/my-auctions')

export const prepareCreateOnchainAuction = (data: CreateOnchainAuctionRequest): Promise<APIResponse<{ transaction: string; auction_id: number; escrow_account: string; message: string }>> =>
  fetchApi('/organization-service/auction-solana/create/prepare', { method: 'POST', body: JSON.stringify(data) })

export const preparePlaceOnchainBid = (data: PlaceOnchainBidRequest): Promise<APIResponse<{ transaction: string; message: string }>> =>
  fetchApi('/organization-service/auction-solana/bid/prepare', { method: 'POST', body: JSON.stringify(data) })

export const prepareSettleOnchainAuction = (auctionId: number): Promise<APIResponse<{ transaction: string; winner: string; final_price: number; message: string }>> =>
  fetchApi(`/organization-service/auction-solana/settle/${auctionId}/prepare`, { method: 'POST' })

export const prepareCancelOnchainAuction = (auctionId: number): Promise<APIResponse<{ transaction: string; message: string }>> =>
  fetchApi(`/organization-service/auction-solana/cancel/${auctionId}/prepare`, { method: 'POST' })

export const getFragmentConfig = (): Promise<APIResponse<FragmentConfig>> => fetchApi('/organization-service/fragment/config')
export const getFragmentVaults = (): Promise<APIResponse<FragmentVault[]>> => fetchApi('/organization-service/fragment/vaults')
export const getFragmentVault = (vaultId: number): Promise<APIResponse<FragmentVault>> => fetchApi(`/organization-service/fragment/vault/${vaultId}`)

export const getUserFragmentHoldings = (wallet?: string): Promise<APIResponse<FragmentHolding[]>> =>
  fetchApi(wallet ? `/organization-service/fragment/holdings/${wallet}` : '/organization-service/fragment/my-holdings')

export const getVaultHolders = (vaultId: number): Promise<APIResponse<FragmentHolding[]>> => fetchApi(`/organization-service/fragment/vault/${vaultId}/holders`)

export const prepareFragmentize = (data: FragmentizeRequest): Promise<APIResponse<{ transaction: string; vault_id: number; fragment_mint: string; message: string }>> =>
  fetchApi('/organization-service/fragment/fragmentize/prepare', { method: 'POST', body: JSON.stringify(data) })

export const prepareBuyFragment = (data: BuyFragmentRequest): Promise<APIResponse<{ transaction: string; cost: number; message: string }>> =>
  fetchApi('/organization-service/fragment/buy/prepare', { method: 'POST', body: JSON.stringify(data) })

export const prepareRedeemNft = (data: RedeemNftRequest): Promise<APIResponse<{ transaction: string; nft_mint: string; message: string }>> =>
  fetchApi('/organization-service/fragment/redeem/prepare', { method: 'POST', body: JSON.stringify(data) })

export const getLendingPool = (): Promise<APIResponse<LendingPool>> => fetchApi('/organization-service/lending/pool')
export const getLendingPoolStats = (): Promise<APIResponse<LendingPoolStats>> => fetchApi('/organization-service/lending/stats')

export const getUserLendingPosition = (wallet?: string): Promise<APIResponse<UserLendingPosition>> =>
  fetchApi(wallet ? `/organization-service/lending/position/${wallet}` : '/organization-service/lending/my-position')

export const getUserLoans = (wallet?: string): Promise<APIResponse<Loan[]>> =>
  fetchApi(wallet ? `/organization-service/lending/loans/${wallet}` : '/organization-service/lending/my-loans')

export const getLoanDetails = (wallet: string, loanId: number): Promise<APIResponse<Loan>> => fetchApi(`/organization-service/lending/loan/${wallet}/${loanId}`)

export const getLpBalance = (wallet?: string): Promise<APIResponse<{ balance: number; value_in_mcc: number }>> =>
  fetchApi(wallet ? `/organization-service/lending/lp-balance/${wallet}` : '/organization-service/lending/my-lp-balance')

export const calculateLendingInterest = (principal: number, annualRate: number, days: number): Promise<APIResponse<InterestCalculation>> =>
  fetchApi('/organization-service/lending/calculate-interest', { method: 'POST', body: JSON.stringify({ principal, annual_rate: annualRate, days }) })

export const estimateBorrowCost = (principal: number, collateralNftMint: string): Promise<APIResponse<BorrowCostEstimate>> =>
  fetchApi('/organization-service/lending/estimate-borrow-cost', { method: 'POST', body: JSON.stringify({ principal, collateral_nft_mint: collateralNftMint }) })

export const prepareLendingDeposit = (data: LendingDepositRequest): Promise<APIResponse<PreparedTransaction & { lp_amount: number }>> =>
  fetchApi('/organization-service/lending/deposit/prepare', { method: 'POST', body: JSON.stringify(data) })

export const prepareLendingWithdraw = (data: LendingWithdrawRequest): Promise<APIResponse<PreparedTransaction & { mcc_amount: number }>> =>
  fetchApi('/organization-service/lending/withdraw/prepare', { method: 'POST', body: JSON.stringify(data) })

export const prepareLendingBorrow = (data: LendingBorrowRequest): Promise<APIResponse<PreparedTransaction & { loan_id: number; interest_rate: number }>> =>
  fetchApi('/organization-service/lending/borrow/prepare', { method: 'POST', body: JSON.stringify(data) })

export const prepareLendingRepay = (data: LendingRepayRequest): Promise<APIResponse<PreparedTransaction & { remaining_principal: number; collateral_released: boolean }>> =>
  fetchApi('/organization-service/lending/repay/prepare', { method: 'POST', body: JSON.stringify(data) })

export const prepareLendingLiquidate = (data: LendingLiquidateRequest): Promise<APIResponse<PreparedTransaction & { collateral_nft_mint: string; liquidation_bonus: number }>> =>
  fetchApi('/organization-service/lending/liquidate/prepare', { method: 'POST', body: JSON.stringify(data) })
