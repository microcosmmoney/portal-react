"use client"

import * as React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { X, Loader2, CheckCircle2, AlertCircle, ExternalLink, ChevronDown, Smartphone, Monitor, Shield, QrCode } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { TerminalCard, TerminalBadge } from "../ui/terminal"
import { createMiningRequest, confirmMiningPayment, buildMiningTransaction, getMiningRatio, getPublicMiningPreflight, checkMiningWallet } from "../../lib/api"
import type { MiningRequestResponse, MiningRatioInfo } from "../../lib/types/api"
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react"
import { PublicKey, Transaction, TransactionInstruction, Connection } from "@solana/web3.js"
import { getAssociatedTokenAddressSync } from "@solana/spl-token"
import { createSolanaPayUrl, createPaymentReference, findTransactionByReference, extractSenderFromTransaction, isMobileDevice } from "../../lib/solana/solana-pay"
import { useTranslations } from "next-intl"

interface MiningModalProps {
  isOpen: boolean
  onClose: () => void
  userDetails: { uid: string; unit_level?: number; source_project_id?: string } | null
  onSuccess?: () => void
}

interface ConfirmationResult {
  tx_id: number
  onchain_tx_signature: string
  user_level: number
  mcc_distributed: { user: number; lp_reserve: number; magistrate: number; station_mcd: number }
  distribution_details: { user_percent: number; companion_lp_percent: number; companion_magistrate_percent: number; station_mcd_percent: number }
  status: string
}

type StablecoinType = 'usdc' | 'usdt'
type Step = "input" | "paymentMethod" | "qrPayment" | "payment" | "confirming" | "success" | "error"

const STABLECOIN_MINTS: Record<StablecoinType, PublicKey> = {
  usdc: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  usdt: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
}
const STABLECOIN_VAULTS: Record<StablecoinType, PublicKey> = {
  usdc: new PublicKey("5L8vPTvGH14keLq4R6CGGvSFksZFjb7bRPXarCwZbmUA"),
  usdt: new PublicKey("BnHA9jSm88wzQS4c2nCgTXch1Byzc3FWn2G7Wgrvazy3"),
}
const POOL_PDA_WALLET = new PublicKey("GSBWtaX9WcBh8jUcmbXtQ1afQPHKSUKvsTxkqpJU3G9S")
const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"
const COIN_INFO: Record<StablecoinType, { symbol: string; name: string; icon: string }> = {
  usdc: { symbol: 'USDC', name: 'USD Coin', icon: '💵' },
  usdt: { symbol: 'USDT', name: 'Tether', icon: '💴' },
}

