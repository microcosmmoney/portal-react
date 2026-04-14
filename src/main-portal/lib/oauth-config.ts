// AI-generated · AI-managed · AI-maintained
export const OAUTH_CONFIG = {
  authorizationEndpoint: process.env.NEXT_PUBLIC_OAUTH_AUTH_ENDPOINT || 'https://microcosm.money/login',
  tokenEndpoint: process.env.NEXT_PUBLIC_OAUTH_TOKEN_ENDPOINT || 'https://microcosm.money/api/oauth/token',
  firebaseTokenEndpoint: process.env.NEXT_PUBLIC_OAUTH_FIREBASE_ENDPOINT || 'https://microcosm.money/api/oauth/firebase-token',

  clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID || 'doublehelix',
  redirectUri: typeof window !== 'undefined'
    ? `${window.location.origin}/auth/callback`
    : process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI || 'https://doublehelix.money/auth/callback',

  scopes: ['openid', 'profile', 'email', 'trading'],
}

export function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function saveState(state: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('oauth_state', state)
  }
}

export function verifyState(state: string): boolean {
  if (typeof window === 'undefined') return false
  const savedState = sessionStorage.getItem('oauth_state')
  sessionStorage.removeItem('oauth_state')
  return savedState === state
}

export function buildAuthorizationUrl(): string {
  const state = generateState()
  saveState(state)

  const params = new URLSearchParams({
    oauth: 'true',
    response_type: 'code',
    client_id: OAUTH_CONFIG.clientId,
    redirect_uri: OAUTH_CONFIG.redirectUri,
    scope: OAUTH_CONFIG.scopes.join(' '),
    state: state,
  })

  return `${OAUTH_CONFIG.authorizationEndpoint}?${params.toString()}`
}
