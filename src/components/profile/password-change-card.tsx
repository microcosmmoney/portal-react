'use client'

import { useState } from 'react'
import { useChangePassword } from '@microcosmmoney/auth-react'
import { TerminalCard } from '../terminal'
import { useTranslations } from '../../i18n-context'

export interface MicrocosmPasswordChangeCardProps {
  onSessionRotated?: (newToken: string) => void
  onSuccess?: () => void
}

export function MicrocosmPasswordChangeCard({ onSessionRotated, onSuccess }: MicrocosmPasswordChangeCardProps = {}) {
  const t = useTranslations('profile')
  const { changePassword, loading, error, clearError } = useChangePassword()
  const [open, setOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const reset = () => {
    setOpen(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setLocalError(null)
    clearError()
  }

  const handleSubmit = async () => {
    setLocalError(null)
    if (!currentPassword || !newPassword) return
    if (newPassword.length < 8) {
      setLocalError(t('passwordTooShort', 'New password must be at least 8 characters'))
      return
    }
    if (newPassword !== confirmPassword) {
      setLocalError(t('passwordMismatch', 'New passwords do not match'))
      return
    }
    if (newPassword === currentPassword) {
      setLocalError(t('passwordSame', 'New password must differ from current password'))
      return
    }
    clearError()
    try {
      const res = await changePassword(currentPassword, newPassword)
      if (res.session_token) onSessionRotated?.(res.session_token)
      reset()
      onSuccess?.()
    } catch {}
  }

  if (!open) {
    return (
      <TerminalCard>
        <div className="flex items-center gap-2 mb-2 2xs:mb-3">
          <span className="text-xs 2xs:text-sm text-neutral-300 font-medium tracking-wider">{t('changePassword', 'CHANGE PASSWORD')}</span>
        </div>
        <p className="text-[10px] 2xs:text-xs text-neutral-400 mb-2 2xs:mb-3">
          {t('changePasswordDesc', 'Update your account password. It is shared across all Microcosm-connected apps.')}
        </p>
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-1.5 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 rounded text-xs"
        >
          {t('changePasswordBtn', 'Change Password')}
        </button>
      </TerminalCard>
    )
  }

  const shownError = localError || error

  return (
    <TerminalCard>
      <div className="space-y-3 2xs:space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs 2xs:text-sm text-neutral-300 font-medium tracking-wider">{t('changePassword', 'CHANGE PASSWORD')}</span>
        </div>

        {shownError && (
          <div className="p-2 bg-red-900/20 border border-red-800 rounded text-xs text-red-300">{shownError}</div>
        )}

        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder={t('currentPasswordPlaceholder', 'Current password')}
          autoComplete="current-password"
          className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-xs 2xs:text-sm outline-none focus:border-cyan-500"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder={t('newPasswordPlaceholder', 'New password (min 8 characters)')}
          autoComplete="new-password"
          className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-xs 2xs:text-sm outline-none focus:border-cyan-500"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t('confirmPasswordPlaceholder', 'Confirm new password')}
          autoComplete="new-password"
          className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-xs 2xs:text-sm outline-none focus:border-cyan-500"
        />

        <div className="flex gap-2">
          <button
            onClick={reset}
            className="flex-1 px-3 py-1.5 text-neutral-500 hover:text-neutral-300 text-xs"
          >
            {t('cancel', 'Cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            className="flex-1 px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-xs disabled:opacity-50"
          >
            {loading ? t('saving', 'Saving...') : t('updatePassword', 'Update Password')}
          </button>
        </div>
      </div>
    </TerminalCard>
  )
}
