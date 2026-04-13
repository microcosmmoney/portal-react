'use client'

export interface MicrocosmFragmentPageProps {
  onNavigate?: (path: string) => void
}

function IconWallet({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M19 7V4a1 1 0 00-1-1H5a2 2 0 000 4h15a1 1 0 011 1v4h-3a2 2 0 000 4h3a1 1 0 001-1v-2a1 1 0 00-1-1" />
      <path d="M3 5v14a2 2 0 002 2h15a1 1 0 001-1v-4" />
    </svg>
  )
}

function IconPuzzle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    </svg>
  )
}

function IconImage({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  )
}

function IconInfo({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" /><path d="M12 8h.01" />
    </svg>
  )
}

export function MicrocosmFragmentPage({ onNavigate }: MicrocosmFragmentPageProps) {
  return (
    <div className="max-w-7xl mx-auto p-6 font-mono space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Fragment</h1>
        <p className="text-neutral-400 text-sm mt-1">NFT fractionalization protocol</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
        <div className="p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <IconWallet className="w-4 h-4" />
            <span>MY_HOLDINGS</span>
          </div>
          <div className="text-center py-8 text-neutral-400">
            <IconPuzzle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No fragment holdings</p>
            <p className="text-sm mt-1">Purchase fragments from available vaults below</p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
        <div className="p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <IconImage className="w-4 h-4" />
            <span>FRAGMENT_VAULTS</span>
          </div>
          <div className="text-center py-8 text-neutral-400">
            <IconImage className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No fragment vaults available</p>
            <p className="text-sm mt-1">Check back later for new NFT fragmentation opportunities</p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
        <div className="p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <IconInfo className="w-4 h-4" />
            <span>PROTOCOL_INFO</span>
          </div>
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-neutral-800 rounded border border-neutral-700">
              <div className="font-medium text-white mb-2">What is Fragmentation?</div>
              <p className="text-neutral-400">
                Fragment allows NFT owners to split Territory NFTs into tradeable fragments, enabling shared ownership and community buyout mechanics.
              </p>
            </div>
            <div className="p-4 bg-neutral-800 rounded border border-neutral-700">
              <div className="font-medium text-white mb-2">Fragment Holder Rights</div>
              <ul className="list-disc list-inside space-y-1 text-neutral-400">
                <li>Proportional ownership of the underlying NFT</li>
                <li>Participate in buyout proposals</li>
                <li>Trade fragments freely on the market</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
