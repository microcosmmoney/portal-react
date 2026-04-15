// AI-generated · AI-managed · AI-maintained
// Native Auth — Argon2id + Session Token (Firebase \u5df2\u4e8e 2026-03-16 \u6e05\u7406)

const SESSION_TOKEN_KEY = 'mc_session_token';
const NATIVE_UID_KEY = 'mc_native_uid';
export const AUTH_FLAG_KEY = 'mc_auth_flag';

// ── Session Storage ──

export const getSessionToken = (): string | null => {
  try { return sessionStorage.getItem(SESSION_TOKEN_KEY); } catch { return null; }
};

export const setSessionToken = (token: string) => {
  try { sessionStorage.setItem(SESSION_TOKEN_KEY, token); } catch {}
};

const clearSessionToken = () => {
  try { sessionStorage.removeItem(SESSION_TOKEN_KEY); } catch {}
  try { sessionStorage.removeItem(NATIVE_UID_KEY); } catch {}
};

export const getNativeUid = (): string | null => {
  try { return sessionStorage.getItem(NATIVE_UID_KEY); } catch { return null; }
};

const setNativeUid = (uid: string) => {
  try { sessionStorage.setItem(NATIVE_UID_KEY, uid); } catch {}
};

// ── Auth Flag ──

export const setAuthFlag = () => {
  try { sessionStorage.setItem(AUTH_FLAG_KEY, '1'); } catch {}
};

export const clearAuthFlag = () => {
  try { sessionStorage.removeItem(AUTH_FLAG_KEY); } catch {}
  try { localStorage.removeItem(AUTH_FLAG_KEY); } catch {}
};

export const isAuthenticatedSync = (): boolean => {
  return !!getSessionToken();
};

// ── Token ──

export const clearTokenCache = () => {
  clearSessionToken();
  try { sessionStorage.removeItem('mc_user_info'); } catch {}
};

export const getCurrentUserToken = async (): Promise<string | null> => {
  return getSessionToken();
};

// ── \u767b\u5f55/\u6ce8\u518c/\u767b\u51fa ──

export interface LoginResult {
  uid?: string;
  email?: string;
  emailVerified?: boolean;
  verificationRequired?: boolean;
  loginToken?: string;
  verificationMethods?: string[];
  emailHint?: string;
}

export const signInWithEmail = async (email: string, password: string): Promise<LoginResult> => {
  const response = await fetch('/api/auth/native/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!data.success) {
    if (data.error === 'password_not_set') {
      throw new Error('\u7cfb\u7edf\u5df2\u5347\u7ea7，\u8bf7\u901a\u8fc7\u90ae\u4ef6\u91cd\u7f6e\u5bc6\u7801\u540e\u767b\u5f55。');
    }
    throw new Error(data.error || '\u767b\u5f55\u5931\u8d25');
  }

  // Multi-step verification required
  if (data.data.verification_required) {
    return {
      verificationRequired: true,
      loginToken: data.data.login_token,
      verificationMethods: data.data.verification_methods,
      emailHint: data.data.email_hint,
    };
  }

  setSessionToken(data.data.session_token);
  setNativeUid(data.data.uid);
  return { uid: data.data.uid, email, emailVerified: data.data.email_verified };
};

export const verifyLogin = async (
  loginToken: string,
  totpCode?: string,
  emailCode?: string,
  backupCode?: string,
): Promise<LoginResult> => {
  const response = await fetch('/api/auth/native/verify-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      login_token: loginToken,
      totp_code: totpCode || undefined,
      email_code: emailCode || undefined,
      backup_code: backupCode || undefined,
    }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || '\u9a8c\u8bc1\u5931\u8d25');
  }

  // Still need more verification
  if (data.data.verification_required) {
    return {
      verificationRequired: true,
      loginToken,
      verificationMethods: [],
    };
  }

  setSessionToken(data.data.session_token);
  setNativeUid(data.data.uid);
  return { uid: data.data.uid, emailVerified: data.data.email_verified };
};

