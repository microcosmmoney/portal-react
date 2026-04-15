"use client"

import { useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { setup2FA, verifyAndEnable2FA, disable2FA, get2FAStatus } from "../../lib/auth-service"
import { toast } from "sonner"
import { ShieldCheck, Copy, Eye, EyeOff } from "lucide-react"
import { useEffect } from "react"

export default function TwoFactorSettings() {
  const [status, setStatus] = useState<{ totp_enabled: boolean; has_backup_codes: boolean; setup_at: string | null } | null>(null)
  const [loading, setLoading] = useState(true)

  // Setup flow
  const [setupStep, setSetupStep] = useState<'idle' | 'qr' | 'backup' | 'disable'>('idle')
  const [qrCode, setQrCode] = useState("")
  const [secret, setSecret] = useState("")
  const [verifyCode, setVerifyCode] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [disablePassword, setDisablePassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = async () => {
    try {
      const data = await get2FAStatus()
      setStatus(data)
    } catch {
      // Not critical
    } finally {
      setLoading(false)
    }
  }

  const handleSetup = async () => {
    setSubmitting(true)
    try {
      const data = await setup2FA()
      setQrCode(data.qr_code)
      setSecret(data.secret)
      setSetupStep('qr')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start 2FA setup')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerify = async () => {
    if (verifyCode.length !== 6) return
    setSubmitting(true)
    try {
      const data = await verifyAndEnable2FA(verifyCode)
      setBackupCodes(data.backup_codes)
      setSetupStep('backup')
      setStatus({ totp_enabled: true, has_backup_codes: true, setup_at: new Date().toISOString() })
      toast.success('2FA enabled successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invalid code')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDisable = async () => {
    if (!disablePassword) return
    setSubmitting(true)
    try {
      await disable2FA(disablePassword)
      setStatus({ totp_enabled: false, has_backup_codes: false, setup_at: null })
      setSetupStep('idle')
      setDisablePassword("")
      toast.success('2FA disabled')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to disable 2FA')
    } finally {
      setSubmitting(false)
    }
  }

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'))
    toast.success('Backup codes copied')
  }

  if (loading) return null

  return (
    <Card className="bg-neutral-900 border-neutral-700 dash-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-neutral-400" />
            <span className="text-sm text-neutral-300 font-medium tracking-wider">two_factor_auth</span>
          </div>
          <Badge variant={status?.totp_enabled ? "default" : "outline"}>
            {status?.totp_enabled ? "enabled" : "disabled"}
          </Badge>
        </div>

        {setupStep === 'idle' && !status?.totp_enabled && (
          <div className="space-y-3">
            <p className="text-xs text-neutral-400">
              Add an extra layer of security to your account using Google Authenticator or any TOTP app.
            </p>
            <Button
              onClick={handleSetup}
              disabled={submitting}
              className="bg-cyan-700 hover:bg-cyan-600 text-white text-xs"
            >
              {submitting ? 'Setting up...' : 'Enable 2FA'}
            </Button>
          </div>
        )}

        {setupStep === 'idle' && status?.totp_enabled && (
          <div className="space-y-3">
            <div className="bg-neutral-800 rounded p-3">
              <div className="text-xs text-neutral-400 mb-1">status</div>
              <div className="text-green-400 text-sm">Active since {status.setup_at ? new Date(status.setup_at).toLocaleDateString() : 'unknown'}</div>
            </div>
            <Button
              onClick={() => setSetupStep('disable')}
              variant="outline"
              className="border-red-900 text-red-400 hover:bg-red-950 hover:text-red-300 bg-transparent text-xs"
            >
              Disable 2FA
            </Button>
          </div>
        )}

        {setupStep === 'qr' && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-400">
              1. Scan this QR code with Google Authenticator or any TOTP app.
            </p>
            <div className="flex justify-center bg-white rounded p-4">
              <img src={`data:image/png;base64,${qrCode}`} alt="2FA QR Code" className="w-48 h-48" />
            </div>
            <div className="bg-neutral-800 rounded p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-neutral-400">manual_key</span>
                <button onClick={() => setShowSecret(!showSecret)} className="text-neutral-500 hover:text-neutral-300">
                  {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <code className="text-xs text-cyan-400 break-all">
                {showSecret ? secret : '••••••••••••••••'}
              </code>
            </div>
            <p className="text-xs text-neutral-400">
              2. Enter the 6-digit code from your app to verify.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="flex-1 bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-center text-lg font-mono tracking-[0.5em] outline-none focus:border-cyan-500"
                maxLength={6}
              />
              <Button
                onClick={handleVerify}
                disabled={submitting || verifyCode.length !== 6}
                className="bg-cyan-700 hover:bg-cyan-600 text-white text-xs px-6"
              >
                {submitting ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
            <Button
              onClick={() => { setSetupStep('idle'); setVerifyCode(''); }}
              variant="ghost"
              className="text-neutral-500 hover:text-neutral-300 text-xs w-full"
            >
              Cancel
            </Button>
          </div>
        )}

        {setupStep === 'backup' && (
          <div className="space-y-4">
            <div className="bg-yellow-950/30 border border-yellow-900/50 rounded p-3">
              <p className="text-xs text-yellow-400 font-medium mb-1">Save your backup codes</p>
              <p className="text-xs text-yellow-600">
                These codes can be used to access your account if you lose your authenticator. Each code can only be used once. Store them safely.
              </p>
            </div>
            <div className="bg-neutral-800 rounded p-4 font-mono text-sm space-y-1">
              {backupCodes.map((code, i) => (
                <div key={i} className="text-cyan-400">{code}</div>
              ))}
            </div>
            <Button onClick={copyBackupCodes} variant="outline" className="w-full border-neutral-700 text-neutral-300 hover:bg-neutral-800 bg-transparent text-xs">
              <Copy size={14} className="mr-2" /> Copy codes
            </Button>
            <Button
              onClick={() => { setSetupStep('idle'); setBackupCodes([]); setVerifyCode(''); }}
              className="w-full bg-cyan-700 hover:bg-cyan-600 text-white text-xs"
            >
              Done
            </Button>
          </div>
        )}

        {setupStep === 'disable' && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-400">
              Enter your password to disable two-factor authentication.
            </p>
            <input
              type="password"
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
              placeholder="Current password"
              className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-sm outline-none focus:border-cyan-500"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => { setSetupStep('idle'); setDisablePassword(''); }}
                variant="ghost"
                className="flex-1 text-neutral-500 hover:text-neutral-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDisable}
                disabled={submitting || !disablePassword}
                className="flex-1 bg-red-900 hover:bg-red-800 text-white text-xs"
              >
                {submitting ? 'Disabling...' : 'Disable 2FA'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
