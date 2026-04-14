export { fetchApi, getCurrentUserToken } from './core'

import { fetchApi } from './core'

export const apiService = {
  get: (endpoint: string) => fetchApi(endpoint, { method: 'GET' }),
  post: (endpoint: string, data?: unknown) => fetchApi(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined
  }),
  put: (endpoint: string, data?: unknown) => fetchApi(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined
  }),
  delete: (endpoint: string) => fetchApi(endpoint, { method: 'DELETE' }),
}

export * from './services'
export {
  getMCCBalance as getOnchainMCCBalance,
  getPoolStatus,
  type PoolStatus,
} from './blockchain'
