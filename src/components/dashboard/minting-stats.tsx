// AI-generated · AI-managed · AI-maintained
'use client'

import { useMiningRatio } from '@microcosmmoney/auth-react'

export function MicrocosmMintingStats() {
  const { data, loading } = useMiningRatio()

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg h-full hover:border-cyan-400/50 transition-colors">
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <span className="inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-800 rounded p-3">
                <div className="text-xs text-neutral-400 font-mono tracking-wider mb-1">total_minted</div>
                <div className="text-xl font-bold font-mono text-white">
                  {(data.total_minted ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MCC
                </div>
              </div>
              <div className="bg-neutral-800 rounded p-3">
                <div className="text-xs text-neutral-400 font-mono tracking-wider mb-1">current_rate</div>
                <div className="text-xl font-bold font-mono text-cyan-400">
                  1:{(data.usdc_per_mcc ?? 0).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="bg-neutral-800 rounded p-3">
              <div className="flex justify-between items-center mb-2 text-sm font-mono">
                <span className="text-neutral-400">next_halving</span>
                <span className="text-white">
                  {(Math.ceil((data.total_minted ?? 0) / 100_000_000 + 1) * 100_000_000 - (data.total_minted ?? 0)).toLocaleString('en-US', { maximumFractionDigits: 0 })} MCC
                </span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div
                  className="bg-cyan-400 h-2 rounded-full transition-all"
                  style={{
                    width: `${((data.total_minted ?? 0) % 100_000_000) / 100_000_000 * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-neutral-500 font-mono">
                <span>phase: {data.current_stage ?? 1}</span>
                <span>threshold: 100M</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500 font-mono">
            <span className="text-cyan-400">warning:</span> no minting data
          </div>
        )}
      </div>
    </div>
  )
}
