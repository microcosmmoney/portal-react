// AI-generated · AI-managed · AI-maintained
export type WalletType =
  | 'phantom'
  | 'solflare'
  | 'metamask'
  | 'binance'
  | 'okx'
  | 'bybit';

export type ChainType = 'solana' | 'evm';

export interface WalletInfo {
  type: WalletType;
  name: string;
  icon: string;
  chain: ChainType;
  installed: boolean;
  downloadUrl: string;
}

export interface WalletConnectionState {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  walletType: WalletType | null;
  chain: ChainType | null;
}

export interface NonceResponse {
  nonce: string;
  expires_at: string;
  message: string;
}

export interface VerifySignatureRequest {
  wallet_address: string;
  wallet_type: WalletType;
  chain: ChainType;
  signature: string;
  nonce: string;
}

export interface VerifySignatureResponse {
  success: boolean;
  firebase_custom_token?: string;
  user?: {
    uid: string;
    wallet_address: string;
    email?: string;
    role: string;
  };
  error?: string;
}

export interface WalletDetectionResult {
  phantom: boolean;
  solflare: boolean;
  metamask: boolean;
  metamaskSolana: boolean;
  binance: boolean;
  okx: boolean;
  bybit: boolean;
}

export const WALLET_CONFIG: Record<WalletType, Omit<WalletInfo, 'installed'>> = {
  phantom: {
    type: 'phantom',
    name: 'Phantom',
    icon: '/wallets/phantom.svg',
    chain: 'solana',
    downloadUrl: 'https://phantom.app/download',
  },
  solflare: {
    type: 'solflare',
    name: 'Solflare',
    icon: '/wallets/solflare.svg',
    chain: 'solana',
    downloadUrl: 'https://solflare.com/download',
  },
  metamask: {
    type: 'metamask',
    name: 'MetaMask',
    icon: '/wallets/metamask.svg',
    chain: 'evm',
    downloadUrl: 'https://metamask.io/download/',
  },
  binance: {
    type: 'binance',
    name: 'Binance Web3',
    icon: '/wallets/binance.svg',
    chain: 'evm',
    downloadUrl: 'https://www.binance.com/en/web3wallet',
  },
  okx: {
    type: 'okx',
    name: 'OKX Wallet',
    icon: '/wallets/okx.svg',
    chain: 'evm',
    downloadUrl: 'https://www.okx.com/web3',
  },
  bybit: {
    type: 'bybit',
    name: 'Bybit Wallet',
    icon: '/wallets/bybit.svg',
    chain: 'evm',
    downloadUrl: 'https://www.bybit.com/web3',
  },
};

export const SIGN_MESSAGE_TEMPLATE = (nonce: string, timestamp: number) =>
  `Welcome to Microcosm!

Please sign this message to verify your wallet ownership.

Wallet: {wallet_address}
Nonce: ${nonce}
Timestamp: ${timestamp}
Chain: {chain}

This signature will not trigger any blockchain transaction or cost any gas fees.`;

export interface UserWallet {
  wallet_address: string;
  wallet_type: 'solana' | 'evm';
  is_primary: boolean;
  created_at: string;
}

export interface ListWalletsResponse {
  success: boolean;
  data?: {
    wallets: UserWallet[];
    primary_wallet: string | null;
  };
  error?: string;
}

export interface AddWalletResponse {
  success: boolean;
  data?: {
    wallet_address: string;
    is_primary: boolean;
    message: string;
  };
  error?: string;
}

export interface RemoveWalletResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface SetPrimaryWalletResponse {
  success: boolean;
  data?: {
    old_primary: string | null;
    new_primary: string;
  };
  error?: string;
}
