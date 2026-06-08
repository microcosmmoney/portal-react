"use client"

import { useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { changePassword } from "../../lib/auth-service"
import { toast } from "sonner"
import { Lock } from "lucide-react"

export default function PasswordChangeCard() {
  const [open, setOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const reset = () => {
    setOpen(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) return
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }
    if (newPassword === currentPassword) {
      toast.error("New password must differ from current password")
      return
    }
    setSubmitting(true)
    try {
      await changePassword(currentPassword, newPassword)
      toast.success("Password changed successfully")
      reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password")
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) {
    return (
      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="h-4 w-4 text-neutral-400" />
            <span className="text-sm text-neutral-300 font-medium tracking-wider">change_password</span>
          </div>
          <p className="text-xs text-neutral-400 mb-3">
            Update your account password. Your password is shared across all Microcosm-connected apps.
          </p>
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 bg-transparent text-xs"
          >
            Change Password
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-neutral-900 border-neutral-700 dash-card">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-neutral-400" />
          <span className="text-sm text-neutral-300 font-medium tracking-wider">change_password</span>
        </div>

        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          autoComplete="current-password"
          className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-sm outline-none focus:border-cyan-500"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password (min 8 characters)"
          autoComplete="new-password"
          className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-sm outline-none focus:border-cyan-500"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          autoComplete="new-password"
          className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded text-sm outline-none focus:border-cyan-500"
        />

        <div className="flex gap-2">
          <Button
            onClick={reset}
            variant="ghost"
            className="flex-1 text-neutral-500 hover:text-neutral-300 text-xs"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !currentPassword || !newPassword || !confirmPassword}
            className="flex-1 bg-cyan-700 hover:bg-cyan-600 text-white text-xs"
          >
            {submitting ? 'Saving...' : 'Update Password'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
