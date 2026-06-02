import { fetchApi } from '../core'
import type {
  APIResponse, Unit, Member, Auction, Bid, PlaceBidRequest, AuctionHistoryParams,
  MiningWeight, TechBonusDetail, StationKPI, UserRank,
  LevelProgress, UserLevelStatus, LevelSystemConfig,
  UserQueueStatus,
  ManagerIncomeSummary, StationIncomeSummary
} from '../../types/api'

export const getUnits = async (unitType?: string): Promise<APIResponse<Unit[]>> => {
  const query = unitType ? `?unit_type=${unitType}` : ''
  const response = await fetchApi(`/organization-service/units${query}`) as APIResponse<{units?: Unit[]}> & { units?: Unit[] }
  const units = response.data?.units || response.units
  if (units) return { success: response.success, data: units, message: response.message }
  return response as APIResponse<Unit[]>
}

export const getUnitDetails = (unitId: string): Promise<APIResponse<Unit>> => fetchApi(`/organization-service/units/${unitId}`)

export const createUnit = (unitData: { unit_name: string; unit_type: string; location?: string; parent_id?: string }): Promise<APIResponse<Unit>> =>
  fetchApi('/organization-service/units', { method: 'POST', body: JSON.stringify(unitData) })

export const updateUnit = (unitId: string, unitData: Partial<Unit>): Promise<APIResponse<Unit>> =>
  fetchApi(`/organization-service/units/${unitId}`, { method: 'PUT', body: JSON.stringify(unitData) })

export const deleteUnit = (unitId: string): Promise<APIResponse<void>> =>
  fetchApi(`/organization-service/units/${unitId}`, { method: 'DELETE' })

export interface TerritoryNameStatus { unit_id: string; current_name: string; can_modify: boolean; remaining_days: number; next_modify_date: string | null; last_modified_at: string | null; last_modified_by: string | null; manager_uid: string | null; is_team_managed: boolean }
export interface TerritoryNameUpdateResult { unit: Unit; next_modify_date: string; modify_reason: string }

export const getTerritoryNameStatus = (unitId: string): Promise<APIResponse<TerritoryNameStatus>> => fetchApi(`/organization-service/units/${unitId}/name/status`)

export const updateTerritoryName = (unitId: string, newName: string, force?: boolean): Promise<APIResponse<TerritoryNameUpdateResult>> =>
  fetchApi(`/organization-service/units/${unitId}/name${force ? '?force=true' : ''}`, { method: 'PUT', body: JSON.stringify({ name: newName }) })

export const getUnitMembers = (unitId: string): Promise<APIResponse<Member[]>> => fetchApi(`/organization-service/units/${unitId}/members`)

export const getActiveAuctions = async (): Promise<APIResponse<Auction[]>> => {
  const response = await fetchApi('/organization-service/auctions') as APIResponse<Auction[]> & { auctions?: Auction[] }
  if (response.auctions) return { success: response.success, data: response.auctions, message: response.message }
  return response
}

export const getAuctionDetails = (auctionId: number): Promise<APIResponse<Auction>> => fetchApi(`/organization-service/auction/${auctionId}`)

export const createAuction = (auctionData: { unit_id: string; auction_type: 'first' | 'second'; starting_price: number; duration_hours?: number; end_time?: string; reserve_price?: number; bid_increment?: number }): Promise<APIResponse<Auction>> =>
  fetchApi('/organization-service/auctions/create', { method: 'POST', body: JSON.stringify(auctionData) })

export const placeBid = (bidData: PlaceBidRequest): Promise<APIResponse<Bid>> =>
  fetchApi(`/organization-service/auction/${bidData.auction_id}/bid`, { method: 'POST', body: JSON.stringify({ amount: bidData.bid_amount }) })

export const endAuction = (auctionId: number): Promise<APIResponse<Auction>> =>
  fetchApi(`/organization-service/auctions/${auctionId}/end`, { method: 'POST' })

export const getAuctionHistory = (params?: AuctionHistoryParams): Promise<APIResponse<Auction[]>> => {
  const query = new URLSearchParams()
  if (params?.unit_id) query.append('unit_id', params.unit_id)
  if (params?.limit) query.append('limit', params.limit.toString())
  if (params?.offset) query.append('offset', params.offset.toString())
  const qs = query.toString()
  return fetchApi(`/organization-service/auctions/history${qs ? `?${qs}` : ''}`)
}

export const getMyBids = async (): Promise<APIResponse<Bid[]>> => {
  const response = await fetchApi('/organization-service/auction/my-bids') as APIResponse<Bid[]> & { bids?: Bid[] }
  if (response.bids) return { success: response.success, data: response.bids, message: response.message }
  return response
}

export const refundDeposit = (bidId: number): Promise<APIResponse<Bid>> =>
  fetchApi(`/organization-service/auctions/bid/${bidId}/refund`, { method: 'POST' })

export const getUserRank = (userId: string): Promise<APIResponse<{ rank: UserRank; level: number }>> => fetchApi(`/user-service/rank/${userId}`)
export const getUserLevelProgress = (userId: string): Promise<APIResponse<LevelProgress>> => fetchApi(`/user-service/rank/progress/${userId}`)
export const getMiningWeight = (userId: string): Promise<APIResponse<MiningWeight>> => fetchApi(`/user-service/rank/mining-weight/${userId}`)

