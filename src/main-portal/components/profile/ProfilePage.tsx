"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { useAuth } from "../../hooks/useAuth"
import { onAuthChange, getCurrentUserToken, sendEmailVerification, checkEmailVerified, resendVerificationEmail, requestEmailChange, verifyEmailChange } from "../../lib/auth-service"
import { getUserLevelStatus } from "../../lib/api/services"
import type { UserLevelStatus } from "../../lib/types/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import WalletManagement from "../wallet/WalletManagement"
import TwoFactorSettings from "./TwoFactorSettings"
import EmailChangeCard from "./EmailChangeCard"
import { useTranslations } from 'next-intl'

const LEVEL_INFO: Record<string, { label: string; description: string; color: string }> = {
  miner: { label: 'Miner', description: 'Registration', color: 'text-white' },
  commander: { label: 'Commander', description: 'Owns >=1 Station NFT', color: 'text-cyan-400' },
  pioneer: { label: 'Pioneer', description: 'Auto-minted Matrix NFT (>=10 Station)', color: 'text-cyan-400' },
  warden: { label: 'Warden', description: 'Auto-minted Sector NFT (>=10 Matrix)', color: 'text-cyan-400' },
  admiral: { label: 'Admiral', description: 'Auto-minted System NFT (>=10 Sector)', color: 'text-red-500' },
}

