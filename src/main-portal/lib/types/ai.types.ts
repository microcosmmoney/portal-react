export type RiskLevel = 'low' | 'medium' | 'high';

export type ProductStatus = 'active' | 'inactive';

export interface AIProduct {
  id: string;
  name: string;
  description: string;
  risk_level: number | RiskLevel;
  expected_return?: number;
  expected_return_min?: number;
  expected_return_max?: number;
  min_amount?: number;
  max_amount?: number;
  status: ProductStatus;
  trader_id?: string;
  created_at: string;
  updated_at?: string;
  total_requests?: number;
  active_requests?: number;
  active_users?: number;
  avg_return?: number;
}

export type AIRequestStatus = 'pending' | 'accepted' | 'assigned' | 'configured' | 'running' | 'stopped' | 'completed' | 'cancelled' | 'failed' | 'rejected';

export interface AIRequest {
  id?: string;
  request_id: string;
  user_id: string;
  ai_product_id: string;
  trader_id?: string;
  strategy_id?: string;
  amount: number;
  exchange: string;
  status: AIRequestStatus;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  product?: AIProduct;
  current_profit?: number;
  total_trades?: number;
}

export interface AIProductDetail {
  id: string;
  name: string;
  name_en?: string;
  description: string;
  personality?: string;
  icon?: string;
  risk_level: number;
  expected_return_min: string;
  expected_return_max: string;
  total_managed_fund: string;
  active_users: number;
  win_rate: string;
  avg_holding_hours: string;
  daily_trades_min: number;
  daily_trades_max: number;
  sharpe_ratio: string;
  max_drawdown: string;
  last_month_return?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
}

export interface AIProductDetailResponse {
  success: boolean;
  product?: AIProductDetail;
  error?: string;
}

export interface AIRequestDetail {
  id: string;
  request_id?: string;
  user_id: string;
  ai_product_id: string;
  trader_id?: string;
  amount: number;
  exchange: string;
  status: AIRequestStatus;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  ai_name?: string;
  ai_icon?: string;
  current_profit?: number;
  total_trades?: number;
}

export interface AIRequestDetailResponse {
  success: boolean;
  request?: AIRequestDetail;
  error?: string;
}

export interface SubmitAIRequestResponse {
  success: boolean;
  request?: {
    id: string;
    request_id?: string;
  };
  error?: string;
}

export interface AIProductsResponse {
  success: boolean;
  products: AIProduct[];
  error?: string;
}

export interface AIRequestsResponse {
  success: boolean;
  requests: AIRequest[];
}

export interface AIChatResponse {
  success: boolean;
  response: string;
  suggestions?: string[];
}
