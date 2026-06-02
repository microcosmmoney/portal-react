// AI-generated · AI-managed · AI-maintained
"use client"

import { X, UserPlus, ArrowRight } from "lucide-react"
import { TerminalCard, TerminalBadge } from "../ui/terminal"

interface RegistrationPromptProps {
  isOpen: boolean
  onClose: () => void
  onRegister: () => void
  onSkip: () => void
}

export default function RegistrationPrompt({
  isOpen,
  onClose,
  onRegister,
  onSkip,
}: RegistrationPromptProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-mono">
      <div className="relative w-full max-w-lg mx-4">
        <TerminalCard filename="registration_prompt.json">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-cyan-400/20 border border-cyan-400/50">
                <UserPlus className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">\u5efa\u8bae\u6ce8\u518c\u5e73\u53f0\u8d26\u53f7</h2>
                <p className="text-xs text-neutral-400 tracking-wider">\u6ce8\u518c\u540e\u53ef\u89e3\u9501\u66f4\u591a\u529f\u80fd</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 rounded bg-neutral-800 border border-neutral-700">
              <TerminalBadge variant="success">1</TerminalBadge>
              <div>
                <div className="text-sm text-white font-medium">\u5b8c\u6574\u94f8\u9020\u8bb0\u5f55\u4e0e\u7b49\u7ea7\u5347\u7ea7</div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  \u94f8\u9020 21 \u5929\u81ea\u52a8\u5347\u7ea7\u4e3a\u77ff\u5de5\uff0c\u89e3\u9501\u9886\u5730\u5f52\u5c5e
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded bg-neutral-800 border border-neutral-700">
              <TerminalBadge variant="success">2</TerminalBadge>
              <div>
                <div className="text-sm text-white font-medium">\u79d1\u6280\u52a0\u6210</div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  \u6700\u9ad8 100% \u4ea7\u51fa\u52a0\u6210\uff0c\u5927\u5e45\u63d0\u5347\u6316\u77ff\u6536\u76ca
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded bg-neutral-800 border border-neutral-700">
              <TerminalBadge variant="success">3</TerminalBadge>
              <div>
                <div className="text-sm text-white font-medium">\u9886\u5730\u5f52\u5c5e\u4e0e\u751f\u6001\u6743\u76ca</div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  \u52a0\u5165\u7a7a\u95f4\u7ad9\uff0c\u53c2\u4e0e\u91d1\u5e93\u5206\u914d\uff0c\u83b7\u5f97 MCD \u6bcf\u65e5\u6536\u76ca
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={onSkip}
              className="flex-1 px-4 py-3 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent rounded transition-colors text-sm"
            >
              \u8df3\u8fc7\uff0c\u76f4\u63a5\u94f8\u9020
            </button>
            <button
              onClick={onRegister}
              className="flex-1 px-4 py-3 bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-colors text-sm flex items-center justify-center gap-2"
            >
              \u53bb\u6ce8\u518c/\u767b\u5f55 <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center">
            <p className="text-[10px] text-neutral-500">
              \u6570\u636e\u4e0d\u4f1a\u4e22\u5931 — \u6ce8\u518c\u540e\u7ed1\u5b9a\u540c\u4e00\u94b1\u5305\u5373\u53ef\u7ee7\u627f\u6240\u6709\u94f8\u9020\u8bb0\u5f55
            </p>
          </div>
        </TerminalCard>
      </div>
    </div>
  )
}