export default function MiningModal({ isOpen, onClose, userDetails, onSuccess }: MiningModalProps) {
  const t = useTranslations("miningModal")
  const { publicKey, sendTransaction, connected } = useSolanaWallet()
  const [mccAmount, setMccAmount] = useState("")
  const [stablecoin, setStablecoin] = useState<StablecoinType>("usdc")
  const [showStablecoinDropdown, setShowStablecoinDropdown] = useState(false)
  const [step, setStep] = useState<Step>("input")
  const [miningRequest, setMiningRequest] = useState<MiningRequestResponse | null>(null)
  const [ratioInfo, setRatioInfo] = useState<MiningRatioInfo | null>(null)
  const [txSignature, setTxSignature] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [stablecoinBalance, setStablecoinBalance] = useState<number | null>(null)
  const [loadingBalance, setLoadingBalance] = useState(false)
  const [solanaPayUrl, setSolanaPayUrl] = useState("")
  const [paymentReference, setPaymentReference] = useState<PublicKey | null>(null)
  const [qrMonitoring, setQrMonitoring] = useState(false)
  const monitorAbortRef = useRef(false)
  const [qrPayerAddress, setQrPayerAddress] = useState("")
  const isMobile = typeof window !== "undefined" ? isMobileDevice() : false

  const loadStablecoinBalance = useCallback(async () => {
    if (!publicKey || !connected) { setStablecoinBalance(null); return }
    setLoadingBalance(true)
    try {
      const connection = new Connection(SOLANA_RPC, "confirmed")
      const userAta = getAssociatedTokenAddressSync(STABLECOIN_MINTS[stablecoin], publicKey)
      const accountInfo = await connection.getAccountInfo(userAta)
      setStablecoinBalance(accountInfo ? Number(accountInfo.data.readBigUInt64LE(64)) / 1_000_000 : 0)
    } catch { setStablecoinBalance(null) } finally { setLoadingBalance(false) }
  }, [publicKey, connected, stablecoin])

  useEffect(() => { if (isOpen) { getMiningRatio().then(r => { if (r.success && r.data) setRatioInfo(r.data) }).catch(() => {}); loadStablecoinBalance() } }, [isOpen, loadStablecoinBalance])
  useEffect(() => { if (isOpen && connected) loadStablecoinBalance() }, [stablecoin, isOpen, connected, loadStablecoinBalance])
  useEffect(() => () => { monitorAbortRef.current = true }, [])

  const confirmPayment = async (request: MiningRequestResponse, signature: string) => {
    setLoading(true)
    try {
      const response = await confirmMiningPayment({ request_id: request.request_id, tx_signature: signature, mcc_amount: request.mcc_amount, usdc_amount: request.usdc_amount_with_discount, stablecoin_type: stablecoin })
      if (!response.success || !response.data) throw new Error(response.error || t("errorConfirmPayment"))
      setConfirmationResult(response.data as unknown as ConfirmationResult)
      setStep("success")
    } catch (err: unknown) { setError(err instanceof Error ? err.message : t("errorConfirmPayment")); setStep("error") }
    finally { setLoading(false) }
  }

  const startQrMonitoring = async (reference: PublicKey, request: MiningRequestResponse) => {
    setQrMonitoring(true); monitorAbortRef.current = false
    try {
      const connection = new Connection(SOLANA_RPC, "confirmed")
      const signature = await findTransactionByReference(connection, reference, { interval: 2500, timeout: 300000, commitment: "confirmed" })
      if (monitorAbortRef.current) return
      if (signature) {
        setTxSignature(signature)
        const senderAddress = await extractSenderFromTransaction(connection, signature)
        if (!senderAddress) { setError(t("errorExtractPayer")); setStep("error"); return }
        setQrPayerAddress(senderAddress)
        if (userDetails?.uid) {
          try { const wc = await checkMiningWallet(senderAddress); if (!wc.success) { setError(t("errorWalletBoundToOther")); setStep("error"); return } }
          catch {}
        }
        setStep("confirming"); await confirmPayment(request, signature)
      } else { setError(t("errorPaymentTimeout")); setStep("error") }
    } catch (err: unknown) { if (!monitorAbortRef.current) { setError(err instanceof Error ? err.message : t("errorMonitorFailed")); setStep("error") } }
    finally { setQrMonitoring(false) }
  }

  const handleSubmit = async () => {
    if (!userDetails || !mccAmount || parseFloat(mccAmount) <= 0) { setError(t("errorInvalidAmount")); return }
    setLoading(true); setError("")
    try {
      try { const pf = await getPublicMiningPreflight(); if (pf.success && pf.data && !pf.data.ready) { setError(pf.data.reason || "Mining system is temporarily unavailable. Please try again later."); setStep("error"); setLoading(false); return } } catch {}
      const { reference } = createPaymentReference(); setPaymentReference(reference)
      const response = await createMiningRequest({ mcc_amount: parseFloat(mccAmount) * 1_000_000_000, stablecoin_type: stablecoin, reference: reference.toBase58() })
      if (!response.success || !response.data) throw new Error(response.error || t("errorCreateRequest"))
      setMiningRequest(response.data)
      const vault = STABLECOIN_VAULTS[stablecoin], mint = STABLECOIN_MINTS[stablecoin]
      const url = createSolanaPayUrl({ recipient: vault, amount: response.data.usdc_amount_with_discount / 1_000_000, splToken: mint, reference, label: "Microcosm Mining", message: `Mine ${mccAmount} MCC` })
      setSolanaPayUrl(url)
      if (isMobile) { setStep("qrPayment"); startQrMonitoring(reference, response.data) } else { setStep("paymentMethod") }
    } catch (err: unknown) { setError(err instanceof Error ? err.message : t("errorMintRequest")); setStep("error") }
    finally { setLoading(false) }
  }

  const handleSelectQrPayment = () => { if (!miningRequest || !paymentReference) return; setStep("qrPayment"); startQrMonitoring(paymentReference, miningRequest) }

  const handleSelectBrowserPayment = async () => {
    if (!connected || !publicKey) { setError(t("errorConnectWallet")); return }
    try { setLoading(true); const wc = await checkMiningWallet(publicKey.toBase58()); if (!wc.success) { setError(t("errorWalletBoundToOther")); setLoading(false); return } } catch { setError(t("errorWalletCheckFailed")); setLoading(false); return }
    setLoading(false)
    if (miningRequest && ratioInfo && stablecoinBalance !== null) {
      const req = miningRequest.usdc_amount_with_discount / 1_000_000
      if (stablecoinBalance < req) { setError(t("errorBalanceInsufficient", { symbol: COIN_INFO[stablecoin].symbol, required: req.toFixed(2), current: stablecoinBalance.toFixed(2), otherCoin: stablecoin === 'usdc' ? 'USDT' : 'USDC' })); return }
    }
    setStep("payment"); if (miningRequest) executeStablecoinTransfer(miningRequest)
  }

  const executeStablecoinTransfer = async (request: MiningRequestResponse) => {
    if (!publicKey || !sendTransaction) throw new Error(t("errorWalletNotConnected"))
    setLoading(true)
    try {
      const { createTransferCheckedInstruction } = await import("@solana/spl-token")
      const vault = STABLECOIN_VAULTS[stablecoin], mint = STABLECOIN_MINTS[stablecoin]
      const userAta = getAssociatedTokenAddressSync(mint, publicKey)
      const transferIx = createTransferCheckedInstruction(userAta, mint, vault, publicKey, request.usdc_amount_with_discount, 6)
      const connection = new Connection(SOLANA_RPC, "confirmed")
      const transaction = new Transaction().add(transferIx)
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash; transaction.feePayer = publicKey
      const signature = await sendTransaction(transaction, connection)
      setTxSignature(signature); setStep("confirming")
      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed')
      await confirmPayment(request, signature)
    } catch (err: unknown) { setError(err instanceof Error ? err.message : t("errorMiningFailed")); setStep("error"); throw err }
    finally { setLoading(false) }
  }

  const handleClose = () => {
    monitorAbortRef.current = true; setStep("input"); setMccAmount(""); setMiningRequest(null); setTxSignature(""); setError(""); setConfirmationResult(null); setSolanaPayUrl(""); setPaymentReference(null); setQrMonitoring(false); setQrPayerAddress("")
    if (onSuccess) onSuccess(); onClose()
  }

  if (!isOpen) return null
  const paymentAmount = miningRequest ? (miningRequest.usdc_amount_with_discount / 1_000_000).toFixed(2) : "0"
  const ci = COIN_INFO[stablecoin]

  const OrderSummary = () => (
    <div className="p-3 rounded bg-neutral-800 border border-neutral-700 space-y-2 text-sm">
      <div className="flex justify-between"><span className="text-neutral-400">{t("mintQuantity")}</span><span className="text-white font-bold font-mono">{(miningRequest!.mcc_amount / 1_000_000_000).toLocaleString()} MCC</span></div>
      <div className="flex justify-between"><span className="text-neutral-400">{t("payAmount")}</span><span className="text-cyan-400 font-bold font-mono">{paymentAmount} {ci.symbol}</span></div>
    </div>
  )

  const TxLink = ({ sig, label }: { sig: string; label?: string }) => (
    <a href={`https://solscan.io/tx/${sig}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline">
      {label || `${sig.slice(0, 16)}...${sig.slice(-16)}`} <ExternalLink className="w-3 h-3" />
    </a>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-end 2xs:items-center justify-center bg-black/50 backdrop-blur-sm font-mono">
      <div className="relative w-full max-w-2xl mx-0 2xs:mx-3 xs:mx-4 max-h-[95vh] 2xs:max-h-[90vh] overflow-y-auto rounded-t-2xl 2xs:rounded-xl">
        <TerminalCard filename="mining_request.json">
          <div className="flex items-center justify-between mb-4 2xs:mb-5 xs:mb-6">
            <div>
              <h2 className="text-base 2xs:text-lg xs:text-xl font-bold text-white mb-1">{t("title")}</h2>
              <p className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider">{t("subtitle")}</p>
            </div>
            <button onClick={handleClose} disabled={loading} className="text-neutral-400 hover:text-white transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"><X className="w-5 h-5" /></button>
          </div>

          {step === "input" && (
            <div className="space-y-4">
              {ratioInfo && (
                <div className="p-3 rounded bg-neutral-800 border border-neutral-700">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div><div className="text-xs text-neutral-400 tracking-wider mb-1">{t("currentPhase")}</div><div className="text-white font-bold font-mono">Phase {ratioInfo.current_stage}</div></div>
                    <div><div className="text-xs text-neutral-400 tracking-wider mb-1 flex items-center gap-1">{t("techBonus")}<span className="cursor-help text-neutral-500 hover:text-cyan-400" title={t("techBonusTooltip")}>?</span></div><div className="text-cyan-400 font-bold font-mono">0%</div></div>
                    <div><div className="text-xs text-neutral-400 tracking-wider mb-1">{t("mintPrice")}</div><div className="text-cyan-400 font-bold font-mono">1 MCC ≈ {(ratioInfo.usdc_per_mcc * 4).toFixed(2)} USD</div></div>
                  </div>
                </div>
              )}
              <div className="p-4 rounded bg-cyan-400/20 border border-cyan-400/50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div><div className="text-cyan-400 font-bold text-sm mb-1">{t("solanaOnly")}</div><p className="text-neutral-300 text-xs leading-relaxed">{t("solanaOnlyDescMining")}</p></div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 tracking-wider mb-2">{t("paymentMethod")} <span className="text-cyan-400">({t("paymentMethodHint")})</span></label>
                <div className="relative">
                  <button type="button" onClick={() => setShowStablecoinDropdown(!showStablecoinDropdown)} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded text-white flex items-center justify-between hover:border-neutral-500 transition-colors">
                    <span className="flex items-center gap-2"><span>{ci.icon}</span><span>{ci.symbol}</span><span className="text-neutral-400 text-sm">({ci.name})</span></span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showStablecoinDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showStablecoinDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-neutral-900 border border-neutral-700 rounded shadow-lg">
                      {(Object.keys(COIN_INFO) as StablecoinType[]).map(type => (
                        <button key={type} type="button" onClick={() => { setStablecoin(type); setShowStablecoinDropdown(false) }} className={`w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-neutral-800 transition-colors ${stablecoin === type ? 'bg-neutral-800 text-cyan-400' : 'text-white'}`}>
                          <span>{COIN_INFO[type].icon}</span><span>{COIN_INFO[type].symbol}</span><span className="text-neutral-400 text-sm">({COIN_INFO[type].name})</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {connected && (
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-neutral-400">{t("stablecoinEqual")}</span>
                    <span className={`font-medium ${stablecoinBalance === null ? 'text-neutral-400' : stablecoinBalance === 0 ? 'text-red-400' : 'text-white'}`}>
                      {loadingBalance ? t("loading") : stablecoinBalance === null ? t("balanceUnknown") : t("balance", { amount: stablecoinBalance.toFixed(2), symbol: ci.symbol })}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-neutral-400 tracking-wider mb-2">{t("mintAmountLabel", { symbol: "MCC" })}</label>
                <input type="number" inputMode="decimal" value={mccAmount} onChange={e => setMccAmount(e.target.value)} placeholder={t("inputPlaceholder", { symbol: "MCC" })} className="w-full px-3 2xs:px-4 py-3 bg-neutral-800 border border-neutral-600 rounded text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400 text-base" min="0" step="0.01" />
              </div>

              {mccAmount && parseFloat(mccAmount) > 0 && ratioInfo && (
                <div className="p-4 rounded bg-cyan-400/20 border border-cyan-400/50 space-y-3">
                  <div>
                    <div className="text-xs text-neutral-400 tracking-wider mb-2">{t("estimatedPayment")}</div>
                    <div className="text-2xl font-bold text-cyan-400 font-mono">{(parseFloat(mccAmount) * ratioInfo.usdc_per_mcc * 4).toFixed(2)} {ci.symbol}</div>
                  </div>
                  <div className="pt-3 border-t border-cyan-400/30">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-400 tracking-wider">{t("youWillReceive")}</span>
                      <span className="text-lg font-bold text-white font-mono">{parseFloat(mccAmount).toFixed(4)} MCC</span>
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">{t("mccToWallet")}</div>
                  </div>
                </div>
              )}

              {error && <div className="flex items-center gap-2 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-500 text-sm"><AlertCircle className="w-4 h-4" />{error}</div>}

              <div className="flex gap-3">
                <button onClick={handleClose} className="flex-1 px-4 py-3 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent rounded transition-colors">{t("cancel")}</button>
                <button onClick={handleSubmit} disabled={loading || !mccAmount || parseFloat(mccAmount) <= 0} className="flex-1 px-4 py-3 bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}{loading ? t("processing") : t("confirmMint")}
                </button>
              </div>
            </div>
          )}

          {step === "paymentMethod" && miningRequest && (
            <div className="space-y-4">
              <OrderSummary />
              <div className="p-3 rounded bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300">{t("stablecoinReminder", { symbol: ci.symbol })}</div>
              <div className="text-xs text-neutral-400 tracking-wider uppercase mb-1">{t("selectPaymentMethod")}</div>
              <button onClick={handleSelectQrPayment} className="w-full p-4 rounded border border-neutral-700 bg-neutral-800/30 hover:bg-cyan-400/10 hover:border-cyan-400/70 focus:bg-cyan-400/10 focus:border-cyan-400 focus:outline-none transition-all text-left group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-neutral-700/50 group-hover:bg-cyan-400/20 group-focus:bg-cyan-400/20 transition-colors flex items-center justify-center flex-shrink-0"><QrCode className="w-6 h-6 text-neutral-400 group-hover:text-cyan-400 group-focus:text-cyan-400 transition-colors" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><span className="text-neutral-300 group-hover:text-white group-focus:text-white font-bold text-sm transition-colors">{t("mobileQrScan")}</span><span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-400/20 text-cyan-400 tracking-wider">{t("recommended")}</span></div>
                    <p className="text-neutral-500 group-hover:text-neutral-400 group-focus:text-neutral-400 text-xs mt-1 leading-relaxed transition-colors">{t("mobileQrDesc")}</p>
                  </div>
                  <Smartphone className="w-5 h-5 text-neutral-500 group-hover:text-cyan-400 group-focus:text-cyan-400 transition-colors flex-shrink-0" />
                </div>
              </button>
              <button onClick={handleSelectBrowserPayment} disabled={!connected} className="w-full p-4 rounded border border-neutral-700 bg-neutral-800/30 hover:bg-cyan-400/10 hover:border-cyan-400/70 focus:bg-cyan-400/10 focus:border-cyan-400 focus:outline-none transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-800/30 disabled:hover:border-neutral-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-neutral-700/50 group-hover:bg-cyan-400/20 group-focus:bg-cyan-400/20 transition-colors flex items-center justify-center flex-shrink-0"><Monitor className="w-6 h-6 text-neutral-400 group-hover:text-cyan-400 group-focus:text-cyan-400 transition-colors" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><span className="text-neutral-300 group-hover:text-white group-focus:text-white font-bold text-sm transition-colors">{t("browserExtension")}</span></div>
                    <p className="text-neutral-500 group-hover:text-neutral-400 group-focus:text-neutral-400 text-xs mt-1 leading-relaxed transition-colors">{connected ? t("browserExtConnected") : t("browserExtNotConnected")}</p>
                  </div>
                  <Monitor className="w-5 h-5 text-neutral-500 group-hover:text-cyan-400 group-focus:text-cyan-400 transition-colors flex-shrink-0" />
                </div>
              </button>
              {error && <div className="flex items-center gap-2 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-500 text-sm"><AlertCircle className="w-4 h-4" />{error}</div>}
              <button onClick={() => { setStep("input"); setError("") }} className="w-full px-4 py-2 text-neutral-400 hover:text-neutral-300 text-sm transition-colors">&larr; {t("goBack")}</button>
            </div>
          )}

          {step === "qrPayment" && miningRequest && solanaPayUrl && (
            <div className="space-y-3 2xs:space-y-4">
              <TerminalBadge variant="info">{t("waitingQrPayment")}</TerminalBadge>
              <OrderSummary />
              <div className="p-2 2xs:p-3 rounded bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 text-xs 2xs:text-sm"><Shield className="w-4 h-4 text-amber-400 flex-shrink-0" /><span className="text-amber-400 font-bold">{t("confirmPayWithSymbol", { symbol: ci.symbol })}</span></div>
                <p className="text-neutral-400 text-[10px] 2xs:text-xs mt-1 ml-6">{t("insufficientBalance", { symbol: ci.symbol })}<button onClick={() => { monitorAbortRef.current = true; setStep("input"); setQrMonitoring(false) }} className="text-cyan-400 hover:underline ml-1">{t("switchToken")}</button></p>
              </div>

              <div className="flex flex-col items-center space-y-3 2xs:space-y-4">
                <p className="text-neutral-400 text-xs 2xs:text-sm text-center">{t("scanQrToPayDesktop")}</p>
                <div className="bg-white p-3 2xs:p-4 xs:p-5 rounded-xl">
                  <QRCodeSVG value={solanaPayUrl} size={200} level="H" includeMargin={false} className="w-[160px] h-[160px] 2xs:w-[180px] 2xs:h-[180px] xs:w-[220px] xs:h-[220px] sm:w-[280px] sm:h-[280px]" imageSettings={{ src: "/mcc-logo-40.png", x: undefined, y: undefined, height: 40, width: 40, excavate: true }} />
                </div>
                <div className="flex items-center gap-2 text-neutral-400 text-[10px] 2xs:text-xs"><Loader2 className="w-3 h-3 animate-spin" />{t("waitingQrScan")}</div>
              </div>

              {qrMonitoring && <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs 2xs:text-sm py-2"><Loader2 className="w-4 h-4 animate-spin" />{t("monitoringOnchain")}</div>}
              <button onClick={() => { monitorAbortRef.current = true; setStep(isMobile ? "input" : "paymentMethod"); setQrMonitoring(false); setError("") }} className="w-full px-4 py-2 text-neutral-400 hover:text-neutral-300 text-xs 2xs:text-sm transition-colors min-h-[44px]">&larr; {t("goBack")}</button>
            </div>
          )}

          {step === "payment" && miningRequest && (
            <div className="space-y-4">
              <TerminalBadge variant="info">{t("waitingPayment")}</TerminalBadge>
              <OrderSummary />
              <div className="flex items-center justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>
              <p className="text-center text-neutral-400 text-sm">{t("processingTransfer", { symbol: ci.symbol })}</p>
            </div>
          )}

          {step === "confirming" && txSignature && (
            <div className="space-y-4">
              <TerminalBadge variant="warning">{t("verifying")}</TerminalBadge>
              <div className="flex items-center justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>
              <p className="text-center text-neutral-400 text-sm mb-2">{t("verifyingTransaction")}</p>
              <div className="p-3 rounded bg-neutral-800 border border-neutral-700">
                <div className="text-xs text-neutral-400 tracking-wider mb-1">{t("txSignature")}</div>
                <div className="font-mono text-xs text-cyan-400 break-all">{txSignature.slice(0, 16)}...{txSignature.slice(-16)}</div>
                <div className="mt-2"><TxLink sig={txSignature} label={t("viewOnExplorer")} /></div>
              </div>
            </div>
          )}

          {step === "success" && confirmationResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8"><div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center"><CheckCircle2 className="w-8 h-8 text-white" /></div></div>
              <h3 className="text-xl font-bold text-center text-white">{t("mintSuccess")}</h3>
              <div className="p-4 rounded bg-white/10 border border-neutral-700 space-y-3">
                <div className="text-center">
                  <div className="text-xs text-neutral-400 tracking-wider mb-1">{t("youReceived")}</div>
                  <div className="text-3xl font-bold text-white font-mono">+{(confirmationResult.mcc_distributed.user / 1_000_000_000).toLocaleString()} MCC</div>
                  <div className="text-xs text-neutral-400 mt-1">{t("sentToWallet")}</div>
                </div>
                <div className="pt-3 border-t border-neutral-700">
                  <div className="text-xs text-neutral-400 tracking-wider mb-1">{t("paymentTx", { symbol: ci.symbol })}</div>
                  <TxLink sig={txSignature} />
                </div>
              </div>
              {confirmationResult.onchain_tx_signature && (
                <div className="p-4 rounded bg-neutral-800 border border-neutral-700 space-y-2">
                  <div className="text-xs text-neutral-400 tracking-wider">{t("onchainDistribution")}</div>
                  <TxLink sig={confirmationResult.onchain_tx_signature} />
                </div>
              )}
              <div className="flex gap-3"><button onClick={handleClose} className="flex-1 px-4 py-3 bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-colors">{t("doneAndRefresh")}</button></div>
            </div>
          )}

          {step === "error" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8"><div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center"><AlertCircle className="w-8 h-8 text-red-500" /></div></div>
              <h3 className="text-xl font-bold text-center text-red-500">{t("mintFailed")}</h3>
              <div className="p-4 rounded bg-red-500/20 border border-red-500/50"><p className="text-red-500 text-sm whitespace-pre-line">{error}</p></div>
              <button onClick={() => { setStep("input"); setError("") }} className="w-full px-4 py-3 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent rounded transition-colors">{t("back")}</button>
            </div>
          )}
        </TerminalCard>
      </div>
    </div>
  )
}
