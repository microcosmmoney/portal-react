import { PublicKey, Connection, Keypair } from "@solana/web3.js"

export interface SolanaPayTransferParams {
  recipient: PublicKey
  amount: number
  splToken: PublicKey
  reference: PublicKey
  label?: string
  message?: string
}

export function createSolanaPayUrl(params: SolanaPayTransferParams): string {
  const { recipient, amount, splToken, reference, label, message } = params
  const url = new URL(`solana:${recipient.toBase58()}`)
  url.searchParams.set("amount", amount.toFixed(6))
  url.searchParams.set("spl-token", splToken.toBase58())
  url.searchParams.set("reference", reference.toBase58())
  if (label) url.searchParams.set("label", label)
  if (message) url.searchParams.set("message", message)
  return url.toString()
}

export function createPaymentReference(): { reference: PublicKey; keypair: Keypair } {
  const keypair = Keypair.generate()
  return { reference: keypair.publicKey, keypair }
}

export interface FindTransactionOptions {
  interval?: number
  timeout?: number
  commitment?: "confirmed" | "finalized"
}

export async function findTransactionByReference(
  connection: Connection,
  reference: PublicKey,
  options: FindTransactionOptions = {}
): Promise<string | null> {
  const { interval = 2000, timeout = 300000, commitment = "confirmed" } = options
  const startTime = Date.now()
  while (Date.now() - startTime < timeout) {
    try {
      const signatures = await connection.getSignaturesForAddress(reference, { limit: 1 }, commitment)
      if (signatures.length > 0 && !signatures[0].err) return signatures[0].signature
    } catch {}
    await new Promise(resolve => setTimeout(resolve, interval))
  }
  return null
}

export async function extractSenderFromTransaction(
  connection: Connection,
  signature: string
): Promise<string | null> {
  try {
    const tx = await connection.getParsedTransaction(signature, { maxSupportedTransactionVersion: 0, commitment: "confirmed" })
    if (!tx?.transaction?.message?.accountKeys) return null
    const feePayer = tx.transaction.message.accountKeys.find((key) => (key as { signer?: boolean }).signer)
    if (!feePayer) return null
    const pubkey = (feePayer as { pubkey: PublicKey }).pubkey || (feePayer as unknown as PublicKey)
    return pubkey.toBase58()
  } catch (err) {
    console.error("Failed to extract sender from transaction:", err)
    return null
  }
}

export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function isIOS(): boolean {
  if (typeof window === "undefined") return false
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function isAndroid(): boolean {
  if (typeof window === "undefined") return false
  return /Android/i.test(navigator.userAgent)
}

export interface WalletDeepLink {
  name: string
  icon: string
  openUrl: string
  installUrl: string
}

export function getWalletDeepLinks(solanaPayUrl: string): WalletDeepLink[] {
  const ios = isIOS()

  return [
    {
      name: "Solflare",
      icon: "🔥",
      openUrl: solanaPayUrl,
      installUrl: ios
        ? "https://apps.apple.com/app/solflare-solana-wallet/id1580902717"
        : "https://play.google.com/store/apps/details?id=com.solflare.mobile",
    },
  ]
}
