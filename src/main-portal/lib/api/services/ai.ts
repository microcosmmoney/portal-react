import { fetchApi, getCurrentUserToken } from '../core'
import { guardAuthResponse } from '../../auth-service'
import type {
  APIResponse,
  AIProductsResponse, AIProductDetailResponse, AIRequestsResponse, AIRequestDetailResponse,
  SubmitAIRequestResponse, AIChatResponse, StrategyConfig, BinanceOrderResponse, BinanceCancelResponse
} from '../../types/api'

export async function getAIProducts(params?: {
  status?: 'active' | 'all'
  risk_level?: 'low' | 'medium' | 'high' | 'all'
  sort?: 'risk' | 'return' | 'popularity'
}): Promise<AIProductsResponse> {
  const queryParams = new URLSearchParams()
  if (params?.status) queryParams.append('status', params.status)
  if (params?.risk_level) queryParams.append('risk_level', params.risk_level)
  if (params?.sort) queryParams.append('sort', params.sort)

  const queryString = queryParams.toString()
  const url = `/api/ai-products${queryString ? `?${queryString}` : ''}`

  const response = await fetch(url)
  return response.json()
}

export async function getAIProductDetail(productId: string): Promise<AIProductDetailResponse> {
  const response = await fetch(`/api/ai-products/${productId}`)
  return response.json()
}