export const getLevelSystemConfig = (): Promise<APIResponse<LevelSystemConfig>> => fetchApi('/organization-service/level/config')
export const getLevelProfile = (): Promise<APIResponse<LevelProgress>> => fetchApi('/organization-service/level/profile')
export const getLevelProfileByWallet = (wallet: string): Promise<APIResponse<LevelProgress>> => fetchApi(`/organization-service/level/profile/${wallet}`)
export const getUserLevelStatus = (uid: string): Promise<APIResponse<UserLevelStatus>> => fetchApi(`/organization-service/level/status/${uid}`)

export const getStationKPI = (unitId: string): Promise<APIResponse<StationKPI>> => fetchApi(`/organization-service/units/${unitId}/kpi`)
export const getTechBonus = (unitId: string): Promise<APIResponse<TechBonusDetail>> => fetchApi(`/organization-service/units/${unitId}/tech-bonus`)

export interface UnitsSummary { total_stations: number; total_members: number; total_vault_balance: number; total_vault_mcd?: number; avg_kpi_score: number; stations_by_type: Record<string, number>; user_stats?: { total_users: number; miners: number; commanders: number; pioneers: number; wardens: number; admirals: number; assigned_users: number; unassigned_users: number } }

export interface UnitDetailedStats {
  unit_id: string
  basic_info: { unit_id: string; unit_name: string; unit_type: string; manager_wallet?: string; parent_id?: string; created_at?: string; short_id?: string; full_path?: string }
  metrics: { member_count: number; max_capacity: number; vault_balance: number; vault_mcd: number; occupancy_rate: number }
  member_ranking: Array<{ rank: number; user_id: string; nickname: string; contribution: number; email?: string }>
}

export interface UnitIncomeChart { unit_id: string; range: string; labels: string[]; datasets: { income: number[]; cumulative: number[] } }

export const getUnitsSummary = (): Promise<APIResponse<UnitsSummary>> => fetchApi('/organization-service/units/summary')
export const getUnitDetailedStats = (unitId: string): Promise<APIResponse<UnitDetailedStats>> => fetchApi(`/organization-service/units/${unitId}/detailed-stats`)
export const getUnitIncomeChart = (unitId: string, range: string = '30d'): Promise<APIResponse<UnitIncomeChart>> => fetchApi(`/organization-service/units/${unitId}/income/chart?range=${range}`)

export interface UnitKPIHistory { unit_id: string; range: string; data: Array<{ date: string; member_progress: number; volume_progress: number; overall_score: number }> }
export const getUnitKPIHistory = (unitId: string, range: string = '30d'): Promise<APIResponse<UnitKPIHistory>> => fetchApi(`/organization-service/units/${unitId}/kpi/history?range=${range}`)

export interface UnitMemberRanking { unit_id: string; data: Array<{ rank: number; user_id: string; nickname: string; contribution: number; email?: string }> }
export const getUnitMemberRanking = (unitId: string, limit: number = 10): Promise<APIResponse<UnitMemberRanking>> => fetchApi(`/organization-service/units/${unitId}/member-ranking?limit=${limit}`)

export async function joinStation(territoryId?: string, autoAssign = true): Promise<APIResponse<{ territory_id: string; message: string }>> {
  return fetchApi('/organization-service/join-station', { method: 'POST', body: JSON.stringify({ territory_id: territoryId, auto_assign: autoAssign }) })
}

export async function leaveStation(reason?: string): Promise<APIResponse<{ user_type: string; old_territory_id: string; message: string }>> {
  return fetchApi('/organization-service/leave-station', { method: 'POST', body: JSON.stringify({ reason }) })
}

export async function joinStationQueue(preferredTerritoryId?: string): Promise<APIResponse<{ queue_position: number; message: string }>> {
  return fetchApi('/organization-service/station/queue', { method: 'POST', body: JSON.stringify({ preferred_territory_id: preferredTerritoryId }) })
}

export async function getQueueStatus(): Promise<UserQueueStatus> { return fetchApi('/organization-service/station/queue/status') }
export async function cancelQueue(): Promise<APIResponse<{ message: string }>> { return fetchApi('/organization-service/station/queue', { method: 'DELETE' }) }

export async function getStationIncome(stationId: string, startDate?: string, endDate?: string): Promise<StationIncomeSummary> {
  const p = new URLSearchParams()
  if (startDate) p.append('start_date', startDate)
  if (endDate) p.append('end_date', endDate)
  const qs = p.toString()
  return fetchApi(`/organization-service/station/${stationId}/income${qs ? `?${qs}` : ''}`)
}

export async function getManagerIncome(startDate?: string, endDate?: string): Promise<ManagerIncomeSummary> {
  const p = new URLSearchParams()
  if (startDate) p.append('start_date', startDate)
  if (endDate) p.append('end_date', endDate)
  const qs = p.toString()
  return fetchApi(`/organization-service/manager/income${qs ? `?${qs}` : ''}`)
}

