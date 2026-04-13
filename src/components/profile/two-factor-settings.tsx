'use client'

import { useState } from 'react'
import { useTwoFactor } from '@microcosmmoney/auth-react'
import { TerminalCard } from '../terminal'

type Step = 'idle' | 'qr' | 'backup' | 'disable'

export interface MicrocosmTwoFactorSettingsProps {}

export function MicrocosmTwoFactorSettings({}: MicrocosmTwoFactorSettingsProps = {}) {
  const {
    status,
    setupData,
    loading,
    error,
    beginSetup,
    verifySetup,
    disable,
    clearError,
    clearSetup,
  } = useTwoFactor()

  const [step, setStep] = useState<Step>('idle')
  const [verifyCode, setVerifyCode] = useState('')
  const [disablePassword, setDisablePassword] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null)

  const handleBegin = async () => {
    clearError()
    try {
      await beginSetup()
      setStep('qr')
    } catch {}
  }

  const handleVerify = async () => {
    if (verifyCode.length !== 6) return
    clearError()
    try {
      const codes = await verifySetup(verifyCode)
      setVerifyCode('')
      if (codes && codes.length > 0) {
        setBackupCodes(codes)
        setStep('backup')
      } else {
        setStep('idle')
      }
    } catch {}
  }

  const handleDisable = async () => {
    if (!disablePassword) return
    clearError()
    try {
      await disable(disablePassword)
      setDisablePassword('')
      setStep('idle')
    } catch {}
  }

  const copyBackupCodes = async () => {
    if (!backupCodes) return
    try {
      await navigator.clipboard.writeText(backupCodes.join('\n'))
    } catch {}
  }

  if (loading && !status) return null

  return (
    <TerminalCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-300 font-medium tracking-wider">TWO FACTOR AUTH</span>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            status?.enabled ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
          }`}
        >
          {status?.enabled ? 'enabled' : 'disabled'}
        </span>
      </div>

      {error && (
        <div className="p-2 bg-red-900/20 border border-red-800 rounded text-xs text-red-300 mb-3">{error}</div>
      )}

      {step === 'idle' && !status?.enabled && (
        <div className="space-y-3">
          <p className="text-xs text-neutral-400">
            Add an extra layer of security using Google Authenticator or any TOTP app.
          </p>
          <button
            onClick={handleBegin}
            disabled={loading}
            className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-xs disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Enable 2FA'}
          </button>
        </div>
      )}

      {step === 'idle' && status?.enabled && (
        <div className="space-y-3">
          <div className="bg-neutral-800 rounded p-3">
            <div className="text-xs text-neutral-400 mb-1">STATUS</div>
            <div className="text-green-400 text-sm">
              Active {status.created_at ? `since ${new Date(status.created_at).toLocaleDateString()}` : ''}
            </div>
          </div>
          <button
            onClick={() => setStep('disable')}
            className="px-3 py-1.5 border border-red-900 text-red-400 hover:bg-red-950 rounded text-xs"
          >
            Disable 2FA
          </button>
        </div>
      )}

      {step === 'qr' && setupData && (
        <div className="space-y-4">
          <p className="text-xs text-neutral-400">
            1. Scan this QR code with Google Authenticator or any TOTP app.
          </p>
          {setupData.qr_code && (
            <div className="flex justify-center bg-white rounded p-4">
              <img
                src={setupData.qr_code.startsWith('data:') ? setupData.qr_code : `data:image/png;base64,${setupData.qr_code}`}
                alt="2FA QR Code"
                className="w-48 h-48"
              />
            </div>
          )}
          <div className="bg-neutral-800 rounded p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-neutral-400">MANUAL KEY</span>
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="text-neutral-500 hover:text-neutral-300 text-xs"
              >
                {showSecret ? 'hide' : 'show'}
              </button>
            </div>
            <code className="text-xs text-cyan-400 break-all">
              {showSecret ? setupData.secret : '••••••••••••••••'}
            </code>
          </div>
          <p className="text-xs text-neutral-400">2. Enter the 6-digit code from your app.</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="flex-1 bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-center text-lg font-mono tracking-[0.5em] outline-none focus:border-cyan-500"
              maxLength={6}
            />
            <button
              onClick={handleVerify}
              disabled={loading || verifyCode.length !== 6}
              className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-xs disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
          <button
            onClick={() => {
              setStep('idle')
              setVerifyCode('')
              clearSetup()
            }}
            className="w-full py-2 text-neutral-500 hover:text-neutral-300 text-xs"
          >
            Cancel
          </button>
        </div>
      )}

      {step === 'backup' && backupCodes && (
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
          <button
            onClick={copyBackupCodes}
            className="w-full px-3 py-2 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 rounded text-xs"
          >
            Copy codes
          </button>
          <button
            onClick={() => {
              setStep('idle')
              setBackupCodes(null)
            }}
            className="w-full px-3 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-xs"
          >
            Done
          </button>
        </div>
      )}

      {step === 'disable' && (
        <div className="space-y-4">
          <p className="text-xs text-neutral-400">Enter your password to disable two-factor authentication.</p>
          <input
            type="password"
            value={disablePassword}
            onChange={(e) => setDisablePassword(e.target.value)}
            placeholder="Current password"
            className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-sm outline-none focus:border-cyan-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                setStep('idle')
                setDisablePassword('')
              }}
              className="flex-1 px-3 py-1.5 text-neutral-500 hover:text-neutral-300 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleDisable}
              disabled={loading || !disablePassword}
              className="flex-1 px-3 py-1.5 bg-red-900 hover:bg-red-800 text-white rounded text-xs disabled:opacity-50"
            >
              {loading ? 'Disabling...' : 'Disable 2FA'}
            </button>
          </div>
        </div>
      )}
    </TerminalCard>
  )
}
