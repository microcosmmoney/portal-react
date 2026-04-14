import { fetchApi } from '../core'
import type {
  APIResponse,
  MiningRequest,
  MiningRequestResponse,
  PaymentConfirmRequest,
  PaymentConfirmResponse,
  MiningRatioInfo,
  PublicMiningRequest,
  PublicPaymentConfirmRequest
} from '../../types/api'

export const checkMiningWallet = (walletAddress: string): Promise<APIResponse<{ status: string; message: string }>> => {
  return fetchApi('/blockchain-service/mining/wallet-check', {
    method: 'POST',
    body: JSON.stringify({ wallet_address: walletAddress })
  })
}

export const createMiningRequest = (data: MiningRequest): Promise<APIResponse<MiningRequestResponse>> => {
  return fetchApi('/blockchain-service/mining/request', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const confirmMiningPayment = (data: PaymentConfirmRequest): Promise<APIResponse<PaymentConfirmResponse>> => {
  return fetchApi('/blockchain-service/mining/confirm', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const buildMiningTransaction = (data: {
  wallet_address: string
  mcc_amount: number
  stablecoin_type: string
  request_id?: string
}): Promise<APIResponse<{
  instruction: {
    program_id: string
    accounts: Array<{ pubkey: string; is_signer: boolean; is_writable: boolean }>
    data: string
  }
  payment_amount: number
  user_level: number
}>> => {
  return fetchApi('/blockchain-service/mining/build-transaction', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const getMiningRatio = (): Promise<APIResponse<MiningRatioInfo>> => {
  return fetchApi('/blockchain-service/mining/ratio', {}, true)
}

export const getX402MiningHistory = (limit = 20, offset = 0): Promise<APIResponse<{
  total: number
  records: Array<{
    id: number
    tx_signature: string
    usdc_amount: number
    mcc_amount: number
    distribution: {
      user: number
      lp: number
      magistrate: number
      station_mcd: number
    }
    status: string
    created_at: string
  }>
}>> => {
  return fetchApi(`/blockchain-service/mining/history?limit=${limit}&offset=${offset}`)
}

export const getMiningRequestStatus = (requestId: string): Promise<APIResponse<{
  request_id: string;
  status: 'pending' | 'confirmed' | 'expired' | 'failed';
  mcc_amount: number;
  usdc_amount: number;
  created_at: string;
  confirmed_at?: string;
  tx_signature?: string;
}>> => {
  return fetchApi(`/blockchain-service/mining/request/${requestId}`)
}

export interface MiningPreflightResult {
  ready: boolean
  checks: Record<string, { ok: boolean; detail: string }>
  reason: string | null
}

export const getPublicMiningPreflight = async (): Promise<APIResponse<MiningPreflightResult>> => {
  const response = await fetch('/api/blockchain-service/mining/public/preflight')
  return response.json()
}

export const createPublicMiningRequest = async (data: PublicMiningRequest): Promise<APIResponse<MiningRequestResponse>> => {
  const response = await fetch('/api/blockchain-service/mining/public/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

export const buildPublicMcdTransaction = async (data: { wallet_address: string; usd_amount: number; stablecoin_type: string }): Promise<APIResponse<any>> => {
  const response = await fetch('/api/blockchain-service/mining/public/build-mcd-transaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

export const confirmPublicMiningPayment = async (data: PublicPaymentConfirmRequest): Promise<APIResponse<PaymentConfirmResponse>> => {
  const response = await fetch('/api/blockchain-service/mining/public/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}
