'use client'

import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import { useMicrocosmApi, useMicrocosmContext, useAuth } from '@microcosmmoney/auth-react'
import { TerminalCard } from '../terminal'
import { MicrocosmEmailChangeCard } from './email-change-card'
import { MicrocosmTwoFactorSettings } from './two-factor-settings'

const API_BASE = 'https://api.microcosm.money/v1'

interface ProfileData {
  uid?: string
  email?: string
  display_name?: string
  avatar_url?: string
  short_id?: string
  location_id?: string
  email_verified?: boolean
  created_at?: string
  last_login_at?: string
  role?: string
}

interface LevelData {
  current_rank?: string
  database_level?: string
  level?: string
  holdings?: { station?: number; matrix?: number; sector?: number; system?: number }
  progress_percent?: number
  next_rank?: string
  next_level_requirement?: {
    tier?: string
    have?: number
    need?: number
    description?: string
  }
}

const LEVEL_INFO: Record<string, { label: string; description: string; color: string }> = {
  miner: { label: 'Miner', description: 'Registered user', color: 'text-white' },
  commander: { label: 'Commander', description: 'Owns ≥1 Station NFT', color: 'text-cyan-400' },
  pioneer: { label: 'Pioneer', description: 'Auto-minted Matrix NFT (≥10 Station)', color: 'text-cyan-400' },
  warden: { label: 'Warden', description: 'Auto-minted Sector NFT (≥10 Matrix)', color: 'text-cyan-400' },
  admiral: { label: 'Admiral', description: 'Auto-minted System NFT (≥10 Sector)', color: 'text-red-400' },
}

export interface MicrocosmProfilePageProps {
  basePath?: string
  onNavigate?: (path: string) => void
  walletSection?: ReactNode
}

