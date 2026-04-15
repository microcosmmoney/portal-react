// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Wallet, Star, Trash2, Copy, ExternalLink, RefreshCw, Check, AlertCircle, Pickaxe } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useAuth } from '../../hooks/useAuth'
import { getCurrentUserToken } from '../../lib/auth-service'
import { cn } from '../../lib/utils'
import { listWallets, removeWallet, setPrimaryWallet } from '../../lib/wallet-auth/api'
import type { UserWallet } from '../../lib/wallet-auth/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import PublicMiningModal from '../resources/public-mining-modal'
import { useTranslations } from 'next-intl'

const MIN_BIND_AMOUNT = 0.01
const DEFAULT_BIND_AMOUNT = 0.1

interface WalletManagementProps {
  className?: string
}

export default function WalletManagement({ className }: WalletManagementProps) {
  const { user } = useAuth()
  const t = useTranslations('wallet')

  const [wallets, setWallets] = useState<UserWallet[]>([])
  const [primaryWallet, setPrimaryWalletAddress] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [showMiningModal, setShowMiningModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const getToken = async (): Promise<string | null> => {
    try {
      return await getCurrentUserToken()
    } catch {
      return null
    }
  }

  const loadWallets = useCallback(async () => {
    const token = await getToken()
    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await listWallets(token)
      if (response.success && response.data) {
        setWallets(response.data.wallets)
        setPrimaryWalletAddress(response.data.primary_wallet)
      } else {
        setError(response.error || 'Failed to load wallets')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load wallets')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadWallets()
    }
  }, [user, loadWallets])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && user) {
        loadWallets()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [user, loadWallets])

  const handleCopy = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedAddress(address)
      setTimeout(() => setCopiedAddress(null), 2000)
    } catch {}
  }

  const handleSetPrimary = async (walletAddress: string) => {
    const token = await getToken()
    if (!token) return

    try {
      setActionLoading(walletAddress)
      const response = await setPrimaryWallet(walletAddress, token)
      if (response.success) {
        await loadWallets()
      } else {
        setError(response.error || 'Failed to set primary wallet')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to set primary wallet')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRemove = async (walletAddress: string) => {
    const token = await getToken()
    if (!token) return

    try {
      setActionLoading(walletAddress)
      setShowDeleteConfirm(null)
      const response = await removeWallet(walletAddress, token)
      if (response.success) {
        await loadWallets()
      } else {
        setError(response.error || 'Failed to remove wallet')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to remove wallet')
    } finally {
      setActionLoading(null)
    }
  }

  const handleMiningSuccess = () => {
    setShowMiningModal(false)
    loadWallets()
  }

  if (loading) {
    return (
      <Card className={cn("bg-neutral-900 border-neutral-700 dash-card", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("bg-neutral-900 border-neutral-700 dash-card", className)}><CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-neutral-400" />
          <h3 className="text-white font-medium">{t('title')}</h3>
          <span className="text-xs text-neutral-400">({wallets.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadWallets}
            disabled={loading}
            className="text-neutral-400 hover:text-white"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
          <Button
            size="sm"
            onClick={() => setShowMiningModal(true)}
            className="bg-cyan-700 hover:bg-cyan-600 text-white"
          >
            <Pickaxe className="w-4 h-4 mr-1" />
            {t('bindWallet')}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-400">{error}</div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            &times;
          </button>
        </div>
      )}

      {wallets.length === 0 ? (
        <div className="text-center py-8 text-neutral-400">
          <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{t('noWallets')}</p>
          <p className="text-sm mt-2 text-neutral-500">{t('bindHint')}</p>
          <Button
            size="sm"
            onClick={() => setShowMiningModal(true)}
            className="mt-4 bg-cyan-700 hover:bg-cyan-600 text-white"
          >
            <Pickaxe className="w-4 h-4 mr-1" />
            {t('startMining')}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <div
              key={wallet.wallet_address}
              className={cn(
                "p-4 rounded border transition-colors",
                wallet.is_primary
                  ? "bg-cyan-400/10 border-cyan-400/30"
                  : "bg-neutral-800 border-neutral-700 hover:border-neutral-600"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {wallet.is_primary && (
                      <Star className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                    )}
                    <code className="text-white font-mono text-sm truncate">
                      {wallet.wallet_address}
                    </code>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span className="capitalize">{wallet.wallet_type}</span>
                    {wallet.is_primary && (
                      <Badge className="bg-white/20 text-white border-0 text-xs">{t('primary')}</Badge>
                    )}
                    <span>{new Date(wallet.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(wallet.wallet_address)}
                    className="text-neutral-400 hover:text-white h-8 w-8 p-0"
                  >
                    {copiedAddress === wallet.wallet_address ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>

                  <a
                    href={`https://solscan.io/account/${wallet.wallet_address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white h-8 w-8 p-0 flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {!wallet.is_primary && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetPrimary(wallet.wallet_address)}
                      disabled={actionLoading === wallet.wallet_address}
                      className="text-neutral-400 hover:text-cyan-400 h-8 w-8 p-0"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(wallet.wallet_address)}
                    disabled={actionLoading === wallet.wallet_address}
                    className="text-neutral-400 hover:text-red-400 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent className="bg-neutral-900 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-white">{t('deleteTitle')}</DialogTitle>
            <DialogDescription className="text-neutral-400">
              {t('deleteDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 p-3 bg-neutral-800 rounded border border-neutral-700">
            <code className="text-sm text-white font-mono break-all">{showDeleteConfirm}</code>
          </div>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
              onClick={() => setShowDeleteConfirm(null)}
            >
              {t('cancel')}
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-500 text-white"
              onClick={() => showDeleteConfirm && handleRemove(showDeleteConfirm)}
            >
              {t('confirmDelete')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PublicMiningModal
        isOpen={showMiningModal}
        onClose={() => setShowMiningModal(false)}
        onSuccess={handleMiningSuccess}
      />
    </CardContent></Card>
  )
}
