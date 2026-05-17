import { fetchApi } from '../core'
import type {
  APIResponse,
  MCCBalance, MCCLockPeriod, MCCMinting, MCCMintingStats,
  MCCWithdrawalRequest, MCCWithdrawal, MCCHistoryRecord,
  PDAWithdrawResponse, PDABalance,
  RechargeRecord, VaultRecord, DistributionPlan,
  MCDBalance, MCDTransaction, MCDUserDailyReward,
  MCDSpendRequest, MCDSpendResponse, MCDHistoryParams
} from '../../types/api'

export const getMCCBalance = (userId: string): Promise<APIResponse<MCCBalance>> => {
  return fetchApi(`/user-service/mcc/balance/${userId}`)
}

export const getMCCLockPeriods = (userId: string): Promise<APIResponse<MCCLockPeriod[]>> => {
  return fetchApi(`/user-service/mcc/lock-periods/${userId}`)
}

export const getMCCMintingHistory = (userId: string, limit = 50): Promise<APIResponse<MCCMinting[]>> => {
  return fetchApi(`/user-service/mcc/minting-history/${userId}?limit=${limit}`)
}

export const getMCCMintingStats = (): Promise<APIResponse<MCCMintingStats>> => {
  return fetchApi('/user-service/mcc/minting-stats')
}

export const withdrawMCC = (data: MCCWithdrawalRequest): Promise<APIResponse<MCCWithdrawal>> => {
  return fetchApi('/user-service/mcc/withdraw', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const getMCCWithdrawalHistory = (userId: string, limit = 50): Promise<APIResponse<MCCWithdrawal[]>> => {
  return fetchApi(`/user-service/mcc/withdrawals/${userId}?limit=${limit}`)
}

export const getMCCHistory = (userId: string, params?: { limit?: number; type?: string }): Promise<APIResponse<MCCHistoryRecord[]>> => {
  const queryParams = new URLSearchParams()
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.type) queryParams.append('type', params.type)
  const queryString = queryParams.toString()
  return fetchApi(`/user-service/mcc/history/${userId}${queryString ? `?${queryString}` : ''}`)
}

export const withdrawFromPDA = (data: { uid?: string; user_id?: number; amount: number; destination: string }): Promise<APIResponse<PDAWithdrawResponse>> => {
  return fetchApi('/blockchain-service/blockchain/mcc/pda-withdraw', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const getPDABalance = (uid: string): Promise<APIResponse<PDABalance>> => {
  return fetchApi(`/blockchain-service/blockchain/mcc/pda-balance/${uid}`)
}

export const getPDAAddress = (uid: string): Promise<APIResponse<{ uid: string; pda_address: string; token_account: string; bump: number }>> => {
  return fetchApi(`/blockchain-service/blockchain/mcc/pda-address/${uid}`)
}

export const getRechargeHistory = (userId: string, limit = 50): Promise<APIResponse<RechargeRecord[]>> => {
  return fetchApi(`/user-service/mcc/recharges/${userId}?limit=${limit}`)
}

export const getDistributionPlans = (): Promise<APIResponse<DistributionPlan[]>> => {
  return Promise.resolve({
    success: true,
    data: [{
      plan_id: 0,
      plan_type: 'plan_1',
      name: '\u6309\u52b3\u5206\u914d\uff08\u81ea\u52a8\uff09- \u5df2\u5e9f\u5f03',
      manager_share: 0,
      vault_share: 0,
      member_share: 100,
      system_reserve: 0,
      charity_share: 0
    }]
  })
}

export const setUnitDistributionPlan = (_unitId: string, _planId: number): Promise<APIResponse<void>> => {
  return Promise.resolve({
    success: false,
    error: '\u5206\u914d\u65b9\u6848\u8bbe\u7f6e\u529f\u80fd\u5df2\u5e9f\u5f03\u3002\u65b0\u4e1a\u52a1\u903b\u8f91\u4e0b\uff0c\u91d1\u5e93 MCD \u6bcf\u65e5\u81ea\u52a8\u6309\u52b3\u5206\u914d 1%\uff0c\u65e0\u9700\u624b\u52a8\u8bbe\u7f6e\u65b9\u6848\u3002'
  })
}

export const getVaultBalance = (unitId: string): Promise<APIResponse<{ balance: number }>> => {
  return fetchApi(`/organization-service/units/${unitId}/vault/balance`)
}

export const getVaultRecords = (unitId: string, limit = 50): Promise<APIResponse<VaultRecord[]>> => {
  return fetchApi(`/organization-service/units/${unitId}/vault/records?limit=${limit}`)
}

export const executeVaultDistribution = (unitId: string, amount: number): Promise<APIResponse<VaultRecord>> => {
  return fetchApi(`/organization-service/units/${unitId}/vault/distribute`, {
    method: 'POST',
    body: JSON.stringify({ amount })
  })
}

export const depositToVault = (unitId: string, amount: number): Promise<APIResponse<VaultRecord>> => {
  return fetchApi(`/organization-service/units/${unitId}/vault/deposit`, {
    method: 'POST',
    body: JSON.stringify({ amount })
  })
}

export async function getMCDBalance(_uid?: string): Promise<APIResponse<MCDBalance>> {
  return fetchApi('/mcd/balance')
}

export async function getMCDTransactions(
  _uid?: string,
  params?: MCDHistoryParams
): Promise<APIResponse<MCDTransaction[]>> {
  const queryParams = new URLSearchParams()
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.offset) queryParams.append('offset', params.offset.toString())
  if (params?.start_date) queryParams.append('start_date', params.start_date)
  if (params?.end_date) queryParams.append('end_date', params.end_date)
  const queryString = queryParams.toString()
  return fetchApi(`/mcd/transactions${queryString ? `?${queryString}` : ''}`)
}

export async function getMCDDailyRewards(
  _uid?: string,
  params?: MCDHistoryParams
): Promise<APIResponse<MCDUserDailyReward[]>> {
  const queryParams = new URLSearchParams()
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.offset) queryParams.append('offset', params.offset.toString())
  if (params?.start_date) queryParams.append('start_date', params.start_date)
  if (params?.end_date) queryParams.append('end_date', params.end_date)
  const queryString = queryParams.toString()
  return fetchApi(`/mcd/rewards${queryString ? `?${queryString}` : ''}`)
}

export async function spendMCD(data: MCDSpendRequest): Promise<MCDSpendResponse> {
  return fetchApi('/mcd/consume', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
