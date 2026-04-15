'use client'

import { useTranslations } from '../../i18n-context'

export interface MicrocosmVotingPageProps {
  basePath?: string
  onNavigate?: (path: string) => void
}

const VoteIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6" />
    <path d="M14 2v6h6" />
    <path d="M18 21l-3-3 3-3" />
    <path d="M22 18h-6" />
  </svg>
)

const SwordsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
    <line x1="13" y1="19" x2="19" y2="13" />
    <line x1="16" y1="16" x2="20" y2="20" />
    <line x1="19" y1="21" x2="21" y2="19" />
    <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
    <line x1="5" y1="14" x2="9" y2="18" />
    <line x1="7" y1="17" x2="4" y2="20" />
    <line x1="3" y1="19" x2="5" y2="21" />
  </svg>
)

const HeartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
)

const ConstructionIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="6" width="20" height="8" rx="1" />
    <path d="M17 14v7" />
    <path d="M7 14v7" />
    <path d="M17 3v3" />
    <path d="M7 3v3" />
    <path d="M10 14 2.3 6.3" />
    <path d="m14 6 7.7 7.7" />
    <path d="m8 6 8 8" />
  </svg>
)

const TargetIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </svg>
)

const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const CoinsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
)

export function MicrocosmVotingPage({ basePath = '', onNavigate }: MicrocosmVotingPageProps) {
  const t = useTranslations('votingDash')
  return (
    <div className="max-w-7xl mx-auto px-2 py-3 space-y-2 2xs:px-3 2xs:py-4 2xs:space-y-3 sm:px-6 sm:py-6 sm:space-y-6">
      {}
      <div>
        <div className="flex items-center gap-1.5 2xs:gap-2 sm:gap-3 flex-wrap">
          <h1 className="text-base 2xs:text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wider">{t('title', 'Community Voting')}</h1>
          <span className="inline-flex items-center bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 text-[10px] 2xs:text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
            <ConstructionIcon className="w-2.5 h-2.5 2xs:w-3 2xs:h-3 mr-1" />
            {t('underConstruction', 'Under Construction')}
          </span>
        </div>
        <p className="text-[10px] 2xs:text-xs sm:text-sm text-neutral-400">{t('subtitle', 'Token-driven community governance and decision-making mechanism')}</p>
      </div>

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
        <div className="p-2 2xs:p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-xs 2xs:text-sm mb-2 2xs:mb-3 sm:mb-4">
            <TargetIcon className="w-3 h-3 2xs:w-4 2xs:h-4" />
            <span className="tracking-wider">{t('buildGoal', 'Build Goal')}</span>
          </div>
          <div className="space-y-2 2xs:space-y-3 sm:space-y-4">
            <p className="text-neutral-300 text-xs 2xs:text-sm leading-relaxed">
              {t('buildDesc', 'Microcosm community voting system uses a "Capital Voting" mechanism -- users vote with MCC Tokens, making every vote carry real economic weight.')}
            </p>
            <div className="grid grid-cols-1 2xs:grid-cols-2 lg:grid-cols-3 gap-1.5 2xs:gap-2 sm:gap-3">
              <div className="p-2 2xs:p-3 sm:p-4 bg-neutral-800 rounded border border-neutral-700 hover:border-cyan-400/50 transition-colors min-w-0">
                <ShieldIcon className="w-4 h-4 2xs:w-5 2xs:h-5 text-white mb-1 2xs:mb-2" />
                <div className="text-white text-xs 2xs:text-sm font-medium mb-1">{t('antiSybil', 'Anti-Sybil Attack')}</div>
                <div className="text-neutral-500 text-[10px] 2xs:text-xs">{t('antiSybilDesc', 'Voting requires real capital investment, effectively preventing ballot stuffing and fake votes')}</div>
              </div>
              <div className="p-2 2xs:p-3 sm:p-4 bg-neutral-800 rounded border border-neutral-700 hover:border-cyan-400/50 transition-colors min-w-0">
                <CoinsIcon className="w-4 h-4 2xs:w-5 2xs:h-5 text-white mb-1 2xs:mb-2" />
                <div className="text-white text-xs 2xs:text-sm font-medium mb-1">{t('economicGame', 'Economic Game Theory')}</div>
                <div className="text-neutral-500 text-[10px] 2xs:text-xs">{t('economicGameDesc', 'Voters bear economic consequences for their choices, promoting rational decision-making')}</div>
              </div>
              <div className="p-2 2xs:p-3 sm:p-4 bg-neutral-800 rounded border border-neutral-700 hover:border-cyan-400/50 transition-colors min-w-0">
                <UsersIcon className="w-4 h-4 2xs:w-5 2xs:h-5 text-white mb-1 2xs:mb-2" />
                <div className="text-white text-xs 2xs:text-sm font-medium mb-1">{t('communityGov', 'Community Governance')}</div>
                <div className="text-neutral-500 text-[10px] 2xs:text-xs">{t('communityGovDesc', 'Major decisions are made jointly by token-holding community, achieving decentralized governance')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 2xs:gap-2 sm:gap-3">
        {}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors">
          <div className="p-2 2xs:p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-2 2xs:gap-3 mb-2 2xs:mb-3 sm:mb-4">
              <div className="p-1.5 2xs:p-2 rounded bg-neutral-800 shrink-0">
                <SwordsIcon className="w-4 h-4 2xs:w-5 2xs:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-white font-medium text-xs 2xs:text-sm sm:text-base truncate">{t('bettingMode', 'Betting Mode Voting')}</div>
                <span className="inline-block bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 text-[10px] 2xs:text-xs px-2 py-0.5 rounded-full font-medium mt-1">
                  {t('bettingVote', 'Betting Vote')}
                </span>
              </div>
            </div>
            <div className="space-y-2 2xs:space-y-3">
              <p className="text-neutral-400 text-xs 2xs:text-sm leading-relaxed">
                {t('bettingDesc', 'Voters invest MCC into their supported option. After voting ends, funds from the losing side are distributed equally among all voters on the winning side.')}
              </p>
              <div className="p-2 2xs:p-3 bg-neutral-800 rounded border border-neutral-700">
                <div className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider mb-1.5 2xs:mb-2">{t('mechanismLabel', 'Mechanism')}</div>
                <div className="space-y-1.5 text-[10px] 2xs:text-xs text-neutral-400">
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-0.5">1.</span>
                    <span>{t('bettingStep1', 'Users vote for an option with MCC')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-0.5">2.</span>
                    <span>{t('bettingStep2', 'After voting closes, results are tallied, the side with more votes wins')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-0.5">3.</span>
                    <span>{t('bettingStep3', 'MCC from losing side distributed proportionally to winning voters')}</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] 2xs:text-xs text-neutral-500">
                {t('bettingUseCase', 'Use cases: Market predictions, community disputes, direction choices')}
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors">
          <div className="p-2 2xs:p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-2 2xs:gap-3 mb-2 2xs:mb-3 sm:mb-4">
              <div className="p-1.5 2xs:p-2 rounded bg-neutral-800 shrink-0">
                <HeartIcon className="w-4 h-4 2xs:w-5 2xs:h-5 text-red-400" />
              </div>
              <div className="min-w-0">
                <div className="text-white font-medium text-xs 2xs:text-sm sm:text-base truncate">{t('publicWelfareMode', 'Public Welfare Voting')}</div>
                <span className="inline-block bg-white/20 text-white border border-white/30 text-[10px] 2xs:text-xs px-2 py-0.5 rounded-full font-medium mt-1">
                  {t('publicWelfareVote', 'Public Welfare Vote')}
                </span>
              </div>
            </div>
            <div className="space-y-2 2xs:space-y-3">
              <p className="text-neutral-400 text-xs 2xs:text-sm leading-relaxed">
                {t('publicWelfareDesc', 'Regardless of outcome, all MCC invested by voters goes to the foundation pool, funding third-party project development and ecosystem building.')}
              </p>
              <div className="p-2 2xs:p-3 bg-neutral-800 rounded border border-neutral-700">
                <div className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider mb-1.5 2xs:mb-2">{t('mechanismLabel', 'Mechanism')}</div>
                <div className="space-y-1.5 text-[10px] 2xs:text-xs text-neutral-400">
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-0.5">1.</span>
                    <span>{t('welfareStep1', 'Users vote with MCC on an option')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-0.5">2.</span>
                    <span>{t('welfareStep2', 'Results tallied after deadline, majority decision executed')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-0.5">3.</span>
                    <span>{t('welfareStep3', 'All voting funds (both sides) go to the foundation')}</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] 2xs:text-xs text-neutral-500">
                {t('publicUseCase', 'Use cases: Public proposals, ecosystem fund allocation, project support decisions')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
        <div className="p-2 2xs:p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-xs 2xs:text-sm mb-2 2xs:mb-3 sm:mb-4">
            <VoteIcon className="w-3 h-3 2xs:w-4 2xs:h-4" />
            <span className="tracking-wider">{t('votingRules', 'Voting Rules')}</span>
          </div>
          <div className="grid grid-cols-1 2xs:grid-cols-2 gap-1.5 2xs:gap-2 sm:gap-3">
            <div className="p-2 2xs:p-3 sm:p-4 bg-neutral-800 rounded border border-neutral-700 min-w-0">
              <div className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider mb-1 truncate">voting_currency</div>
              <div className="text-white text-xs 2xs:text-sm font-medium truncate">{t('votingCurrency', 'MCC (Microcosm Coin)')}</div>
              <div className="text-neutral-500 text-[10px] 2xs:text-xs mt-1">{t('votingCurrencyDesc', 'Votes use MCC Token, invested funds are locked')}</div>
            </div>
            <div className="p-2 2xs:p-3 sm:p-4 bg-neutral-800 rounded border border-neutral-700 min-w-0">
              <div className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider mb-1 truncate">vote_weight</div>
              <div className="text-white text-xs 2xs:text-sm font-medium truncate">{t('voteWeight', '1 MCC = 1 Vote')}</div>
              <div className="text-neutral-500 text-[10px] 2xs:text-xs mt-1">{t('voteWeightDesc', 'Voting weight proportional to invested amount')}</div>
            </div>
            <div className="p-2 2xs:p-3 sm:p-4 bg-neutral-800 rounded border border-neutral-700 min-w-0">
              <div className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider mb-1 truncate">min_participation</div>
              <div className="text-white text-xs 2xs:text-sm font-medium truncate">{t('minParticipation', 'Miner Level or Above')}</div>
              <div className="text-neutral-500 text-[10px] 2xs:text-xs mt-1">{t('minParticipationDesc', 'Must reach Miner rank to participate in voting')}</div>
            </div>
            <div className="p-2 2xs:p-3 sm:p-4 bg-neutral-800 rounded border border-neutral-700 min-w-0">
              <div className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider mb-1 truncate">foundation_fund</div>
              <div className="text-white text-xs 2xs:text-sm font-medium truncate">{t('foundationFund', 'Support Third-party Projects')}</div>
              <div className="text-neutral-500 text-[10px] 2xs:text-xs mt-1">{t('foundationFundDesc', 'Public welfare voting funds used for ecosystem building')}</div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="text-center py-6 2xs:py-8">
        <ConstructionIcon className="w-8 h-8 2xs:w-10 2xs:h-10 text-neutral-700 mx-auto mb-2 2xs:mb-3" />
        <p className="text-neutral-500 text-xs 2xs:text-sm">{t('comingSoon', 'Community voting feature is under development, stay tuned')}</p>
        <p className="text-neutral-500 text-[10px] 2xs:text-xs mt-1">Coming Soon</p>
      </div>
    </div>
  )
}
