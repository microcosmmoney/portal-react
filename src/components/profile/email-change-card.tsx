'use client'

import { useState } from 'react'
import { useEmailVerification } from '@microcosmmoney/auth-react'
import { TerminalCard } from '../terminal'
import { useTranslations } from '../../i18n-context'

export interface MicrocosmEmailChangeCardProps {
  onSuccess?: (newEmail: string) => void
}

export function MicrocosmEmailChangeCard({ onSuccess }: MicrocosmEmailChangeCardProps = {}) {
  const t = useTranslations('profile')
  const { requestEmailChange, verifyEmailChange, loading, error, clearError } = useEmailVerification()
  const [step, setStep] = useState<'idle' | 'form' | 'verify'>('idle')
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')

  const handleRequest = async () => {
    if (!newEmail || !password) return
    clearError()
    try {
      await requestEmailChange(newEmail, password)
      setStep('verify')
    } catch {}
  }

  const handleVerify = async () => {
    if (code.length !== 6) return
    clearError()
    try {
      await verifyEmailChange(newEmail, code)
      setStep('idle')
      const finalEmail = newEmail
      setNewEmail('')
      setPassword('')
      setCode('')
      onSuccess?.(finalEmail)
    } catch {}
  }

  if (step === 'idle') {
    return (
      <TerminalCard>
        <div className="flex items-center gap-2 mb-2 2xs:mb-3">
          <span className="text-xs 2xs:text-sm text-neutral-300 font-medium tracking-wider">{t('changeEmail', 'CHANGE EMAIL')}</span>
        </div>
        <p className="text-[10px] 2xs:text-xs text-neutral-400 mb-2 2xs:mb-3">
          {t('changeEmailDesc', 'Update your email address. A verification code will be sent to the new email.')}
        </p>
        <button
          onClick={() => setStep('form')}
          className="px-3 py-1.5 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 rounded text-xs"
        >
          {t('changeEmailBtn', 'Change Email')}
        </button>
      </TerminalCard>
    )
  }

  return (
    <TerminalCard>
      <div className="space-y-3 2xs:space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs 2xs:text-sm text-neutral-300 font-medium tracking-wider">{t('changeEmail', 'CHANGE EMAIL')}</span>
        </div>

        {error && (
          <div className="p-2 bg-red-900/20 border border-red-800 rounded text-xs text-red-300">{error}</div>
        )}

        {step === 'form' && (
          <>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={t('newEmailPlaceholder', 'New email address')}
              className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-xs 2xs:text-sm outline-none focus:border-cyan-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('currentPasswordPlaceholder', 'Current password')}
              className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-xs 2xs:text-sm outline-none focus:border-cyan-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setStep('idle')
                  setNewEmail('')
                  setPassword('')
                  clearError()
                }}
                className="flex-1 px-3 py-1.5 text-neutral-500 hover:text-neutral-300 text-xs"
              >
                {t('cancel', 'Cancel')}
              </button>
              <button
                onClick={handleRequest}
                disabled={loading || !newEmail || !password}
                className="flex-1 px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-xs disabled:opacity-50"
              >
                {loading ? t('sending', 'Sending...') : t('sendCode', 'Send Code')}
              </button>
            </div>
          </>
        )}

        {step === 'verify' && (
          <>
            <p className="text-xs text-neutral-400">
              {t('enterCodeSentTo', 'Enter the 6-digit code sent to')} <span className="text-cyan-400">{newEmail}</span>
            </p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-center text-lg font-mono tracking-[0.5em] outline-none focus:border-cyan-500"
              maxLength={6}
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setStep('form'); setCode(''); clearError() }}
                className="flex-1 px-3 py-1.5 text-neutral-500 hover:text-neutral-300 text-xs"
              >
                {t('back', 'Back')}
              </button>
              <button
                onClick={handleVerify}
                disabled={loading || code.length !== 6}
                className="flex-1 px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-xs disabled:opacity-50"
              >
                {loading ? t('verifying', 'Verifying...') : t('verify', 'Verify')}
              </button>
            </div>
          </>
        )}
      </div>
    </TerminalCard>
  )
}
