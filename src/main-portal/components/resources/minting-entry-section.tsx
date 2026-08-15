// AI-generated · AI-managed · AI-maintained
"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Pickaxe, Coins, UserPlus, Wallet, X, Link2 } from "lucide-react";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { getMiningRatio } from "../../lib/api";
import { invalidateWalletCache } from "../../lib/api/blockchain";
import type { MiningRatioInfo } from "../../lib/types/api";
import RegistrationPrompt from "./registration-prompt";
import PublicMiningModal from "./public-mining-modal";

type TokenType = 'mcc' | 'mcd';

export function MintingEntrySection() {
  const { connected, publicKey } = useSolanaWallet();
  const [ratioInfo, setRatioInfo] = useState<MiningRatioInfo | null>(null);
  const [showRegistrationPrompt, setShowRegistrationPrompt] = useState(false);
  const [showMiningModal, setShowMiningModal] = useState(false);
  const [showConnectWalletStep, setShowConnectWalletStep] = useState(false);
  const [activeTokenType, setActiveTokenType] = useState<TokenType>('mcc');

  const loadRatioInfo = useCallback(async () => {
    try {
      const response = await getMiningRatio();
      if (response.success && response.data) {
        setRatioInfo(response.data);
      }
    } catch (err) {
      console.error("Failed to load mining ratio:", err);
    }
  }, []);

  useEffect(() => {
    loadRatioInfo();
  }, [loadRatioInfo]);

  const handleMintClick = (tokenType: TokenType) => {
    setActiveTokenType(tokenType);
    setShowRegistrationPrompt(true);
  };

  const handleRegistrationSkip = () => {
    setShowRegistrationPrompt(false);
    setShowMiningModal(true);
  };

  const handleRegistrationRegister = () => {
    setShowRegistrationPrompt(false);
    window.open("/login", "_blank");
  };

  const handleStartMining = () => {
    setShowConnectWalletStep(false);
    setShowMiningModal(true);
  };

  const mccPrice = ratioInfo
    ? (ratioInfo.usdc_per_mcc * 4).toFixed(2)
    : "—";

  return (
    <section
      id="minting"
      aria-labelledby="minting-title"
      className="bg-neutral-900/30 py-20 md:py-24 px-4 sm:px-6"
    >
      <div className="max-w-[1400px] mx-auto">
        <header className="text-center mb-12 md:mb-16">
          <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-cyan-400 mb-3 md:mb-4">
            X402 MINTING
          </p>
          <h2
            id="minting-title"
            className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-4 md:mb-5 text-balance"
          >
            \u94f8\u9020 MCC / MCD
          </h2>
          <div className="max-w-3xl mx-auto space-y-2">
            <p className="font-mono text-sm sm:text-base text-neutral-400 text-balance">
              \u57fa\u4e8e X402 \u534f\u8bae\u7684\u65e0\u9700\u767b\u5f55\u94f8\u9020 — \u8fde\u63a5\u94b1\u5305\u5373\u53ef\u94f8\u9020\uff0c\u94fe\u4e0a\u76f4\u63a5\u7ed3\u7b97
            </p>
            <p className="font-mono text-xs sm:text-sm text-neutral-500 text-balance">
              \u9996\u6b21\u94f8\u9020\u5c06\u81ea\u52a8\u9884\u6ce8\u518c\u4e3a\u5e73\u53f0\u7528\u6237\uff08\u63a2\u77ff\u8005\u7ea7\u522b\uff09\uff0c\u540e\u7eed\u767b\u5f55\u65f6\u7ed1\u5b9a\u540c\u4e00\u94b1\u5305\u5373\u53ef\u7ee7\u627f\u8eab\u4efd\u4e0e\u8d44\u4ea7
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <Card className="bg-neutral-900 border-neutral-700 rounded-lg blockchain-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Pickaxe className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                \u94f8\u9020 MCC
              </CardTitle>
              <CardDescription className="text-neutral-400 text-sm">
                Microcosm Coin · X402 \u534f\u8bae\u652f\u4ed8 · \u5e02\u573a\u5b9a\u4ef7
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-neutral-400">\u5f53\u524d\u94f8\u9020\u4ef7</span>
                  <span className="font-mono text-sm text-cyan-400 tabular-nums font-bold">
                    {mccPrice} USD/MCC
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-neutral-400">\u5b9a\u4ef7\u65b9\u5f0f</span>
                  <span className="font-mono text-xs text-neutral-400">base_price × 4</span>
                </div>
                {ratioInfo && (
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-neutral-400">\u5f53\u524d\u9636\u6bb5</span>
                    <span className="font-mono text-xs text-neutral-400">
                      Phase {ratioInfo.current_stage} · \u6548\u7387 {ratioInfo.ratio}%
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-neutral-400">\u79d1\u6280\u52a0\u6210</span>
                  <span className="font-mono text-xs text-cyan-400">10% ~ 100%</span>
                </div>
              </div>
              <button
                onClick={() => handleMintClick('mcc')}
                className="w-full py-3 rounded-lg font-mono text-sm font-medium transition-colors duration-200 bg-cyan-400/20 text-cyan-400 border border-cyan-400/40 hover:bg-cyan-400/30 hover:border-cyan-400/60 cursor-pointer"
              >
                \u94f8\u9020 MCC
              </button>
              <p className="font-mono text-[10px] text-neutral-500 text-center">
                X402 \u534f\u8bae · 100% \u8d44\u91d1\u6ce8\u5165\u8f6e\u56de\u6c60 · \u4f34\u751f\u77ff\u540c\u6b65\u8fdb\u884c
              </p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-700 rounded-lg blockchain-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Coins className="w-5 h-5 text-cyan-300" aria-hidden="true" />
                \u94f8\u9020 MCD
              </CardTitle>
              <CardDescription className="text-neutral-400 text-sm">
                Microcosm Dollar · X402 \u534f\u8bae\u652f\u4ed8 · \u56fa\u5b9a\u6c47\u7387
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-neutral-400">\u5f53\u524d\u94f8\u9020\u4ef7</span>
                  <span className="font-mono text-sm text-cyan-300 tabular-nums font-bold">1.00 USD/MCD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-neutral-400">\u5b9a\u4ef7\u65b9\u5f0f</span>
                  <span className="font-mono text-xs text-neutral-400">\u56fa\u5b9a\u6c47\u7387 (1:1)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-neutral-400">\u7528\u9014</span>
                  <span className="font-mono text-xs text-neutral-400">\u767d\u540d\u5355\u9879\u76ee\u6d88\u8d39</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-neutral-400">\u52a0\u6210</span>
                  <span className="font-mono text-xs text-neutral-500">\u65e0\u52a0\u6210</span>
                </div>
              </div>
              <button
                onClick={() => alert('MCD \u6682\u672a\u5f00\u653e\u516c\u5171\u94f8\u9020。\n\nMCD \u76ee\u524d\u901a\u8fc7\u9886\u5730\u91d1\u5e93\u6bcf\u65e5\u514d\u8d39\u53d1\u653e\u7ed9\u77ff\u5de5。\n\u52a0\u5165\u9886\u5730\u6210\u4e3a\u77ff\u5de5\uff08Miner\uff09\uff0c\u5373\u53ef\u6bcf\u5929\u514d\u8d39\u83b7\u5f97 MCD \u5206\u914d。')}
                className="w-full py-3 rounded-lg font-mono text-sm font-medium transition-colors duration-200 bg-neutral-700/50 text-neutral-500 border border-neutral-600/40 cursor-pointer hover:bg-neutral-700/70"
              >
                \u6682\u672a\u5f00\u653e
              </button>
              <p className="font-mono text-[10px] text-neutral-500 text-center">
                MCD \u901a\u8fc7\u9886\u5730\u91d1\u5e93\u6bcf\u65e5\u514d\u8d39\u53d1\u653e · \u52a0\u5165\u9886\u5730\u6210\u4e3a\u77ff\u5de5\u5373\u53ef\u83b7\u5f97
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="border border-neutral-700 bg-neutral-900 rounded-lg p-5 md:p-6 blockchain-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-cyan-400/10 border border-cyan-400/20 flex-shrink-0">
              <UserPlus className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <h3 className="font-sans font-medium text-base text-white mb-1">
                  X402 \u9884\u6ce8\u518c\u673a\u5236
                </h3>
                <p className="font-mono text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  \u65e0\u9700\u6ce8\u518c\u5373\u53ef\u94f8\u9020 — \u7cfb\u7edf\u81ea\u52a8\u4e3a\u9996\u6b21\u94f8\u9020\u7684\u94b1\u5305\u521b\u5efa\u5e73\u53f0\u8eab\u4efd
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-cyan-400/15 border border-cyan-400/25 flex-shrink-0 mt-0.5">
                    <span className="font-mono text-xs font-bold text-cyan-400">1</span>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-neutral-300 font-medium">\u94b1\u5305\u76f4\u8fde</p>
                    <p className="font-mono text-[10px] text-neutral-500 mt-0.5">
                      \u8fde\u63a5 Solana \u94b1\u5305\u5373\u53ef\u94f8\u9020\uff0c\u94f8\u9020\u8bb0\u5f55\u81ea\u52a8\u4fdd\u5b58
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-cyan-400/15 border border-cyan-400/25 flex-shrink-0 mt-0.5">
                    <span className="font-mono text-xs font-bold text-cyan-400">2</span>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-neutral-300 font-medium">Miner</p>
                    <p className="font-mono text-[10px] text-neutral-500 mt-0.5">
                      Registration = Miner
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-cyan-300/15 border border-cyan-300/25 flex-shrink-0 mt-0.5">
                    <span className="font-mono text-xs font-bold text-cyan-300">3</span>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-neutral-300 font-medium">\u8eab\u4efd\u7ee7\u627f</p>
                    <p className="font-mono text-[10px] text-neutral-500 mt-0.5">
                      \u540e\u7eed\u767b\u5f55\u6ce8\u518c\u65f6\u7ed1\u5b9a\u540c\u4e00\u94b1\u5305\uff0c\u7ee7\u627f\u8eab\u4efd\u4e0e\u8d44\u4ea7
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RegistrationPrompt
        isOpen={showRegistrationPrompt}
        onClose={() => setShowRegistrationPrompt(false)}
        onRegister={handleRegistrationRegister}
        onSkip={handleRegistrationSkip}
      />

      {showConnectWalletStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-mono">
          <div className="relative w-full max-w-sm mx-4 bg-neutral-900 border border-neutral-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">
                  <Wallet className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">\u8fde\u63a5\u94b1\u5305</h3>
                  <p className="text-xs text-neutral-400">\u94f8\u9020\u524d\u9700\u8981\u8fde\u63a5 Solana \u94b1\u5305</p>
                </div>
              </div>
              <button
                onClick={() => setShowConnectWalletStep(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-neutral-800 rounded-lg p-3 border border-neutral-700">
                <div className="flex items-center gap-2">
                  <Link2 className={`w-4 h-4 ${connected ? "text-white" : "text-neutral-500"}`} />
                  <span className="text-sm text-neutral-300">
                    {connected && publicKey
                      ? `\u5df2\u8fde\u63a5: ${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-4)}`
                      : "\u672a\u8fde\u63a5"}
                  </span>
                </div>
                <WalletMultiButton className="!bg-cyan-700 hover:!bg-cyan-600 !h-9 !rounded-md !text-sm" />
              </div>

              <button
                onClick={handleStartMining}
                disabled={!connected || !publicKey}
                className={`w-full py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  connected && publicKey
                    ? "bg-cyan-700 hover:bg-cyan-600 text-white cursor-pointer"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                }`}
              >
                {connected && publicKey ? "\u5f00\u59cb\u94f8\u9020" : "\u8bf7\u5148\u8fde\u63a5\u94b1\u5305"}
              </button>

              {!connected && (
                <p className="text-xs text-neutral-500 text-center">
                  \u70b9\u51fb\u4e0a\u65b9\u6309\u94ae\u9009\u62e9\u94b1\u5305\uff0c\u5728\u5f39\u51fa\u7a97\u53e3\u4e2d\u786e\u8ba4\u8fde\u63a5
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <PublicMiningModal
        isOpen={showMiningModal}
        onClose={() => setShowMiningModal(false)}
        onSuccess={async () => {
          loadRatioInfo()
          const wallet = publicKey?.toBase58()
          if (wallet) {
            invalidateWalletCache(wallet, 'mining').catch(() => {})
          }
        }}
      />
    </section>
  );
}
