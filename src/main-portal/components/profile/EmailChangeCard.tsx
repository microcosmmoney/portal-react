"use client"

import { useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { requestEmailChange, verifyEmailChange } from "../../lib/auth-service"
import { toast } from "sonner"
import { Mail } from "lucide-react"

export default function EmailChangeCard() {
  const [step, setStep] = useState<'idle' | 'form' | 'verify'>('idle')
  const [newEmail, setNewEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleRequestChange = async () => {
    if (!newEmail || !password) return
    setSubmitting(true)
    try {
      await requestEmailChange(newEmail, password)
      setStep('verify')
      toast.success('Verification code sent to new email')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerify = async () => {
    if (!code || code.length !== 6) return
    setSubmitting(true)
    try {
      await verifyEmailChange(newEmail, code)
      toast.success('Email changed successfully')
      setStep('idle')
      setNewEmail("")
      setPassword("")
      setCode("")
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'idle') {
    return (
      <div id="change-email">
        <Card className="bg-neutral-900 border-neutral-700 dash-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-4 w-4 text-neutral-400" />
              <span className="text-sm text-neutral-300 font-medium tracking-wider">change_email</span>
            </div>
            <p className="text-xs text-neutral-400 mb-3">
              Update your email address. A verification code will be sent to the new email.
            </p>
            <Button
              onClick={() => setStep('form')}
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 bg-transparent text-xs"
            >
              Change Email
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div id="change-email">
      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-neutral-400" />
            <span className="text-sm text-neutral-300 font-medium tracking-wider">change_email</span>
          </div>

          {step === 'form' && (
            <>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New email address"
                className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-sm outline-none focus:border-cyan-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Current password"
                className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-sm outline-none focus:border-cyan-500"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => { setStep('idle'); setNewEmail(''); setPassword(''); }}
                  variant="ghost"
                  className="flex-1 text-neutral-500 hover:text-neutral-300 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRequestChange}
                  disabled={submitting || !newEmail || !password}
                  className="flex-1 bg-cyan-700 hover:bg-cyan-600 text-white text-xs"
                >
                  {submitting ? 'Sending...' : 'Send Code'}
                </Button>
              </div>
            </>
          )}

          {step === 'verify' && (
            <>
              <p className="text-xs text-neutral-400">
                Enter the 6-digit code sent to <span className="text-cyan-400">{newEmail}</span>
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
                <Button
                  onClick={() => { setStep('form'); setCode(''); }}
                  variant="ghost"
                  className="flex-1 text-neutral-500 hover:text-neutral-300 text-xs"
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerify}
                  disabled={submitting || code.length !== 6}
                  className="flex-1 bg-cyan-700 hover:bg-cyan-600 text-white text-xs"
                >
                  {submitting ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
