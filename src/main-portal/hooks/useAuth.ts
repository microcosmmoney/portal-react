// AI-generated · AI-managed · AI-maintained
// Native Auth Hook \u2014 \u540c\u6b65\u521d\u59cb\u5316 + \u7f13\u5b58\uff0c\u5237\u65b0\u65e0\u95ea\u70c1
import { useState, useEffect, useCallback } from 'react';
import {
  setAuthFlag, clearAuthFlag, getSessionToken, getNativeUid,
  type NativeUser,
} from '../lib/auth-service';
import { fetchApi } from '../lib/api/core';
const getCurrentUserProfile = () => fetchApi('/users/profile');

export type UserRole = 'agent' | 'user';

export interface WalletEntry {
  wallet_address: string;
  is_primary?: boolean;
}

export interface UserInfo {
  uid: string;
  email: string | null;
  role: UserRole;
  apiKeysConfigured: boolean;
  display_name?: string | null;
  avatar_url?: string | null;
  wallet_address?: string | null;
  wallets?: WalletEntry[];
  unit_level?: number | null;
  source_project_id?: string | null;
}

const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  'agent': ['agent', 'user'],
  'user': ['user']
};

// ── \u7f13\u5b58\u5c42\uff1asessionStorage \u540c\u6b65\u8bfb\u5199 ──

const USER_INFO_CACHE_KEY = 'mc_user_info';

function getCachedUserInfo(): UserInfo | null {
  try {
    const raw = sessionStorage.getItem(USER_INFO_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserInfo;
  } catch { return null; }
}

function setCachedUserInfo(info: UserInfo) {
  try { sessionStorage.setItem(USER_INFO_CACHE_KEY, JSON.stringify(info)); } catch {}
}

function clearCachedUserInfo() {
  try { sessionStorage.removeItem(USER_INFO_CACHE_KEY); } catch {}
}

// ── \u540c\u6b65\u521d\u59cb\u5316\uff1a\u7b2c\u4e00\u5e27\u5c31\u786e\u5b9a\u7528\u6237\u72b6\u6001 ──

function getInitialState() {
  if (typeof window === 'undefined') {
    return { user: null as NativeUser | null, userInfo: null as UserInfo | null, loading: true };
  }
  const token = getSessionToken();
  if (!token) {
    return { user: null, userInfo: null, loading: false };
  }
  const user: NativeUser = { uid: getNativeUid() || 'native-user' };
  const cached = getCachedUserInfo();
  // \u6709 token + \u6709\u7f13\u5b58 → loading=false\uff08\u540e\u53f0\u9759\u9ed8\u5237\u65b0\uff09
  // \u6709 token + \u65e0\u7f13\u5b58 → loading=true\uff08\u9996\u6b21\u767b\u5f55\uff0c\u9700\u7b49 API\uff09
  return { user, userInfo: cached, loading: !cached };
}

// ── Hook ──

export const useAuth = () => {
  const [initial] = useState(getInitialState);
  const [user, setUser] = useState<NativeUser | null>(initial.user);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(initial.userInfo);
  const [loading, setLoading] = useState(initial.loading);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = useCallback(async (nativeUser: NativeUser) => {
    try {
      const data = await getCurrentUserProfile();

      if (data.success && data.user) {
        const info: UserInfo = {
          uid: data.user.uid,
          email: data.user.email,
          role: data.user.role as UserRole,
          apiKeysConfigured: data.user.api_keys_configured,
          display_name: data.user.display_name,
          avatar_url: data.user.avatar_url,
          wallet_address: data.user.wallet_address || data.wallet_address,
          wallets: data.user.wallets || [],
          unit_level: data.user.unit_level,
          source_project_id: data.user.source_project_id,
        };
        setUserInfo(info);
        setCachedUserInfo(info);
      } else {
        throw new Error('\u7528\u6237\u4fe1\u606f\u683c\u5f0f\u9519\u8bef');
      }
    } catch (err) {
      console.error('\u83b7\u53d6\u7528\u6237\u4fe1\u606f\u5931\u8d25:', err);
      setError(err instanceof Error ? err.message : '\u83b7\u53d6\u7528\u6237\u4fe1\u606f\u5931\u8d25');
      // \u5982\u679c\u6ca1\u6709\u7f13\u5b58\u624d\u8bbe\u7f6e\u964d\u7ea7 userInfo
      if (!getCachedUserInfo()) {
        setUserInfo({
          uid: nativeUser.uid,
          email: null,
          role: 'user',
          apiKeysConfigured: false
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      clearAuthFlag();
      clearCachedUserInfo();
      return;
    }
    setAuthFlag();
    // \u540e\u53f0\u5237\u65b0\u6700\u65b0\u6570\u636e\uff08\u5373\u4f7f\u6709\u7f13\u5b58\u4e5f\u8981\u5237\u65b0\uff09
    fetchUserInfo(user);
  }, [user, fetchUserInfo]);

  const refreshUserInfo = async () => {
    if (user) {
      await fetchUserInfo(user);
    }
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!userInfo) return false;
    const allowedRoles = ROLE_HIERARCHY[userInfo.role] || ['user'];
    return allowedRoles.includes(requiredRole);
  };

  return {
    user,
    userInfo,
    loading,
    error,
    isAuthenticated: () => user !== null && userInfo !== null,
    isAgent: () => hasPermission('agent'),
    isTrader: () => hasPermission('agent'),
    hasPermission,
    refreshUserInfo,
  };
};