export async function submitAIRequest(data: {
  ai_product_id: string
  exchange: string
  amount: number
}): Promise<SubmitAIRequestResponse> {
  return fetchApi('/user/ai-requests', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function getUserAIRequests(status?: string): Promise<AIRequestsResponse> {
  const token = await getCurrentUserToken()
  const url = status
    ? `/api/user/ai-requests?status=${status}`
    : '/api/user/ai-requests'

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  guardAuthResponse(response)
  return response.json()
}

export async function getAIRequestDetail(requestId: string): Promise<AIRequestDetailResponse> {
  const token = await getCurrentUserToken()
  const response = await fetch(`/api/user/ai-requests/${requestId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  guardAuthResponse(response)
  return response.json()
}

export async function cancelAIRequest(requestId: string): Promise<APIResponse<void>> {
  const token = await getCurrentUserToken()
  const response = await fetch(`/api/user/ai-requests/${requestId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  guardAuthResponse(response)
  return response.json()
}

export async function stopAIStrategy(requestId: string, reason?: string): Promise<APIResponse<void>> {
  const token = await getCurrentUserToken()
  const response = await fetch(`/api/user/ai-requests/${requestId}/stop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ reason })
  })
  guardAuthResponse(response)
  return response.json()
}

export async function getPendingAIRequests(): Promise<AIRequestsResponse> {
  return fetchApi('/trader/ai-requests/pending')
}

export async function acceptAIRequest(requestId: string): Promise<APIResponse<void>> {
  return fetchApi(`/trader/ai-requests/${requestId}/accept`, { method: 'POST' })
}

export async function configureAIStrategy(requestId: string, config: StrategyConfig): Promise<APIResponse<void>> {
  return fetchApi(`/trader/ai-requests/${requestId}/configure`, {
    method: 'POST',
    body: JSON.stringify(config)
  })
}

export async function startAIStrategy(requestId: string): Promise<APIResponse<void>> {
  return fetchApi(`/trader/ai-requests/${requestId}/start`, { method: 'POST' })
}

export async function rejectAIRequest(requestId: string, reason: string): Promise<APIResponse<void>> {
  return fetchApi(`/trader/ai-requests/${requestId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  })
}

export async function chatWithAIProduct(data: {
  product_id: string
  product_info: Record<string, unknown>
  message: string
  history?: Array<{ role: string; content: string }>
}): Promise<AIChatResponse> {
  const response = await fetch('/api/ai-product-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json()
}

export async function getMyAIRequests(status?: string): Promise<AIRequestsResponse> {
  const url = status
    ? `/trader/ai-requests/my-requests?status=${status}`
    : '/trader/ai-requests/my-requests'
  return fetchApi(url)
}

export interface AISuggestion {
  suggestion_id: string
  strategy_id: string
  symbol: string
  uid: string
  status: 'pending' | 'approved' | 'rejected' | 'modified' | 'executed' | 'expired'
  suggestions: Array<{
    param_name: string
    current_value: number
    suggested_value: number
    change_pct: number
    reason: string
  }>
  market_analysis: {
    market_state: string
    trend_direction: string
    atr_pct: number
    adx: number
    plus_di: number
    minus_di: number
    volatility: number
    snapshot_time: string
    analysis_reason: string
  }
  expected_outcomes: {
    risk_change: string
    profit_impact?: string
    confidence: number
  }
  trader_feedback?: string
  trader_modified_values?: Record<string, number>
  created_at: string
  reviewed_at?: string
  executed_at?: string
  expires_at: string
  reviewed_by?: string
  strategy_name?: string
  current_params?: Record<string, unknown>
}

export interface AISuggestionsResponse {
  success: boolean
  count: number
  suggestions: AISuggestion[]
  error?: string
}

export interface AISuggestionDetailResponse {
  success: boolean
  suggestion: AISuggestion
  error?: string
}

export interface AISuggestionStatsResponse {
  success: boolean
  period: string
  stats: Record<string, { count: number; strategies: number; symbols: number }>
  error?: string
}

export async function getAISuggestions(params?: {
  trader_uid?: string
  status?: string
  limit?: number
}): Promise<AISuggestionsResponse> {
  const queryParams = new URLSearchParams()
  if (params?.trader_uid) queryParams.append('trader_uid', params.trader_uid)
  if (params?.status) queryParams.append('status', params.status)
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const queryString = queryParams.toString()
  return fetchApi(`/data-service/indicators/suggestions${queryString ? `?${queryString}` : ''}`)
}

export async function getAISuggestionDetail(suggestionId: string): Promise<AISuggestionDetailResponse> {
  return fetchApi(`/data-service/indicators/suggestions/${suggestionId}`)
}

export async function approveAISuggestion(
  suggestionId: string,
  reviewer: string,
  modifiedValues?: Record<string, number>
): Promise<APIResponse<void>> {
  return fetchApi(`/data-service/indicators/suggestions/${suggestionId}/approve`, {
    method: 'POST',
    body: JSON.stringify({ reviewer, modified_values: modifiedValues })
  })
}

export async function rejectAISuggestion(
  suggestionId: string,
  reviewer: string,
  feedback: string
): Promise<APIResponse<void>> {
  return fetchApi(`/data-service/indicators/suggestions/${suggestionId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reviewer, feedback })
  })
}

export async function generateAISuggestions(timeframe?: string): Promise<APIResponse<{
  total: number
  generated: number
  skipped: number
  errors: number
}>> {
  return fetchApi('/data-service/indicators/suggestions/generate', {
    method: 'POST',
    body: JSON.stringify({ timeframe: timeframe || '4h' })
  })
}

export async function getAISuggestionStats(trader_uid?: string): Promise<AISuggestionStatsResponse> {
  const params = new URLSearchParams()
  if (trader_uid) params.append('trader_uid', trader_uid)
  const queryString = params.toString()
  return fetchApi(`/data-service/indicators/suggestions/stats${queryString ? `?${queryString}` : ''}`)
}

export async function getMarketState(symbol: string, timeframe?: string, refresh?: boolean): Promise<APIResponse<{
  symbol: string
  timeframe: string
  market_state: string
  trend_direction: string
  indicators: {
    atr: number
    atr_pct: number
    adx: number
    plus_di: number
    minus_di: number
    volatility: number
  }
  suggestion: {
    risk_level: string
    adjustments: Record<string, { direction: string; range: string }>
    reason: string
  }
}>> {
  const params = new URLSearchParams()
  if (timeframe) params.append('timeframe', timeframe)
  if (refresh) params.append('refresh', 'true')
  const queryString = params.toString()
  return fetchApi(`/data-service/indicators/market-state/${symbol}${queryString ? `?${queryString}` : ''}`)
}

export async function cancelBinanceOrder(symbol: string, clientOrderId: string): Promise<BinanceCancelResponse> {
  const token = await getCurrentUserToken()
  const response = await fetch('/api/trading/binance/cancel-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ symbol, clientOrderId })
  })
  guardAuthResponse(response)
  return response.json()
}

export async function placeBinanceOrder(data: {
  symbol: string
  side: string
  positionSide: string
  quantity: number
  orderType?: string
  price?: number
  clientOrderId?: string
}): Promise<BinanceOrderResponse> {
  const token = await getCurrentUserToken()
  const response = await fetch('/api/trading/binance/place-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  guardAuthResponse(response)
  return response.json()
}

export async function modifyBinanceOrder(symbol: string, clientOrderId: string, newPrice: number): Promise<BinanceOrderResponse> {
  const token = await getCurrentUserToken()
  const response = await fetch('/api/trading/binance/modify-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ symbol, clientOrderId, newPrice })
  })
  guardAuthResponse(response)
  return response.json()
}
