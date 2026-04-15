// AI-generated · AI-managed · AI-maintained
"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, ShieldAlert } from "lucide-react"
import { useTranslations } from "next-intl"

const TRUSTED_DOMAINS = [
  "microcosm.money",
  "m.microcosm.money",
  "www.microcosm.money",
  "localhost",
  "127.0.0.1",
]

export function DomainVerificationBar() {
  const t = useTranslations("security")
  const [hostname, setHostname] = useState("")
  const [isTrusted, setIsTrusted] = useState(true)

  useEffect(() => {
    const host = window.location.hostname
    setHostname(host)
    setIsTrusted(TRUSTED_DOMAINS.some(d => host === d || host.endsWith("." + d)))
  }, [])

  if (!hostname) return null

  if (!isTrusted) {
    return (
      <div className="w-full bg-red-900/80 border-b border-red-500 px-4 py-2.5 flex items-center justify-center gap-2 z-50">
        <ShieldAlert className="w-4 h-4 text-red-300 shrink-0" />
        <span className="text-red-100 text-xs sm:text-sm font-medium">
          {t("dangerDomain", { domain: hostname })}
        </span>
      </div>
    )
  }

  return (
    <div className="w-full bg-green-900/30 border-b border-green-500/30 px-4 py-1.5 flex items-center justify-center gap-2">
      <ShieldCheck className="w-3.5 h-3.5 text-green-400 shrink-0" />
      <span className="text-green-300/80 text-[11px] sm:text-xs">
        {t("secureConnection")} <code className="bg-green-900/40 px-1 rounded text-green-300 font-mono">{hostname}</code>
      </span>
    </div>
  )
}
