// AI-generated · AI-managed · AI-maintained
import type {
  WalletType,
  ChainType,
  NonceResponse,
  ListWalletsResponse,
  AddWalletResponse,
  RemoveWalletResponse,
  SetPrimaryWalletResponse,
} from './types';
import { guardAuthResponse } from '../auth-service';

const API_BASE = '/api/auth/wallet';

export async function getNonce(
  walletAddress: string,
  walletType: WalletType,
  chain: ChainType,
  options?: { mode?: 'login' | 'bind'; firebaseToken?: string }
): Promise<NonceResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (options?.firebaseToken) {
    headers['Authorization'] = `Bearer ${options.firebaseToken}`;
  }

  const response = await fetch(`${API_BASE}/nonce`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      wallet_address: walletAddress,
      wallet_type: walletType,
      chain,
      mode: options?.mode,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || '\u83b7\u53d6 Nonce \u5931\u8d25');
  }

  const result = await response.json();
  if (result.data) {
    return result.data;
  }
  return result;
}

export async function bindWallet(
  walletAddress: string,
  walletType: WalletType,
  chain: ChainType,
  signature: string,
  nonce: string,
  firebaseToken: string
): Promise<{ success: boolean; message?: string }> {
  const response = await fetch(`${API_BASE}/bind`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${firebaseToken}`,
    },
    body: JSON.stringify({
      wallet_address: walletAddress,
      wallet_type: walletType,
      chain,
      signature,
      nonce,
    }),
  });
  guardAuthResponse(response);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || '\u7ed1\u5b9a\u94b1\u5305\u5931\u8d25');
  }

  return response.json();
}

export async function listWallets(
  firebaseToken: string
): Promise<ListWalletsResponse> {
  const response = await fetch(`${API_BASE}/list`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
    },
  });
  guardAuthResponse(response);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || '\u83b7\u53d6\u94b1\u5305\u5217\u8868\u5931\u8d25');
  }

  return response.json();
}

export async function addWallet(
  walletAddress: string,
  walletType: WalletType,
  chain: ChainType,
  signature: string,
  nonce: string,
  message: string,
  firebaseToken: string
): Promise<AddWalletResponse> {
  const response = await fetch(`${API_BASE}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${firebaseToken}`,
    },
    body: JSON.stringify({
      wallet_address: walletAddress,
      wallet_type: walletType,
      chain,
      signature,
      nonce,
      message,
    }),
  });
  guardAuthResponse(response);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || '\u6dfb\u52a0\u94b1\u5305\u5931\u8d25');
  }

  return response.json();
}

export async function removeWallet(
  walletAddress: string,
  firebaseToken: string
): Promise<RemoveWalletResponse> {
  const response = await fetch(`${API_BASE}/remove`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${firebaseToken}`,
    },
    body: JSON.stringify({
      wallet_address: walletAddress,
    }),
  });
  guardAuthResponse(response);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || '\u5220\u9664\u94b1\u5305\u5931\u8d25');
  }

  return response.json();
}

export async function setPrimaryWallet(
  walletAddress: string,
  firebaseToken: string
): Promise<SetPrimaryWalletResponse> {
  const response = await fetch(`${API_BASE}/set-primary`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${firebaseToken}`,
    },
    body: JSON.stringify({
      wallet_address: walletAddress,
    }),
  });
  guardAuthResponse(response);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || '\u8bbe\u7f6e\u4e3b\u94b1\u5305\u5931\u8d25');
  }

  return response.json();
}