export default function ProfilePage() {
  const t = useTranslations('profile')
  const { userInfo } = useAuth()
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [emailVerified, setEmailVerified] = useState(false)
  const [createdAt, setCreatedAt] = useState("")
  const [lastLoginAt, setLastLoginAt] = useState("")
  const [shortId, setShortId] = useState<string | null>(null)
  const [locationId, setLocationId] = useState<string | null>(null)
  const [editDisplayName, setEditDisplayName] = useState("")
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [sendingVerification, setSendingVerification] = useState(false)
  const [checkingVerification, setCheckingVerification] = useState(false)
  const [showVerifyDialog, setShowVerifyDialog] = useState(false)
  const [verifyDialogStep, setVerifyDialogStep] = useState<'main' | 'change' | 'change-verify'>('main')
  const [newEmailInput, setNewEmailInput] = useState("")
  const [changePasswordInput, setChangePasswordInput] = useState("")
  const [changeCodeInput, setChangeCodeInput] = useState("")
  const [verifyDialogLoading, setVerifyDialogLoading] = useState(false)
  const [levelStatus, setLevelStatus] = useState<UserLevelStatus | null>(null)
  const [levelLoading, setLevelLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        setCreatedAt("")
        setLastLoginAt("")
        try {
          const token = await getCurrentUserToken()
          if (token) {
            const response = await fetch("/api/users/profile", { headers: { Authorization: `Bearer ${token}` } })
            if (response.ok) {
              const data = await response.json()
              if (data.success && data.user) {
                const name = data.user.display_name || data.user.email?.split("@")[0] || "user"
                setDisplayName(name); setEditDisplayName(name)
                if (data.user.email_verified !== undefined) setEmailVerified(data.user.email_verified)
                if (data.user.avatar_url) setAvatarUrl(data.user.avatar_url)
                if (data.user.short_id) setShortId(data.user.short_id)
                if (data.user.location_id) setLocationId(data.user.location_id)
                if (data.user.created_at) setCreatedAt(data.user.created_at)
                if (data.user.last_login_at) setLastLoginAt(data.user.last_login_at)
              } else { setDisplayName("user"); setEditDisplayName("user") }
            } else { setDisplayName("user"); setEditDisplayName("user") }
          }
        } catch { setDisplayName("user"); setEditDisplayName("user") }
        setLoading(false)
        loadLevelStatus(user.uid)
      }
    })
    return () => unsubscribe()
  }, [])

  const loadLevelStatus = async (uid: string) => {
    try { setLevelLoading(true); const result = await getUserLevelStatus(uid); if (result.success && result.data) setLevelStatus(result.data) }
    catch {} finally { setLevelLoading(false) }
  }

  const getRoleLabel = (role: string | undefined) => role === "admin" || role === "platform_admin" ? t('platformAdmin') : role === "team_member" ? t('teamMember') : t('normalUser')
  const getRoleBadgeVariant = (role: string | undefined): "default" | "secondary" | "destructive" | "outline" => role === "admin" || role === "platform_admin" ? "default" : role === "team_member" ? "secondary" : "outline"
  const formatDate = (dateStr: string) => { if (!dateStr) return "-"; try { return new Date(dateStr).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" }) } catch { return "-" } }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = await getCurrentUserToken(); if (!token) throw new Error("Not authenticated")
      const response = await fetch("/api/users/profile", { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ display_name: editDisplayName }) })
      if (!response.ok) { const error = await response.json(); throw new Error(error.error || "Failed to update profile") }
      setDisplayName(editDisplayName); setEditing(false); toast.success("profile updated successfully")
    } catch (error) { toast.error(error instanceof Error ? error.message : "save failed") } finally { setSaving(false) }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    if (!file.type.startsWith("image/")) { toast.error("please select an image file"); return }
    if (file.size > 2 * 1024 * 1024) { toast.error("image size must be less than 2MB"); return }
    setAvatarFile(file); const reader = new FileReader(); reader.onload = (e) => { setAvatarPreview(e.target?.result as string) }; reader.readAsDataURL(file)
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) { if (!avatarPreview && avatarUrl) { setAvatarUrl(""); setIsAvatarDialogOpen(false); return }; setIsAvatarDialogOpen(false); return }
    setUploadingAvatar(true)
    try {
      const token = await getCurrentUserToken(); if (!token) throw new Error("Not authenticated")
      const formData = new FormData(); formData.append("avatar", avatarFile)
      const response = await fetch("/api/users/avatar", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData })
      if (!response.ok) throw new Error("Upload failed")
      const result = await response.json(); setAvatarUrl(result.data?.avatar_url || result.avatar_url); setIsAvatarDialogOpen(false); toast.success("avatar updated")
    } catch { toast.error("avatar upload failed") } finally { setUploadingAvatar(false) }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-neutral-400" /><span className="ml-3 text-neutral-400 text-sm">loading profile...</span></div>

  const lvl = levelStatus?.current_rank?.toLowerCase() || levelStatus?.database_level?.toLowerCase() || 'miner'
  const lvlInfo = LEVEL_INFO[lvl] || LEVEL_INFO.miner

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">
      <div><h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">Profile</h1><p className="text-xs sm:text-sm text-neutral-400">view and manage your personal information</p></div>

      <Card className="bg-neutral-900 border-neutral-700 dash-card"><CardContent className="p-3 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-neutral-700">
          <div className="relative group cursor-pointer" onClick={() => { setAvatarPreview(avatarUrl || null); setAvatarFile(null); setIsAvatarDialogOpen(true) }}>
            {avatarUrl ? <img src={avatarUrl} alt="" className="h-20 w-20 rounded bg-neutral-800 border border-neutral-700 object-cover" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='20' fill='%23312e81'/%3E%3Ccircle cx='20' cy='15' r='6' fill='%236366f1'/%3E%3Cellipse cx='20' cy='32' rx='10' ry='8' fill='%236366f1'/%3E%3C/svg%3E" }} /> : <div className="h-20 w-20 rounded bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 text-3xl font-bold">{displayName.charAt(0).toUpperCase()}</div>}
            <div className="absolute inset-0 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-xs">edit</span></div>
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <div><label className="text-xs text-neutral-400 tracking-wider block mb-1">display_name</label><input type="text" value={editDisplayName} onChange={e => setEditDisplayName(e.target.value)} className="w-full bg-neutral-800 border border-neutral-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 placeholder-neutral-400" placeholder="Enter display name" /></div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={saving} size="sm" className="bg-cyan-700 hover:bg-cyan-600 text-white">{saving ? "saving..." : "save"}</Button>
                  <Button onClick={() => { setEditDisplayName(displayName); setEditing(false) }} disabled={saving} variant="outline" size="sm" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="text-lg text-white">{displayName}</div>
                  <Button onClick={() => { setEditDisplayName(displayName); setEditing(true) }} variant="ghost" size="sm" className="text-neutral-400 hover:text-cyan-400 text-xs h-auto py-0 px-1">[edit]</Button>
                </div>
                <div className="text-sm text-neutral-400 mt-1">{userInfo?.email || "no email set"}</div>
                <div className="text-xs text-neutral-500 mt-1">{t('avatarAutoGenNote')}</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant={getRoleBadgeVariant(userInfo?.role)}>{getRoleLabel(userInfo?.role)}</Badge>
                  {emailVerified ? <Badge variant="default" className="bg-green-600 text-white hover:bg-green-600">verified</Badge> : <Badge variant="destructive" className="cursor-pointer hover:opacity-80" onClick={() => { setShowVerifyDialog(true); setVerifyDialogStep('main') }}>unverified</Badge>}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="space-y-0">
          {[{ l: 'id', v: <span className="text-xs bg-neutral-800 px-2 py-0.5 rounded font-mono">{shortId || userInfo?.uid || "-"}</span> }, { l: 'email', v: userInfo?.email || "-" }, { l: 'role', v: <span className="text-cyan-400">{getRoleLabel(userInfo?.role)}</span> }, { l: 'status', v: <span className="text-white">active</span> }].map(({ l, v }) => (
            <div key={l} className="flex justify-between py-2 border-b border-neutral-800"><span className="text-neutral-400 text-sm">{l}</span><span className="text-white text-sm">{v}</span></div>
          ))}
        </div>
      </CardContent></Card>

      <Card className="bg-neutral-900 border-neutral-700 dash-card"><CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{ l: 'created_at', v: formatDate(createdAt) }, { l: 'last_login', v: formatDate(lastLoginAt) }, { l: 'short_id', v: <span className="font-mono text-sm">{shortId || userInfo?.uid?.substring(0, 16) + '...'}</span> }].map(({ l, v }) => (
            <div key={l} className="bg-neutral-800 rounded p-4"><div className="text-xs text-neutral-400 tracking-wider mb-1">{l}</div><div className="text-white font-medium">{v}</div></div>
          ))}
          {locationId && <div className="bg-neutral-800 rounded p-4 col-span-2"><div className="text-xs text-neutral-400 tracking-wider mb-1">location_id</div><div className="text-cyan-400 font-mono text-sm break-all">{locationId}</div></div>}
          <div className="bg-neutral-800 rounded p-4">
            <div className="text-xs text-neutral-400 tracking-wider mb-1">email_status</div>
            {emailVerified ? <div className="text-green-400 font-medium">verified</div> : (
              <div className="space-y-2">
                <div className="text-cyan-400 font-medium">unverified</div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={async () => { setSendingVerification(true); try { await sendEmailVerification(); toast.success("verification email sent", { description: "check your inbox (and spam folder)" }) } catch (e) { toast.error("send failed", { description: e instanceof Error ? e.message : "send failed" }) } finally { setSendingVerification(false) } }} disabled={sendingVerification} variant="outline" size="sm" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent text-xs">{sendingVerification ? "sending..." : "send email"}</Button>
                  <Button onClick={async () => { setCheckingVerification(true); try { const v = await checkEmailVerified(); if (v) { setEmailVerified(true); toast.success("email verified!") } else toast.info("email not verified yet", { description: "click the link in the email" }) } catch { toast.error("check failed", { description: "please try again" }) } finally { setCheckingVerification(false) } }} disabled={checkingVerification} variant="outline" size="sm" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent text-xs">{checkingVerification ? "checking..." : "check"}</Button>
                  <Button onClick={() => window.location.href = '#change-email'} variant="outline" size="sm" className="border-cyan-800 text-cyan-500 hover:bg-cyan-950 hover:text-cyan-300 bg-transparent text-xs">change email</Button>
                </div>
                <p className="text-[10px] text-neutral-500">If you entered an incorrect email, you can change it below.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent></Card>

      <Card className="bg-neutral-900 border-neutral-700 dash-card"><CardContent className="p-3 sm:p-6">
        {levelLoading ? <div className="flex items-center justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-neutral-400" /><span className="ml-2 text-neutral-500 text-sm">{t('loadingLevel')}</span></div> : levelStatus ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-800 rounded">
              <div><div className="text-xs text-neutral-400 tracking-wider mb-1">current_level</div><div className={`text-xl font-bold ${lvlInfo.color}`}>{lvlInfo.label}</div><div className="text-xs text-neutral-500 mt-1">{lvlInfo.description}</div></div>
              <div className="text-right"><div className="text-xs text-neutral-400 tracking-wider mb-1">holdings</div><div className="text-white text-xs font-mono">S:{levelStatus.holdings.station} M:{levelStatus.holdings.matrix} Se:{levelStatus.holdings.sector} Sy:{levelStatus.holdings.system}</div></div>
            </div>
            {levelStatus.next_level_requirement && (
              <div className="p-4 bg-neutral-800 rounded">
                <div className="flex justify-between items-center mb-2"><span className="text-xs text-neutral-400 tracking-wider">upgrade_progress</span><span className="text-white text-sm font-mono">{levelStatus.progress_percent}%</span></div>
                <div className="w-full bg-neutral-800 rounded-full h-2"><div className="h-2 rounded-full transition-all bg-cyan-400" style={{ width: `${Math.min(levelStatus.progress_percent, 100)}%` }} /></div>
                <div className="text-xs text-neutral-500 mt-2">{levelStatus.next_level_requirement.description}</div>
                <div className="text-xs text-neutral-400 mt-1">{levelStatus.next_level_requirement.have}/{levelStatus.next_level_requirement.need} {levelStatus.next_level_requirement.tier} → <span className="text-white">{levelStatus.next_rank}</span></div>
              </div>
            )}
          </div>
        ) : <div className="text-center py-6 text-neutral-500"><p>{t('noLevelInfo')}</p><p className="text-xs mt-1">{t('noLevelInfoHint')}</p></div>}
      </CardContent></Card>

      <WalletManagement />
      <EmailChangeCard />
      <TwoFactorSettings />

      <Card className="bg-neutral-900 border-neutral-700 dash-card"><CardContent className="p-3 sm:p-6">
        <div className="text-neutral-400 text-sm mb-4"><span className="text-cyan-400">!</span> security notice</div>
        <div className="space-y-2 text-sm text-neutral-400">
          {['Keep your account credentials secure', 'Change password periodically', 'Report suspicious activity immediately', 'Verify email to receive important notifications'].map(p => <p key={p}>- {p}</p>)}
        </div>
      </CardContent></Card>

      {isAvatarDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-md mx-4"><CardContent className="p-6 space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                {avatarPreview ? <img src={avatarPreview} alt="preview" className="h-32 w-32 rounded border-4 border-neutral-700 object-cover" /> : <div className="h-32 w-32 rounded border-4 border-neutral-700 bg-neutral-800 flex items-center justify-center text-4xl text-neutral-500">{displayName.charAt(0).toUpperCase()}</div>}
                {avatarPreview && <button onClick={() => { setAvatarPreview(null); setAvatarFile(null); if (fileInputRef.current) fileInputRef.current.value = "" }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs">x</button>}
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileSelect} className="hidden" />
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">select image</Button>
              {avatarFile && <p className="text-sm text-neutral-500">selected: {avatarFile.name} ({(avatarFile.size / 1024).toFixed(1)} KB)</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsAvatarDialogOpen(false)} disabled={uploadingAvatar} variant="outline" size="sm" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">cancel</Button>
              <Button onClick={handleAvatarUpload} disabled={uploadingAvatar || (!avatarFile && avatarPreview === avatarUrl)} size="sm" className="bg-cyan-700 hover:bg-cyan-600 text-white">{uploadingAvatar ? "uploading..." : "upload"}</Button>
            </div>
          </CardContent></Card>
        </div>
      )}

      {showVerifyDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowVerifyDialog(false)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            {verifyDialogStep === 'main' && (
              <>
                <div className="text-white font-medium text-sm">Verify Your Email</div>
                <div className="bg-neutral-800 rounded p-3"><div className="text-xs text-neutral-400 mb-1">current email</div><div className="text-white text-sm font-mono">{userInfo?.email || '-'}</div></div>
                <p className="text-xs text-neutral-400">A verification link will be sent to this email. If this is not your real email, change it first.</p>
                <div className="flex gap-2">
                  <Button onClick={async () => { setVerifyDialogLoading(true); try { await resendVerificationEmail(); toast.success('Verification email sent! Check your inbox.'); setShowVerifyDialog(false) } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed to send') } finally { setVerifyDialogLoading(false) } }} disabled={verifyDialogLoading} className="flex-1 bg-cyan-700 hover:bg-cyan-600 text-white text-xs">{verifyDialogLoading ? 'Sending...' : 'Send Verification Link'}</Button>
                  <Button onClick={() => { setVerifyDialogStep('change'); setNewEmailInput(''); setChangePasswordInput('') }} variant="outline" className="flex-1 border-neutral-700 text-neutral-300 hover:bg-neutral-800 bg-transparent text-xs">Change Email</Button>
                </div>
                <button onClick={() => setShowVerifyDialog(false)} className="w-full text-center text-xs text-neutral-500 hover:text-neutral-300 pt-1">Close</button>
              </>
            )}
            {verifyDialogStep === 'change' && (
              <>
                <div className="text-white font-medium text-sm">Change Email Address</div>
                <p className="text-xs text-neutral-400">Enter your new email and current password. A verification code will be sent to the new email.</p>
                <input type="email" value={newEmailInput} onChange={e => setNewEmailInput(e.target.value)} placeholder="New email address" className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-sm outline-none focus:border-cyan-500" />
                <input type="password" value={changePasswordInput} onChange={e => setChangePasswordInput(e.target.value)} placeholder="Current password" className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-sm outline-none focus:border-cyan-500" />
                <div className="flex gap-2">
                  <Button onClick={() => setVerifyDialogStep('main')} variant="ghost" className="flex-1 text-neutral-500 hover:text-neutral-300 text-xs">Back</Button>
                  <Button onClick={async () => { if (!newEmailInput || !changePasswordInput) return; setVerifyDialogLoading(true); try { await requestEmailChange(newEmailInput, changePasswordInput); toast.success('Verification code sent to new email'); setVerifyDialogStep('change-verify') } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed') } finally { setVerifyDialogLoading(false) } }} disabled={verifyDialogLoading || !newEmailInput || !changePasswordInput} className="flex-1 bg-cyan-700 hover:bg-cyan-600 text-white text-xs">{verifyDialogLoading ? 'Sending...' : 'Send Code'}</Button>
                </div>
              </>
            )}
            {verifyDialogStep === 'change-verify' && (
              <>
                <div className="text-white font-medium text-sm">Enter Verification Code</div>
                <p className="text-xs text-neutral-400">A 6-digit code was sent to <span className="text-cyan-400">{newEmailInput}</span>. After verification, this becomes your new login email. Your password stays the same.</p>
                <input type="text" value={changeCodeInput} onChange={e => setChangeCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-center text-xl font-mono tracking-[0.5em] outline-none focus:border-cyan-500" maxLength={6} />
                <div className="flex gap-2">
                  <Button onClick={() => { setVerifyDialogStep('change'); setChangeCodeInput('') }} variant="ghost" className="flex-1 text-neutral-500 hover:text-neutral-300 text-xs">Back</Button>
                  <Button onClick={async () => { if (changeCodeInput.length !== 6) return; setVerifyDialogLoading(true); try { await verifyEmailChange(newEmailInput, changeCodeInput); toast.success('Email changed and verified!'); setEmailVerified(true); setShowVerifyDialog(false); window.location.reload() } catch (err) { toast.error(err instanceof Error ? err.message : 'Verification failed') } finally { setVerifyDialogLoading(false) } }} disabled={verifyDialogLoading || changeCodeInput.length !== 6} className="flex-1 bg-cyan-700 hover:bg-cyan-600 text-white text-xs">{verifyDialogLoading ? 'Verifying...' : 'Verify & Change'}</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
