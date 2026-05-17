"use client"

import * as React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { X, Loader2, CheckCircle2, AlertCircle, ExternalLink, ChevronDown, Smartphone, Monitor, Shield, QrCode } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { TerminalCard, TerminalBadge } from "../ui/terminal"
import { createPublicMiningRequest, confirmPublicMiningPayment, getMiningRatio, getPublicMiningPreflight } from "../../lib/api"
import type { MiningRequestResponse, MiningRatioInfo } from "../../lib/types/api"
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react"
import { PublicKey, Transaction, Connection } from "@solana/web3.js"
import { getAssociatedTokenAddressSync, createTransferInstruction } from "@solana/spl-token"
import { createSolanaPayUrl, createPaymentReference, findTransactionByReference, extractSenderFromTransaction, isMobileDevice } from "../../lib/solana/solana-pay"
import { useTranslations } from "next-intl"

interface PublicMiningModalProps { isOpen: boolean; onClose: () => void; onSuccess?: () => void }
interface ConfirmationResult { tx_id: number; onchain_tx_signature: string; mcc_distributed: { user: number; lp_reserve: number; magistrate: number; station_mcd: number }; status: string }
type StablecoinType = 'usdc' | 'usdt'
type Step = "input" | "paymentMethod" | "qrPayment" | "payment" | "confirming" | "success" | "error"

const STABLECOIN_MINTS: Record<StablecoinType, PublicKey> = { usdc: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), usdt: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB") }
const STABLECOIN_VAULTS: Record<StablecoinType, PublicKey> = { usdc: new PublicKey("5L8vPTvGH14keLq4R6CGGvSFksZFjb7bRPXarCwZbmUA"), usdt: new PublicKey("BnHA9jSm88wzQS4c2nCgTXch1Byzc3FWn2G7Wgrvazy3") }
const SOLANA_RPC = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"
const COIN_INFO: Record<StablecoinType, { symbol: string; name: string; icon: string }> = { usdc: { symbol: 'USDC', name: 'USD Coin', icon: '💵' }, usdt: { symbol: 'USDT', name: 'Tether', icon: '💴' } }