export const resendLoginCode = async (loginToken: string): Promise<void> => {
  const response = await fetch('/api/auth/native/resend-login-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login_token: loginToken }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || '\u53d1\u9001\u5931\u8d25');
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  const response = await fetch('/api/auth/native/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || '\u6ce8\u518c\u5931\u8d25');
  }
  setSessionToken(data.data.session_token);
  setNativeUid(data.data.uid);
  return { uid: data.data.uid, email, emailVerified: false };
};

export const logOut = async () => {
  try {
    const token = getSessionToken();
    if (token) {
      fetch('/api/auth/native/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      }).catch(() => {});
    }
    clearSessionToken();
    clearAuthFlag();
  } catch (error) {
    console.error('Logout error:', error);
  }
  window.location.href = `${getLocalePrefix()}/`;
};

// ── Locale \u611f\u77e5\u8df3\u8f6c ──

const getLocalePrefix = (): string => {
  if (typeof window === 'undefined') return '';
  const match = window.location.pathname.match(/^\/(en|zh|ja|ko)(\/|$)/);
  return match ? `/${match[1]}` : '';
};

// ── Auth \u72b6\u6001 ──

export interface NativeUser {
  uid: string;
}

export const onAuthChange = (callback: (user: NativeUser | null) => void) => {
  const token = getSessionToken();
  const uid = getNativeUid() || 'native-user';
  callback(token ? { uid } : null);
  return () => {};
};

// ── 401/403 \u5f3a\u5236\u767b\u51fa ──

let isForceLoggingOut = false;

export const handleAuthFailure = async (status: number) => {
  if (status !== 401 && status !== 403) return;
  if (isForceLoggingOut) return;
  isForceLoggingOut = true;
  console.warn(`[Auth] \u670d\u52a1\u7aef\u8fd4\u56de ${status}，\u5f3a\u5236\u767b\u51fa`);
  clearSessionToken();
  clearAuthFlag();
  window.location.href = `${getLocalePrefix()}/login`;
};

export const guardAuthResponse = (response: Response): Response => {
  if (response.status === 401 || response.status === 403) {
    handleAuthFailure(response.status);
  }
  return response;
};

// ── \u90ae\u4ef6\u9a8c\u8bc1/\u5bc6\u7801\u91cd\u7f6e ──

export const checkEmailVerified = async (): Promise<boolean> => {
  const token = getSessionToken();
  if (!token) return false;
  try {
    const resp = await fetch('/api/auth/native/session', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await resp.json();
    return data.success ? data.data.email_verified : false;
  } catch { return false; }
};

export const getCurrentUser = async () => {
  const token = getSessionToken();
  if (!token) return null;
  try {
    const resp = await fetch('/api/auth/native/session', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await resp.json();
    if (!data.success) return null;
    return {
      uid: data.data.uid,
      email: data.data.email,
      displayName: null,
      emailVerified: data.data.email_verified,
    };
  } catch { return null; }
};

export const sendPasswordResetEmail = async (email?: string): Promise<void> => {
  if (!email) throw new Error('\u8bf7\u63d0\u4f9b\u90ae\u7bb1\u5730\u5740');
  const response = await fetch('/api/auth/native/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || '\u53d1\u9001\u5931\u8d25');
  }
};

export const resendVerificationEmail = async (): Promise<void> => {
  const token = getSessionToken();
  if (!token) throw new Error('Not authenticated');
  const response = await fetch('/api/auth/native/resend-verification', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to send verification email');
};

// ── Email Change ──

export const requestEmailChange = async (newEmail: string, password: string): Promise<void> => {
  const token = getSessionToken();
  if (!token) throw new Error('Not authenticated');
  const response = await fetch('/api/auth/native/change-email', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ new_email: newEmail, password }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to send verification code');
};

export const verifyEmailChange = async (newEmail: string, code: string) => {
  const token = getSessionToken();
  if (!token) throw new Error('Not authenticated');
  const response = await fetch('/api/auth/native/verify-change-email', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ new_email: newEmail, code }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Verification failed');
  return data.data as { email: string; email_verified: boolean };
};

// ── 2FA Management ──

export const setup2FA = async () => {
  const token = getSessionToken();
  if (!token) throw new Error('Not authenticated');
  const response = await fetch('/api/auth/native/2fa/setup', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to setup 2FA');
  return data.data as { secret: string; qr_code: string; uri: string };
};

export const verifyAndEnable2FA = async (code: string) => {
  const token = getSessionToken();
  if (!token) throw new Error('Not authenticated');
  const response = await fetch('/api/auth/native/2fa/verify-setup', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Invalid code');
  return data.data as { backup_codes: string[]; message: string };
};

export const disable2FA = async (password: string) => {
  const token = getSessionToken();
  if (!token) throw new Error('Not authenticated');
  const response = await fetch('/api/auth/native/2fa/disable', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to disable 2FA');
};

export const get2FAStatus = async () => {
  const token = getSessionToken();
  if (!token) throw new Error('Not authenticated');
  const response = await fetch('/api/auth/native/2fa/status', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to get 2FA status');
  return data.data as { totp_enabled: boolean; has_backup_codes: boolean; setup_at: string | null };
};

// \u517c\u5bb9\u65e7\u4ee3\u7801\u5f15\u7528
export const isNativeAuth = () => true;
export const sendEmailVerification = async (): Promise<void> => {};
export const getEmailVerificationStatus = (): boolean => false;