export function MicrocosmProfilePage({
  walletSection,
}: MicrocosmProfilePageProps = {}) {
  const api = useMicrocosmApi()
  const { getAccessToken } = useMicrocosmContext()
  const authState = useAuth()
  const userInfo = (authState as any)?.user
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [levelData, setLevelData] = useState<LevelData | null>(null)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendingVerification, setResendingVerification] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get<any>('/users/me/profile')
      const data = res?.data ?? res?.user ?? res
      if (data) {
        setProfile(data)
        setEditName(data.display_name || data.email?.split('@')[0] || 'user')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }

    try {
      const res = await api.get<any>('/users/me/level')
      setLevelData(res?.data ?? res)
    } catch {}
  }, [api])

  useEffect(() => { loadProfile() }, [loadProfile])

  const handleSave = async () => {
    if (!editName.trim()) return
    setSaving(true)
    setError(null)
    try {
      await api.patch('/users/me/profile', { display_name: editName })
      setProfile(prev => (prev ? { ...prev, display_name: editName } : prev))
      setEditing(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2MB')
      return
    }
    setUploadingAvatar(true)
    setError(null)
    try {
      const token = await getAccessToken()
      if (!token) throw new Error('Not authenticated')
      const formData = new FormData()
      formData.append('avatar', file)
      const response = await fetch(`${API_BASE}/users/me/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!response.ok) throw new Error(`Avatar upload failed: ${response.status}`)
      const result = await response.json()
      const newUrl = result?.data?.avatar_url || result?.avatar_url
      if (newUrl) {
        setProfile(prev => (prev ? { ...prev, avatar_url: newUrl } : prev))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Avatar upload failed')
    } finally {
      setUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const formatDate = (s?: string) => {
    if (!s) return '-'
    try { return new Date(s).toLocaleDateString() } catch { return '-' }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">Profile</h1>
          <p className="text-xs sm:text-sm text-neutral-400">Your account information</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <span className="text-neutral-400">Loading profile...</span>
        </div>
      </div>
    )
  }

  const displayName = profile?.display_name || profile?.email?.split('@')[0] || 'user'
  const lvl = (levelData?.current_rank || levelData?.database_level || 'miner').toLowerCase()
  const lvlInfo = LEVEL_INFO[lvl] || LEVEL_INFO.miner

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">Profile</h1>
        <p className="text-xs sm:text-sm text-neutral-400">Your account information</p>
      </div>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800 rounded text-sm text-red-300">{error}</div>
      )}

      <TerminalCard>
        <div className="flex items-start gap-4 mb-6 pb-6 border-b border-neutral-700">
          <div className="relative group">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="h-20 w-20 rounded bg-neutral-800 border border-neutral-700 object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 text-3xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute inset-0 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs disabled:opacity-30"
            >
              {uploadingAvatar ? '...' : 'edit'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
                  placeholder="Display name"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-sm disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setEditName(profile?.display_name || '')
                      setEditing(false)
                    }}
                    disabled={saving}
                    className="px-3 py-1.5 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="text-lg text-white">{displayName}</div>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs text-neutral-500 hover:text-cyan-400"
                  >
                    [edit]
                  </button>
                </div>
                <div className="text-sm text-neutral-400 mt-1">{profile?.email || '(no email)'}</div>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded text-xs border border-neutral-700">
                    {profile?.role || 'user'}
                  </span>
                  {profile?.email_verified ? (
                    <span className="px-2 py-0.5 bg-green-900/30 text-green-400 rounded text-xs border border-green-800">
                      verified
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-900/30 text-red-400 rounded text-xs border border-red-800">
                      unverified
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-neutral-800 rounded p-4">
            <div className="text-xs text-neutral-400 tracking-wider mb-1">UID</div>
            <div className="text-xs text-white font-mono break-all">{profile?.uid || userInfo?.uid || '-'}</div>
          </div>
          <div className="bg-neutral-800 rounded p-4">
            <div className="text-xs text-neutral-400 tracking-wider mb-1">Short ID</div>
            <div className="text-sm text-white font-mono">{profile?.short_id || '-'}</div>
          </div>
          <div className="bg-neutral-800 rounded p-4">
            <div className="text-xs text-neutral-400 tracking-wider mb-1">Created</div>
            <div className="text-sm text-white">{formatDate(profile?.created_at)}</div>
          </div>
          <div className="bg-neutral-800 rounded p-4">
            <div className="text-xs text-neutral-400 tracking-wider mb-1">Last Login</div>
            <div className="text-sm text-white">{formatDate(profile?.last_login_at)}</div>
          </div>
        </div>
      </TerminalCard>

      {levelData && (
        <TerminalCard title="Level Status">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-800 rounded">
              <div>
                <div className="text-xs text-neutral-400 tracking-wider mb-1">CURRENT LEVEL</div>
                <div className={`text-xl font-bold ${lvlInfo.color}`}>{lvlInfo.label}</div>
                <div className="text-xs text-neutral-500 mt-1">{lvlInfo.description}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-neutral-400 tracking-wider mb-1">HOLDINGS</div>
                <div className="text-xs text-white font-mono">
                  S:{levelData.holdings?.station ?? 0} M:{levelData.holdings?.matrix ?? 0} Se:
                  {levelData.holdings?.sector ?? 0} Sy:{levelData.holdings?.system ?? 0}
                </div>
              </div>
            </div>
            {levelData.next_level_requirement && (
              <div className="p-4 bg-neutral-800 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-neutral-400 tracking-wider">PROGRESS</span>
                  <span className="text-white text-sm font-mono">
                    {levelData.progress_percent ?? 0}%
                  </span>
                </div>
                <div className="w-full bg-neutral-900 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-cyan-400 transition-all"
                    style={{ width: `${Math.min(levelData.progress_percent ?? 0, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-neutral-500 mt-2">
                  {levelData.next_level_requirement.description || ''}
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {levelData.next_level_requirement.have}/{levelData.next_level_requirement.need}{' '}
                  {levelData.next_level_requirement.tier} → {' '}
                  <span className="text-white">{levelData.next_rank}</span>
                </div>
              </div>
            )}
          </div>
        </TerminalCard>
      )}

      <TerminalCard title="Email Verification">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-400 tracking-wider mb-1">STATUS</div>
              {profile?.email_verified ? (
                <div className="text-green-400 text-sm">Verified</div>
              ) : (
                <div className="text-red-400 text-sm">Unverified</div>
              )}
            </div>
            {!profile?.email_verified && (
              <button
                onClick={async () => {
                  setResendingVerification(true)
                  setResendMessage(null)
                  try {
                    await api.post('/users/me/resend-verification', {})
                    setResendMessage('Verification email sent — check your inbox')
                  } catch (e) {
                    setResendMessage(e instanceof Error ? e.message : 'Failed to send')
                  } finally {
                    setResendingVerification(false)
                  }
                }}
                disabled={resendingVerification}
                className="px-3 py-1.5 border border-cyan-800 text-cyan-400 hover:bg-cyan-950 rounded text-xs disabled:opacity-50"
              >
                {resendingVerification ? 'Sending...' : 'Resend Email'}
              </button>
            )}
          </div>
          {resendMessage && (
            <div className="text-xs text-cyan-400">{resendMessage}</div>
          )}
        </div>
      </TerminalCard>

      <MicrocosmEmailChangeCard
        onSuccess={(newEmail) => {
          setProfile(prev => (prev ? { ...prev, email: newEmail, email_verified: true } : prev))
        }}
      />

      <MicrocosmTwoFactorSettings />

      {walletSection}

      <TerminalCard>
        <div className="text-neutral-400 text-sm mb-3">
          <span className="text-cyan-400">!</span> Security
        </div>
        <div className="space-y-1 text-sm text-neutral-400">
          <p>- Keep your account credentials secure</p>
          <p>- Change password periodically via main portal</p>
          <p>- Report suspicious activity immediately</p>
          <p>- Verify your email to receive important notifications</p>
        </div>
      </TerminalCard>
    </div>
  )
}