export default function PublicMiningModal({ isOpen, onClose, onSuccess }: PublicMiningModalProps) {
  const t = useTranslations("miningModal")
  const { publicKey, sendTransaction, connected } = useSolanaWallet()
  const [amount, setAmount] = useState("")
  const [stablecoin, setStablecoin] = useState<StablecoinType>("usdc")
  const [showDropdown, setShowDropdown] = useState(false)
  const [step, setStep] = useState<Step>("input")
  const [miningReq, setMiningReq] = useState<MiningRequestResponse | null>(null)
  const [ratioInfo, setRatioInfo] = useState<MiningRatioInfo | null>(null)
  const [txSig, setTxSig] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ConfirmationResult | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [loadingBal, setLoadingBal] = useState(false)
  const [qrPayer, setQrPayer] = useState("")
  const [payUrl, setPayUrl] = useState("")
  const [payRef, setPayRef] = useState<PublicKey | null>(null)
  const [monitoring, setMonitoring] = useState(false)
  const abortRef = useRef(false)
  const isMobile = typeof window !== "undefined" ? isMobileDevice() : false
  const ci = COIN_INFO[stablecoin]

  const loadBalance = useCallback(async () => {
    if (!publicKey || !connected) { setBalance(null); return }
    setLoadingBal(true)
    try {
      const conn = new Connection(SOLANA_RPC, "confirmed")
      const ata = getAssociatedTokenAddressSync(STABLECOIN_MINTS[stablecoin], publicKey)
      const info = await conn.getAccountInfo(ata)
      setBalance(info ? Number(info.data.readBigUInt64LE(64)) / 1_000_000 : 0)
    } catch { setBalance(null) }
    finally { setLoadingBal(false) }
  }, [publicKey, connected, stablecoin])

  useEffect(() => { if (isOpen) { loadRatio(); loadBalance() } }, [isOpen, loadBalance])
  useEffect(() => { if (isOpen && connected) loadBalance() }, [stablecoin, isOpen, connected, loadBalance])
  useEffect(() => { if (isOpen) { setStep("input"); setAmount(""); setMiningReq(null); setTxSig(""); setError(""); setResult(null); setPayUrl(""); setPayRef(null); setQrPayer("") } }, [isOpen])
  useEffect(() => () => { abortRef.current = true }, [])

  const loadRatio = async () => { try { const r = await getMiningRatio(); if (r.success && r.data) setRatioInfo(r.data) } catch {} }

  const pricing = (() => {
    const qty = parseFloat(amount)
    if (!qty || qty <= 0 || !ratioInfo) return null
    const full = qty * ratioInfo.usdc_per_mcc * 4
    return { full, discounted: full, discount: 0 }
  })()

  const payAmt = miningReq ? ((miningReq.usd_amount_with_discount || miningReq.usdc_amount_with_discount) / 1_000_000).toFixed(2) : "0"

  const resetState = () => { setStep("input"); setAmount(""); setMiningReq(null); setTxSig(""); setError(""); setResult(null); setPayUrl(""); setPayRef(null); setMonitoring(false); setQrPayer("") }

  const handleClose = () => { abortRef.current = true; const wasSuccess = step === "success"; resetState(); if (wasSuccess && onSuccess) onSuccess(); onClose() }

  const confirmPayment = async (req: MiningRequestResponse, sig: string, wallet: string) => {
    setLoading(true)
    try {
      const res = await confirmPublicMiningPayment({ wallet_address: wallet, tx_signature: sig, request_id: req.request_id, mcc_amount: req.mcc_amount, usd_amount: req.usd_amount_with_discount || req.usdc_amount_with_discount, stablecoin_type: stablecoin, token_type: 'mcc' })
      if (!res.success || !res.data) throw new Error(res.error || t("errorConfirmPayment"))
      setResult(res.data as unknown as ConfirmationResult); setStep("success")
    } catch (e: unknown) { setError(e instanceof Error ? e.message : t("errorConfirmPayment")); setStep("error") }
    finally { setLoading(false) }
  }

  const startMonitor = async (ref: PublicKey, req: MiningRequestResponse) => {
    setMonitoring(true); abortRef.current = false
    try {
      const conn = new Connection(SOLANA_RPC, "confirmed")
      const sig = await findTransactionByReference(conn, ref, { interval: 2500, timeout: 300000, commitment: "confirmed" })
      if (abortRef.current) return
      if (!sig) { setError(t("errorPaymentTimeout")); setStep("error"); return }
      setTxSig(sig)
      const sender = await extractSenderFromTransaction(conn, sig)
      if (!sender) { setError(t("errorExtractPayerContact")); setStep("error"); return }
      setQrPayer(sender); setStep("confirming"); await confirmPayment(req, sig, sender)
    } catch (e: unknown) { if (!abortRef.current) { setError(e instanceof Error ? e.message : t("errorMonitorFailed")); setStep("error") } }
    finally { setMonitoring(false) }
  }

  const handleSubmit = async () => {
    const qty = parseFloat(amount)
    if (!amount || qty <= 0) { setError(t("errorInvalidAmountSymbol", { symbol: "MCC" })); return }
    setLoading(true); setError("")
    try {
      try { const pf = await getPublicMiningPreflight(); if (pf.success && pf.data && !pf.data.ready) { setError(pf.data.reason || "Mining system temporarily unavailable."); setStep("error"); setLoading(false); return } } catch {}
      const res = await createPublicMiningRequest({ wallet_address: connected && publicKey ? publicKey.toBase58() : undefined, mcc_amount: qty * 1_000_000_000, stablecoin_type: stablecoin, token_type: 'mcc' })
      if (!res.success || !res.data) throw new Error(res.error || t("errorCreateRequest"))
      setMiningReq(res.data)
      const { reference } = createPaymentReference(); setPayRef(reference)
      const url = createSolanaPayUrl({ recipient: STABLECOIN_VAULTS[stablecoin], amount: res.data.usdc_amount_with_discount / 1_000_000, splToken: STABLECOIN_MINTS[stablecoin], reference, label: "Microcosm Mining", message: `Mine ${amount} MCC` })
      setPayUrl(url)
      if (isMobile) { setStep("qrPayment"); startMonitor(reference, res.data) } else { setStep("paymentMethod") }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : t("errorMintRequest")); setStep("error") }
    finally { setLoading(false) }
  }

  const handleBrowserPay = () => {
    if (!connected || !publicKey) { setError(t("errorConnectWalletShort")); return }
    if (pricing && balance !== null && balance < pricing.discounted) { setError(t("errorBalanceInsufficient", { symbol: ci.symbol, required: pricing.discounted.toFixed(2), current: balance.toFixed(2), otherCoin: stablecoin === 'usdc' ? 'USDT' : 'USDC' })); return }
    setStep("payment")
    if (miningReq) execTransfer(miningReq)
  }

  const execTransfer = async (req: MiningRequestResponse) => {
    if (!publicKey || !sendTransaction) throw new Error(t("errorWalletNotConnected"))
    setLoading(true)
    try {
      const conn = new Connection(SOLANA_RPC, "confirmed")
      const tx = new Transaction()
      const raw = req.usd_amount_with_discount || req.usdc_amount_with_discount
      tx.add(createTransferInstruction(getAssociatedTokenAddressSync(STABLECOIN_MINTS[stablecoin], publicKey), STABLECOIN_VAULTS[stablecoin], publicKey, raw))
      const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash()
      tx.recentBlockhash = blockhash; tx.feePayer = publicKey
      const sig = await sendTransaction(tx, conn)
      setTxSig(sig); setStep("confirming")
      await conn.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, 'finalized')
      await confirmPayment(req, sig, publicKey.toBase58())
    } catch (e: unknown) { setError(e instanceof Error ? e.message : t("errorTransferFailed", { symbol: ci.symbol })); setStep("error"); throw e }
    finally { setLoading(false) }
  }

  if (!isOpen) return null

  const TxLink = ({ sig, label }: { sig: string; label?: string }) => (
    <a href={`https://solscan.io/tx/${sig}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline">
      {label || `${sig.slice(0, 16)}...${sig.slice(-16)}`} <ExternalLink className="w-3 h-3" />
    </a>
  )

  const ErrBox = () => error ? <div className="flex items-center gap-2 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-500 text-sm"><AlertCircle className="w-4 h-4" />{error}</div> : null

  const OrderSummary = () => miningReq ? (
    <div className="p-3 rounded bg-neutral-800 border border-neutral-700 space-y-2 text-sm">
      <div className="flex justify-between"><span className="text-neutral-400">{t("mintLabel")}</span><span className="font-bold text-white">{miningReq.mcc_amount / 1_000_000_000} MCC</span></div>
      <div className="flex justify-between"><span className="text-neutral-400">{t("payLabel")}</span><span className="text-cyan-400 font-bold font-mono">{payAmt} {ci.symbol}</span></div>
    </div>
  ) : null

  return (
    <div className="fixed inset-0 z-50 flex items-end 2xs:items-center justify-center bg-black/50 backdrop-blur-sm font-mono">
      <div className="relative w-full max-w-2xl mx-0 2xs:mx-3 xs:mx-4 max-h-[95vh] 2xs:max-h-[90vh] overflow-y-auto rounded-t-2xl 2xs:rounded-xl">
        <TerminalCard filename="mcc_minting.json">
          <div className="flex items-center justify-between mb-4 2xs:mb-5 xs:mb-6">
            <div>
              <h2 className="text-base 2xs:text-lg xs:text-xl font-bold text-white mb-1">{t("publicTitle", { symbol: "MCC" })}</h2>
              <p className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider">{t("publicSubtitleMcc")}</p>
            </div>
            <button onClick={handleClose} disabled={loading} className="text-neutral-400 hover:text-white transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"><X className="w-5 h-5" /></button>
          </div>

          {step === "input" && (
            <div className="space-y-3 2xs:space-y-4">
              {ratioInfo && (
                <div className="p-2 2xs:p-3 rounded bg-neutral-800 border border-neutral-700">
                  <div className="grid grid-cols-3 gap-2 2xs:gap-4 text-xs 2xs:text-sm">
                    <div><div className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider mb-1">{t("currentPhase")}</div><div className="text-white font-bold font-mono">Phase {ratioInfo.current_stage}</div></div>
                    <div><div className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider mb-1 flex items-center gap-1">{t("techBonus")}<span className="cursor-help text-neutral-500 hover:text-cyan-400" title={t("techBonusTooltip")}>?</span></div><div className="text-cyan-400 font-bold font-mono">0%</div></div>
                    <div><div className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider mb-1">{t("usdPerMcc")}</div><div className="text-cyan-400 font-bold font-mono">{(ratioInfo.usdc_per_mcc * 4).toFixed(4)}</div></div>
                  </div>
                </div>
              )}
              <div className="p-3 2xs:p-4 rounded bg-cyan-400/20 border border-cyan-400/50">
                <div className="flex items-start gap-2 2xs:gap-3">
                  <AlertCircle className="w-4 h-4 2xs:w-5 2xs:h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div><div className="text-cyan-400 font-bold text-xs 2xs:text-sm mb-1">{t("solanaOnly")}</div><p className="text-neutral-300 text-[10px] 2xs:text-xs leading-relaxed">{t("solanaOnlyDescPublic")}</p></div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-neutral-400 tracking-wider mb-2">{t("paymentMethod")} <span className="text-neutral-500">({t("paymentMethodHintPublic")})</span></label>
                <div className="relative">
                  <button type="button" onClick={() => setShowDropdown(!showDropdown)} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded text-white flex items-center justify-between hover:border-neutral-500 transition-colors">
                    <span className="flex items-center gap-2"><span>{ci.icon}</span><span>{ci.symbol}</span><span className="text-neutral-400 text-sm">({ci.name})</span></span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-neutral-900 border border-neutral-700 rounded shadow-lg">
                      {(Object.keys(COIN_INFO) as StablecoinType[]).map((t2) => (
                        <button key={t2} type="button" onClick={() => { setStablecoin(t2); setShowDropdown(false) }}
                          className={`w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-neutral-800 transition-colors ${stablecoin === t2 ? 'bg-neutral-800 text-cyan-400' : 'text-white'}`}>
                          <span>{COIN_INFO[t2].icon}</span><span>{COIN_INFO[t2].symbol}</span><span className="text-neutral-400 text-sm">({COIN_INFO[t2].name})</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {connected && <div className="mt-2 flex items-center justify-between text-xs"><span className="text-neutral-400">{t("stablecoinSettlement", { symbol: ci.symbol })}</span><span className={`font-medium ${balance === null ? 'text-neutral-400' : balance === 0 ? 'text-red-400' : 'text-white'}`}>{loadingBal ? t("loading") : balance === null ? t("balanceUnknown") : t("balance", { amount: balance.toFixed(2), symbol: ci.symbol })}</span></div>}
              </div>
              <div>
                <label className="block text-xs text-neutral-400 tracking-wider mb-2">{t("mintAmountLabel", { symbol: "MCC" })}</label>
                <input type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t("inputPlaceholder", { symbol: "MCC" })} className="w-full px-3 2xs:px-4 py-3 bg-neutral-800 border border-neutral-600 rounded text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400 text-base" min="0" step="0.01" />
              </div>
              {pricing && (
                <div className="p-4 rounded bg-white/10 border-neutral-700 border space-y-3">
                  <div><div className="text-xs text-neutral-400 tracking-wider mb-2">{t("estimatedPayment")}</div><div className="text-2xl font-bold text-cyan-400 font-mono">{pricing.discounted.toFixed(2)} USD</div>{pricing.discount > 0 && <div className="text-xs text-neutral-400 mt-2">{t("originalPricePublic", { amount: pricing.full.toFixed(2), bonus: String(pricing.discount) })}</div>}</div>
                  <div className="pt-3 border-t border-neutral-700"><div className="flex justify-between items-center"><span className="text-xs text-neutral-400 tracking-wider">{t("youWillReceive")}</span><span className="text-lg font-bold font-mono text-white">{parseFloat(amount).toFixed(4)} MCC</span></div><div className="text-xs text-neutral-400 mt-1">{t("tokenToPayerWallet", { symbol: "MCC" })}</div></div>
                </div>
              )}
              <ErrBox />
              <div className="flex gap-2 2xs:gap-3">
                <button onClick={handleClose} className="flex-1 px-3 2xs:px-4 py-3 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent rounded transition-colors text-sm 2xs:text-base min-h-[44px]">{t("cancel")}</button>
                <button onClick={handleSubmit} disabled={loading || !amount || parseFloat(amount) <= 0} className="flex-1 px-3 2xs:px-4 py-3 bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm 2xs:text-base min-h-[44px]">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}{loading ? t("processing") : t("confirmMintSymbol", { symbol: "MCC" })}
                </button>
              </div>
            </div>
          )}

          {step === "paymentMethod" && miningReq && (
            <div className="space-y-4">
              <OrderSummary />
              <div className="p-3 rounded bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300">{t("stablecoinReminder", { symbol: ci.symbol })}</div>
              <div className="text-xs text-neutral-400 tracking-wider uppercase mb-1">{t("selectPaymentMethod")}</div>
              <button onClick={() => { if (payRef && miningReq) { setStep("qrPayment"); startMonitor(payRef, miningReq) } }} className="w-full p-4 rounded border-2 border-cyan-400/50 bg-cyan-400/5 hover:bg-cyan-400/10 hover:border-cyan-400/70 transition-all text-left group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-cyan-400/20 flex items-center justify-center flex-shrink-0"><QrCode className="w-6 h-6 text-cyan-400" /></div>
                  <div className="flex-1"><div className="flex items-center gap-2"><span className="text-white font-bold text-sm">{t("mobileQrScan")}</span><span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-400/20 text-cyan-400 tracking-wider">{t("recommended")}</span></div><p className="text-neutral-400 text-xs mt-1">{t("mobileQrDesc")}</p></div>
                  <Smartphone className="w-5 h-5 text-neutral-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                </div>
              </button>
              <button onClick={handleBrowserPay} disabled={!connected} className="w-full p-4 rounded border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 hover:border-neutral-600 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-neutral-700/50 flex items-center justify-center flex-shrink-0"><Monitor className="w-6 h-6 text-neutral-400" /></div>
                  <div className="flex-1"><span className="text-neutral-300 font-bold text-sm">{t("browserExtension")}</span><p className="text-neutral-500 text-xs mt-1">{connected ? t("browserExtConnectedPublic") : t("browserExtNotConnectedPublic")}</p></div>
                </div>
              </button>
              <ErrBox />
              <button onClick={() => { setStep("input"); setError("") }} className="w-full px-4 py-2 text-neutral-400 hover:text-neutral-300 text-sm transition-colors">&larr; {t("goBack")}</button>
            </div>
          )}

          {step === "qrPayment" && miningReq && payUrl && (
            <div className="space-y-3 2xs:space-y-4">
              <TerminalBadge variant="info">{t("waitingQrPayment")}</TerminalBadge>
              <OrderSummary />
              <div className="p-2 2xs:p-3 rounded bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 text-xs 2xs:text-sm"><Shield className="w-4 h-4 text-amber-400 flex-shrink-0" /><span className="text-amber-400 font-bold">{t("confirmPayWithSymbol", { symbol: ci.symbol })}</span></div>
                <p className="text-neutral-400 text-[10px] 2xs:text-xs mt-1 ml-6">{t("insufficientBalance", { symbol: ci.symbol })}<button onClick={() => { abortRef.current = true; setStep("input"); setMonitoring(false) }} className="text-cyan-400 hover:underline ml-1">{t("switchToken")}</button></p>
              </div>

              <div className="flex flex-col items-center space-y-3 2xs:space-y-4">
                <p className="text-neutral-400 text-xs 2xs:text-sm text-center">{t("scanQrToPayDesktop")}</p>
                <div className="bg-white p-3 2xs:p-4 xs:p-5 rounded-xl">
                  <QRCodeSVG value={payUrl} size={200} level="H" includeMargin={false} className="w-[160px] h-[160px] 2xs:w-[180px] 2xs:h-[180px] xs:w-[220px] xs:h-[220px] sm:w-[280px] sm:h-[280px]" imageSettings={{ src: "/mcc-logo-40.png", x: undefined, y: undefined, height: 40, width: 40, excavate: true }} />
                </div>
                <div className="flex items-center gap-2 text-neutral-400 text-[10px] 2xs:text-xs"><Loader2 className="w-3 h-3 animate-spin" />{t("waitingQrScan")}</div>
              </div>

              {monitoring && <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs 2xs:text-sm py-2"><Loader2 className="w-4 h-4 animate-spin" />{t("monitoringOnchain")}</div>}
              <button onClick={() => { abortRef.current = true; setStep(isMobile ? "input" : "paymentMethod"); setMonitoring(false); setError("") }} className="w-full px-4 py-2 text-neutral-400 hover:text-neutral-300 text-xs 2xs:text-sm transition-colors min-h-[44px]">&larr; {t("goBack")}</button>
            </div>
          )}

          {step === "payment" && miningReq && (
            <div className="space-y-4">
              <TerminalBadge variant="info">{t("waitingPayment")}</TerminalBadge>
              <div className="p-3 rounded bg-neutral-800 border border-neutral-700 text-sm"><div className="flex justify-between"><span className="text-neutral-400">{t("payLabel")}</span><span className="text-cyan-400 font-bold font-mono">{payAmt} {ci.symbol}</span></div></div>
              <div className="flex items-center justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>
              <p className="text-center text-neutral-400 text-sm">{t("processingTransferGeneric")}</p>
            </div>
          )}

          {step === "confirming" && txSig && (
            <div className="space-y-4">
              <TerminalBadge variant="warning">{t("verifying")}</TerminalBadge>
              <div className="flex items-center justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>
              <p className="text-center text-neutral-400 text-sm mb-2">{t("verifyingTransaction")}</p>
              <div className="p-3 rounded bg-neutral-800 border border-neutral-700"><div className="text-xs text-neutral-400 tracking-wider mb-1">{t("txSignature")}</div><div className="font-mono text-xs text-cyan-400 break-all">{txSig.slice(0, 16)}...{txSig.slice(-16)}</div><TxLink sig={txSig} label={t("viewOnExplorer")} /></div>
            </div>
          )}

          {step === "success" && result && (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8"><div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center"><CheckCircle2 className="w-8 h-8 text-white" /></div></div>
              <h3 className="text-xl font-bold text-center text-white">{t("mintSuccess")}</h3>
              <div className="p-4 rounded bg-white/10 border-neutral-700 border space-y-3">
                <div className="text-center"><div className="text-xs text-neutral-400 tracking-wider mb-1">{t("youReceived")}</div><div className="text-3xl font-bold font-mono text-white">+{(result.mcc_distributed.user / 1_000_000_000).toLocaleString()} MCC</div>{qrPayer && <div className="text-xs text-neutral-400 mt-2">{t("sentToAddress", { address: `${qrPayer.slice(0, 8)}...${qrPayer.slice(-6)}` })}</div>}</div>
                <div className="pt-3 border-t border-neutral-700"><div className="text-xs text-neutral-400 tracking-wider mb-1">{t("paymentTxGeneric")}</div><TxLink sig={txSig} /></div>
              </div>
              {result.onchain_tx_signature && <div className="p-4 rounded bg-neutral-800 border border-neutral-700 space-y-2"><div className="text-xs text-neutral-400 tracking-wider">{t("onchainDistribution")}</div><TxLink sig={result.onchain_tx_signature} /></div>}
              <div className="p-3 rounded bg-cyan-400/20 border border-cyan-400/50 text-center"><p className="text-xs text-cyan-400">{t("registerHint")}</p></div>
              <button onClick={handleClose} className="w-full px-4 py-3 bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-colors">{t("done")}</button>
            </div>
          )}

          {step === "error" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8"><div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center"><AlertCircle className="w-8 h-8 text-red-500" /></div></div>
              <h3 className="text-xl font-bold text-center text-red-500">{t("mintFailed")}</h3>
              <div className="p-4 rounded bg-red-500/20 border border-red-500/50"><p className="text-red-500 text-sm whitespace-pre-line">{error}</p></div>
              <button onClick={handleClose} className="w-full px-4 py-3 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent rounded transition-colors">{t("close")}</button>
            </div>
          )}
        </TerminalCard>
      </div>
    </div>
  )
}
