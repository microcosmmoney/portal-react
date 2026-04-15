// AI-generated · AI-managed · AI-maintained
import {
  Connection,
  PublicKey,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token';

export const REINCARNATION_PROGRAM_ID = new PublicKey(
  'REDEh89TzpwCtoWQuuNPtxskrVoUDQgowR7e7sZpWj9'
);

export const REINCARNATION_POOL = new PublicKey(
  'GSBWtaX9WcBh8jUcmbXtQ1afQPHKSUKvsTxkqpJU3G9S'
);

export const MCC_MINT = new PublicKey(
  'MCCn6eqiTGzaiPKECg3viPmkdkS9YmkguqKvRcTxCsb'
);

export const USDC_MINT = new PublicKey(
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
);

export const USDT_MINT = new PublicKey(
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'
);

export const USDC_VAULT = new PublicKey(
  '5L8vPTvGH14keLq4R6CGGvSFksZFjb7bRPXarCwZbmUA'
);

export const USDT_VAULT = new PublicKey(
  'BnHA9jSm88wzQS4c2nCgTXch1Byzc3FWn2G7Wgrvazy3'
);

export type StablecoinType = 'usdc' | 'usdt';

export const STABLECOIN_CONFIG = {
  usdc: { mint: USDC_MINT, vault: USDC_VAULT, label: 'USDC', decimals: 6 },
  usdt: { mint: USDT_MINT, vault: USDT_VAULT, label: 'USDT', decimals: 6 },
} as const;

export async function getUserMccAccount(userPubkey: PublicKey): Promise<PublicKey> {
  return getAssociatedTokenAddress(MCC_MINT, userPubkey, false, TOKEN_PROGRAM_ID);
}

export async function getUserUsdcAccount(userPubkey: PublicKey): Promise<PublicKey> {
  return getAssociatedTokenAddress(USDC_MINT, userPubkey);
}

export async function getUserUsdtAccount(userPubkey: PublicKey): Promise<PublicKey> {
  return getAssociatedTokenAddress(USDT_MINT, userPubkey);
}

export async function getUserStablecoinAccount(userPubkey: PublicKey, stablecoin: StablecoinType): Promise<PublicKey> {
  const config = STABLECOIN_CONFIG[stablecoin];
  return getAssociatedTokenAddress(config.mint, userPubkey);
}

export async function checkAccountExists(
  connection: Connection,
  address: PublicKey
): Promise<boolean> {
  const accountInfo = await connection.getAccountInfo(address);
  return accountInfo !== null;
}
