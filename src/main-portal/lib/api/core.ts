// AI-generated · AI-managed · AI-maintained
import { getCurrentUserToken, handleAuthFailure } from '../auth-service'

const BASE_URL = '/api'

export const fetchApi = async (endpoint: string, options: RequestInit = {}, isPublic = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (options.headers) {
    const originalHeaders = options.headers as Record<string, string>
    Object.assign(headers, originalHeaders)
  }

  if (!isPublic) {
    const authToken = await getCurrentUserToken()
    if (!authToken) {
      throw new Error('\u7528\u6237\u672a\u767b\u5f55\uff0c\u65e0\u6cd5\u53d1\u8d77\u8bf7\u6c42\u3002')
    }
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const config: RequestInit = {
    ...options,
    headers
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  const safeJson = async (res: Response) => {
    const contentType = res.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return res.json()
    }
    const text = await res.text()
    return { error: text || `\u670d\u52a1\u5668\u8fd4\u56de\u4e86\u975e JSON \u9519\u8bef (\u72b6\u6001: ${res.status})` }
  }

  if (!response.ok) {
    // 401/403: \u8ba4\u8bc1\u5931\u6548\uff0c\u5f3a\u5236\u767b\u51fa\uff08\u4e0d\u518d\u7ee7\u7eed\u5904\u7406\u4e1a\u52a1\u9519\u8bef\uff09
    if (response.status === 401 || response.status === 403) {
      handleAuthFailure(response.status)
      throw new Error('\u8ba4\u8bc1\u5df2\u5931\u6548\uff0c\u6b63\u5728\u8df3\u8f6c\u767b\u5f55\u9875...')
    }
    const errorData = await safeJson(response)
    throw new Error(errorData.error || `\u670d\u52a1\u5668\u8fd4\u56de\u4e86\u4e00\u4e2a\u9519\u8bef (\u72b6\u6001: ${response.status})`)
  }

  return safeJson(response)
}

export { getCurrentUserToken }
