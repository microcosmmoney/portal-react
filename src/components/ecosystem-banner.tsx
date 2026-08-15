'use client'

import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { useTranslations } from '../i18n-context'

const SQUARE_LOGO = 'https://microcosm.money/brand/microcosm-square.png'
const HOMEPAGE = 'https://microcosm.money'
const OWN_HOSTS = ['microcosm.money', 'www.microcosm.money', 'm.microcosm.money']

export interface MicrocosmEcosystemBannerProps {
  projectName?: string
  homepage?: string
  logoUrl?: string
  className?: string
  autoHideOnOwnHost?: boolean
}

export function useIsThirdPartyHost(): boolean {
  const [thirdParty, setThirdParty] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const host = window.location.hostname.toLowerCase()
    setThirdParty(!OWN_HOSTS.includes(host) && !host.endsWith('.microcosm.money') && host !== 'localhost')
  }, [])
  return thirdParty
}

export function MicrocosmEcosystemBanner({
  projectName,
  homepage = HOMEPAGE,
  logoUrl = SQUARE_LOGO,
  className = '',
  autoHideOnOwnHost = true,
}: MicrocosmEcosystemBannerProps) {
  const t = useTranslations('ecoBanner')
  const isThirdParty = useIsThirdPartyHost()

  if (autoHideOnOwnHost && !isThirdParty) return null

  const slogan = t('slogan', 'Building the Web3 Operating System for On-Chain Autonomous Economy')
  const intro = projectName
    ? t(
        'intro',
        'Microcosm is the main platform of the ecosystem this platform belongs to, providing the unified account system, the MCC token and on-chain asset services. {project} is a key member of the Microcosm ecosystem, and this section shows your assets and entitlements within it.',
        { project: projectName },
      )
    : t(
        'introGeneric',
        'Microcosm is the main platform of the ecosystem this platform belongs to, providing the unified account system, the MCC token and on-chain asset services. This section shows your assets and entitlements within it.',
      )
  const visit = t('visit', 'Visit Microcosm')

  return (
    <div
      className={`mb-4 md:mb-6 rounded-lg border border-cyan-500/25 bg-gradient-to-r from-cyan-500/[0.07] to-transparent px-4 py-3 md:px-5 md:py-4 ${className}`}
      data-microcosm-ecosystem-banner=""
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <img src={logoUrl} alt="Microcosm" className="w-8 h-8 rounded shrink-0 mt-0.5" loading="lazy" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-bold text-sm tracking-wider text-white">
                M<span className="text-cyan-400">I</span>CROCOSM
              </span>
              <span className="text-[11px] md:text-xs text-cyan-400/90">{slogan}</span>
            </div>
            <p className="mt-1 text-xs md:text-sm text-neutral-400 leading-relaxed break-words">{intro}</p>
          </div>
        </div>
        <a
          href={homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-500/20 hover:border-cyan-400"
        >
          {visit}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}

export default MicrocosmEcosystemBanner
