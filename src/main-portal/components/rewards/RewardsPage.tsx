// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Gift, Send, Trophy, History, Users, Coins, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { apiService } from '../../lib/api-service'
import { useTranslations } from 'next-intl'

interface RewardHistory {
  id: number
  manager_id: string
  recipient_id: string
  amount: number
  reason: string
  unit_id: number
  created_at: string
  manager_email?: string
  recipient_email?: string
}

interface RewardStats {
  total_sent: number
  total_received: number
  send_count: number
  receive_count: number
}

interface LeaderboardEntry {
  user_id: string
  email: string
  total_received?: number
  total_sent?: number
  reward_count: number
}

export default function RewardsPage() {
  const t = useTranslations('rewardsDash')
  const [history, setHistory] = useState<RewardHistory[]>([])
  const [stats, setStats] = useState<RewardStats | null>(null)
  const [topRecipients, setTopRecipients] = useState<LeaderboardEntry[]>([])
  const [topSenders, setTopSenders] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('history')
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [showBatchDialog, setShowBatchDialog] = useState(false)

  const [singleReward, setSingleReward] = useState({
    recipient_id: '',
    amount: '',
    reason: ''
  })

  const [batchRewards, setBatchRewards] = useState<{user_id: string, amount: string, reason: string}[]>([
    { user_id: '', amount: '', reason: '' }
  ])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      try {
        const historyRes = await apiService.get('/organization/rewards/history?limit=50')
        if (historyRes.success) {
          setHistory(Array.isArray(historyRes.rewards) ? historyRes.rewards : [])
          setStats(historyRes.stats || null)
        }
      } catch (e) {
        console.warn('[Rewards] Failed to fetch reward history:', e)
        setHistory([])
      }

      try {
        const leaderboardRes = await apiService.get('/organization/rewards/leaderboard?period=month&limit=10')
        if (leaderboardRes.success) {
          setTopRecipients(Array.isArray(leaderboardRes.top_recipients) ? leaderboardRes.top_recipients : [])
          setTopSenders(Array.isArray(leaderboardRes.top_senders) ? leaderboardRes.top_senders : [])
        }
      } catch (e) {
        console.warn('[Rewards] Failed to fetch leaderboard:', e)
        setTopRecipients([])
        setTopSenders([])
      }
    } catch (error) {
      console.error('Failed to fetch rewards data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendReward = async () => {
    if (!singleReward.recipient_id || !singleReward.amount) {
      toast.error(t('fillRequired'))
      return
    }

    try {
      const res = await apiService.post('/organization/rewards/send', {
        recipient_id: singleReward.recipient_id,
        amount: parseFloat(singleReward.amount),
        reason: singleReward.reason
      })

      if (res.success) {
        toast.success(t('sent', { amount: res.amount }))
        setShowSendDialog(false)
        setSingleReward({ recipient_id: '', amount: '', reason: '' })
        fetchData()
      } else {
        toast.error(res.error || t('sendFailed'))
      }
    } catch (error) {
      toast.error(t('networkError'))
    }
  }

  const handleBatchReward = async () => {
    const validRewards = batchRewards.filter(r => r.user_id && r.amount)
    if (validRewards.length === 0) {
      toast.error(t('addValidReward'))
      return
    }

    try {
      const res = await apiService.post('/organization/rewards/batch', {
        rewards: validRewards.map(r => ({
          user_id: r.user_id,
          amount: parseFloat(r.amount),
          reason: r.reason
        }))
      })

      if (res.success) {
        toast.success(t('batchComplete', { success: res.total_sent, failed: res.total_failed }))
        setShowBatchDialog(false)
        setBatchRewards([{ user_id: '', amount: '', reason: '' }])
        fetchData()
      } else {
        toast.error(res.error || t('sendFailed'))
      }
    } catch (error) {
      toast.error(t('networkError'))
    }
  }

  const addBatchRow = () => {
    setBatchRewards([...batchRewards, { user_id: '', amount: '', reason: '' }])
  }

  const removeBatchRow = (index: number) => {
    setBatchRewards(batchRewards.filter((_, i) => i !== index))
  }

  const updateBatchRow = (index: number, field: string, value: string) => {
    const updated = [...batchRewards]
    updated[index] = { ...updated[index], [field]: value }
    setBatchRewards(updated)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-7xl mx-auto font-mono space-y-6">
      {}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Gift className="h-6 w-6" />
            {t('title')}
          </h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
            <DialogTrigger asChild>
              <Button><Send className="h-4 w-4 mr-2" />{t('sendReward')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('sendSingleTitle')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">{t('recipientId')}</label>
                  <Input
                    value={singleReward.recipient_id}
                    onChange={(e) => setSingleReward({...singleReward, recipient_id: e.target.value})}
                    placeholder={t('recipientPlaceholder')}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{t('rewardAmount')}</label>
                  <Input
                    type="number"
                    value={singleReward.amount}
                    onChange={(e) => setSingleReward({...singleReward, amount: e.target.value})}
                    placeholder={t('amountPlaceholder')}
                    min={1}
                    max={10000}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{t('reasonLabel')}</label>
                  <Textarea
                    value={singleReward.reason}
                    onChange={(e) => setSingleReward({...singleReward, reason: e.target.value})}
                    placeholder={t('reasonPlaceholder')}
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSendDialog(false)}>{t('cancel')}</Button>
                <Button onClick={handleSendReward}>{t('send')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
            <DialogTrigger asChild>
              <Button variant="outline"><Users className="h-4 w-4 mr-2" />{t('batchReward')}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('batchTitle')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {batchRewards.map((reward, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Input
                      value={reward.user_id}
                      onChange={(e) => updateBatchRow(index, 'user_id', e.target.value)}
                      placeholder={t('userId')}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={reward.amount}
                      onChange={(e) => updateBatchRow(index, 'amount', e.target.value)}
                      placeholder="MCC"
                      className="w-24"
                    />
                    <Input
                      value={reward.reason}
                      onChange={(e) => updateBatchRow(index, 'reason', e.target.value)}
                      placeholder={t('reason')}
                      className="flex-1"
                    />
                    {batchRewards.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeBatchRow(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addBatchRow} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />{t('addRow')}
                </Button>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBatchDialog(false)}>{t('cancel')}</Button>
                <Button onClick={handleBatchReward}>{t('batchSend')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-white">{Number(stats.total_received || 0).toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">{t('mccReceived')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-cyan-400">{Number(stats.total_sent || 0).toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">{t('mccSent')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{stats.receive_count}</div>
              <div className="text-sm text-muted-foreground">{t('receiveCount')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{stats.send_count}</div>
              <div className="text-sm text-muted-foreground">{t('sendCount')}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <History className="h-4 w-4" />{t('historyTab')}
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />{t('leaderboardTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t('rewardHistory')}</CardTitle>
              <CardDescription>{t('rewardHistoryDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">{t('loadingText')}</div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">{t('noRecords')}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('time')}</TableHead>
                      <TableHead>{t('sender')}</TableHead>
                      <TableHead>{t('recipient')}</TableHead>
                      <TableHead className="text-right">{t('amount')}</TableHead>
                      <TableHead>{t('reason')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(record.created_at)}
                        </TableCell>
                        <TableCell>{record.manager_email || record.manager_id}</TableCell>
                        <TableCell>{record.recipient_email || record.recipient_id}</TableCell>
                        <TableCell className="text-right font-medium">
                          <span className="text-white">+{Number(record.amount || 0).toFixed(2)} MCC</span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {record.reason || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <div className="grid md:grid-cols-2 gap-6">
            {}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-cyan-400" />
                  {t('topReceived')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topRecipients.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">{t('noData')}</div>
                ) : (
                  <div className="space-y-3">
                    {topRecipients.map((entry, index) => (
                      <div key={entry.user_id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={index < 3 ? 'default' : 'outline'}>
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{entry.email || entry.user_id}</span>
                        </div>
                        <span className="text-white font-medium">
                          {Number(entry.total_received || 0).toFixed(2)} MCC
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-cyan-400" />
                  {t('topSent')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topSenders.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">{t('noData')}</div>
                ) : (
                  <div className="space-y-3">
                    {topSenders.map((entry, index) => (
                      <div key={entry.user_id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={index < 3 ? 'default' : 'outline'}>
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{entry.email || entry.user_id}</span>
                        </div>
                        <span className="text-cyan-400 font-medium">
                          {Number(entry.total_sent || 0).toFixed(2)} MCC
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
