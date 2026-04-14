// AI-generated · AI-managed · AI-maintained
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import {
  joinStation,
  leaveStation,
  joinStationQueue,
  getQueueStatus,
  cancelQueue,
  getAdminQueueStatus,
  processQueue,
  checkExpansionNeeded,
  triggerExpansion
} from '../../lib/api-service';
import type { UserQueueStatus, AdminQueueStatus, ExpansionCheckResult } from '../../lib/types/api';
import {
  Users,
  Clock,
  Building2,
  LogIn,
  LogOut,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Timer,
  Play,
  Plus,
  Info,
  Loader2,
  Shield,
  Pickaxe,
  Gem,
  Crown,
  Star,
  Sparkles,
  Rocket
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function QueueStatusPage() {
  const t = useTranslations('queueStatus');
  const { isAdmin, user } = useAuth();
  const [userQueue, setUserQueue] = useState<UserQueueStatus | null>(null);
  const [adminQueue, setAdminQueue] = useState<AdminQueueStatus | null>(null);
  const [expansionCheck, setExpansionCheck] = useState<ExpansionCheckResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [showExpansionDialog, setShowExpansionDialog] = useState(false);

  const [preferredStation, setPreferredStation] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [batchSize, setBatchSize] = useState(50);

  const USER_LEVEL_INFO: Record<string, { label: string; labelEn: string; icon: React.ReactNode; color: string; bgColor: string }> = {
    miner: { label: t('miner'), labelEn: 'Miner', icon: <Gem className="w-5 h-5" />, color: 'text-cyan-300', bgColor: 'bg-cyan-900/30' },
    commander: { label: t('commander'), labelEn: 'Commander', icon: <Star className="w-5 h-5" />, color: 'text-cyan-300', bgColor: 'bg-cyan-900/30' },
    pioneer: { label: t('pioneer'), labelEn: 'Pioneer', icon: <Rocket className="w-5 h-5" />, color: 'text-cyan-300', bgColor: 'bg-cyan-400/10' },
    warden: { label: t('warden'), labelEn: 'Warden', icon: <Sparkles className="w-5 h-5" />, color: 'text-pink-400', bgColor: 'bg-pink-900/30' },
    admiral: { label: t('admiral'), labelEn: 'Admiral', icon: <Crown className="w-5 h-5" />, color: 'text-cyan-300', bgColor: 'bg-cyan-400/10' },
  };

  const getUserLevelInfo = (userType?: string) => {
    if (!userType) return USER_LEVEL_INFO.miner;
    return USER_LEVEL_INFO[userType.toLowerCase()] || USER_LEVEL_INFO.miner;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      try {
        const queueRes = await getQueueStatus();
        if (queueRes.success) {
          setUserQueue(queueRes);
        }
      } catch (e) {
        console.warn('[QueueStatus] Failed to fetch user queue status:', e);
      }

      if (isAdmin()) {
        try {
          const adminRes = await getAdminQueueStatus();
          if (adminRes.success) {
            setAdminQueue(adminRes);
          }
        } catch (e) {
          console.warn('[QueueStatus] Failed to fetch admin queue status:', e);
        }

        try {
          const expansionRes = await checkExpansionNeeded();
          if (expansionRes.success) {
            setExpansionCheck(expansionRes);
          }
        } catch (e) {
          console.warn('[QueueStatus] Failed to fetch expansion check:', e);
        }
      }
    } catch (error) {
      console.error('[QueueStatus] Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success(t('refreshed'));
  };

  const handleJoinStation = async () => {
    try {
      setSubmitting(true);
      const result = await joinStation(preferredStation || undefined, true);
      if (result.success) {
        toast.success(result.data?.message || t('joinSuccess'));
        setShowJoinDialog(false);
        setPreferredStation('');
        loadData();
      } else {
        toast.error(result.error || t('joinFailed'));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('joinFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinQueue = async () => {
    try {
      setSubmitting(true);
      const result = await joinStationQueue(preferredStation || undefined);
      if (result.success) {
        toast.success(result.data?.message || t('queueJoinSuccess'));
        setShowJoinDialog(false);
        setPreferredStation('');
        loadData();
      } else {
        toast.error(result.error || t('queueJoinFailed'));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('queueJoinFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaveStation = async () => {
    try {
      setSubmitting(true);
      const result = await leaveStation(leaveReason || undefined);
      if (result.success) {
        toast.success(result.data?.message || t('leaveSuccess'));
        setShowLeaveDialog(false);
        setLeaveReason('');
        loadData();
      } else {
        toast.error(result.error || t('leaveFailed'));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('leaveFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelQueue = async () => {
    try {
      setSubmitting(true);
      const result = await cancelQueue();
      if (result.success) {
        toast.success(result.data?.message || t('cancelSuccess'));
        setShowCancelDialog(false);
        loadData();
      } else {
        toast.error(result.error || t('cancelFailed'));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('cancelFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleProcessQueue = async () => {
    try {
      setSubmitting(true);
      const result = await processQueue(batchSize);
      if (result.success) {
        toast.success(t('processComplete', { assigned: result.assigned, processed: result.processed }));
        setShowProcessDialog(false);
        loadData();
      } else {
        toast.error(t('processFailed'));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('processFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleTriggerExpansion = async () => {
    try {
      setSubmitting(true);
      const result = await triggerExpansion();
      if (result.success) {
        toast.success(result.message || t('expansionSuccess', { territory: result.new_territory_id ?? '' }));
        setShowExpansionDialog(false);
        loadData();
      } else {
        toast.error(result.error || t('expansionFailed'));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('expansionFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const getQueueStatusBadge = (status?: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-cyan-400/20 text-cyan-300 border-cyan-400/30">{t('pending')}</Badge>;
      case 'processing':
        return <Badge className="bg-cyan-900/50 text-cyan-300 border-cyan-800">{t('processing')}</Badge>;
      case 'completed':
        return <Badge className="bg-white/20 text-white border-neutral-700">{t('completed')}</Badge>;
      case 'failed':
        return <Badge className="bg-red-900/50 text-red-400 border-red-800">{t('failed')}</Badge>;
      case 'cancelled':
        return <Badge className="bg-neutral-900 text-neutral-400 border-neutral-800">{t('cancelled')}</Badge>;
      default:
        return <Badge className="bg-neutral-900 text-neutral-500 border-neutral-800">{t('unknown')}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto font-mono space-y-6">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
          <p className="text-neutral-400 mt-1">{t('subtitle')}</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-neutral-800 hover:bg-neutral-700 text-white"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {t('refresh')}
        </Button>
      </div>

      {}
      <Card className="bg-black border-neutral-800 dash-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t('myStatus')}
          </CardTitle>
          <CardDescription className="text-neutral-400">
            {t('myStatusDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-neutral-400" />
              <p className="text-neutral-400 mt-2">{t('loading')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {}
              {(() => {
                const levelInfo = getUserLevelInfo(userQueue?.user_type);
                return (
                  <div className={`rounded-lg p-4 border border-neutral-800 ${levelInfo.bgColor}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${levelInfo.color}`}>
                          {levelInfo.icon}
                        </div>
                        <div>
                          <p className="text-sm text-neutral-400">{t('currentPosition')}</p>
                          <p className={`text-lg font-semibold ${levelInfo.color}`}>
                            {levelInfo.label}
                            <span className="text-neutral-500 text-sm ml-2">({levelInfo.labelEn})</span>
                          </p>
                        </div>
                      </div>
                      <Badge className={`${levelInfo.bgColor} ${levelInfo.color} border-current`}>
                        Lv.{Object.keys(USER_LEVEL_INFO).indexOf(userQueue?.user_type?.toLowerCase() || 'miner') + 3}
                      </Badge>
                    </div>
                  </div>
                );
              })()}

              {userQueue?.is_onboarded ? (
                <div className="bg-neutral-950 rounded-lg p-6 border border-neutral-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-cyan-400/10 rounded-full p-3">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{t('onboarded')}</h3>
                        <p className="text-sm text-neutral-400">
                          {t('onboardedTo', { station: userQueue.station_name || userQueue.territory_id || '' })}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-white/20 text-white border-neutral-700">{t('active')}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-900 rounded-lg p-4 text-center">
                      <p className="text-xl font-bold text-white font-mono">{userQueue.territory_id}</p>
                      <p className="text-sm text-neutral-400">{t('territoryId')}</p>
                    </div>
                    <Button
                      onClick={() => setShowLeaveDialog(true)}
                      className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 h-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('applyLeave')}
                    </Button>
                  </div>
                </div>
              ) : userQueue?.in_queue ? (
                <div className="bg-neutral-950 rounded-lg p-6 border border-neutral-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-cyan-400/10 rounded-full p-3">
                        <Timer className="w-6 h-6 text-cyan-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{t('inQueue')}</h3>
                        <p className="text-sm text-neutral-400">{t('waitingAssignment')}</p>
                      </div>
                    </div>
                    {getQueueStatusBadge(userQueue.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white font-mono">{userQueue.position || '-'}</p>
                      <p className="text-sm text-neutral-400">{t('currentPos')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white font-mono">
                        {userQueue.estimated_wait_minutes || '-'}
                      </p>
                      <p className="text-sm text-neutral-400">{t('estimatedWait')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-white truncate">
                        {userQueue.preferred_territory_id || t('autoAssign')}
                      </p>
                      <p className="text-sm text-neutral-400">{t('preferredTerritory')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-white">
                        {userQueue.joined_at ? new Date(userQueue.joined_at).toLocaleString() : '-'}
                      </p>
                      <p className="text-sm text-neutral-400">{t('joinedAt')}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowCancelDialog(true)}
                    className="w-full bg-neutral-800 hover:bg-neutral-700 text-white"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {t('cancelQueue')}
                  </Button>
                </div>
              ) : (
                <div className="bg-neutral-950 rounded-lg p-6 border border-neutral-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-neutral-800 rounded-full p-3">
                      <Building2 className="w-6 h-6 text-neutral-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{t('notOnboarded')}</h3>
                      <p className="text-sm text-neutral-400">{t('notOnboardedDesc')}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowJoinDialog(true)}
                    className="w-full bg-white/20 hover:bg-neutral-800 text-white border border-neutral-700"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('joinNow')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {}
      {isAdmin() && adminQueue && (
        <Card className="bg-black border-neutral-800 dash-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t('queueManagement')}
            </CardTitle>
            <CardDescription className="text-neutral-400">
              {t('queueManagementDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-neutral-950 rounded-lg p-4 border border-neutral-800 text-center">
                <p className="text-3xl font-bold text-white font-mono">{adminQueue.pending_count}</p>
                <p className="text-sm text-neutral-400">{t('pending')}</p>
              </div>
              <div className="bg-neutral-950 rounded-lg p-4 border border-neutral-800 text-center">
                <p className="text-3xl font-bold text-white font-mono">{adminQueue.processing_count}</p>
                <p className="text-sm text-neutral-400">{t('processing')}</p>
              </div>
              <div className="bg-neutral-950 rounded-lg p-4 border border-neutral-800 text-center">
                <p className="text-3xl font-bold text-white font-mono">{adminQueue.total_in_queue}</p>
                <p className="text-sm text-neutral-400">{t('totalInQueue')}</p>
              </div>
              <div className="bg-neutral-950 rounded-lg p-4 border border-neutral-800 text-center">
                <p className="text-sm font-semibold text-white">
                  {adminQueue.oldest_pending
                    ? new Date(adminQueue.oldest_pending).toLocaleString()
                    : '-'}
                </p>
                <p className="text-sm text-neutral-400">{t('oldestPending')}</p>
              </div>
            </div>

            <Button
              onClick={() => setShowProcessDialog(true)}
              disabled={adminQueue.pending_count === 0}
              className="w-full bg-cyan-900/50 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-800"
            >
              <Play className="w-4 h-4 mr-2" />
              {t('processQueue')}
            </Button>
          </CardContent>
        </Card>
      )}

      {}
      {isAdmin() && expansionCheck && (
        <Card className="bg-black border-neutral-800 dash-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {t('expansionTitle')}
            </CardTitle>
            <CardDescription className="text-neutral-400">
              {t('expansionDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-neutral-950 rounded-lg p-4 border border-neutral-800 text-center">
                <p className="text-3xl font-bold text-white font-mono">
                  {expansionCheck.current_stats.total_stations}
                </p>
                <p className="text-sm text-neutral-400">{t('totalTerritories')}</p>
              </div>
              <div className="bg-neutral-950 rounded-lg p-4 border border-neutral-800 text-center">
                <p className="text-3xl font-bold text-white font-mono">
                  {expansionCheck.current_stats.full_stations}
                </p>
                <p className="text-sm text-neutral-400">{t('fullTerritories')}</p>
              </div>
              <div className="bg-neutral-950 rounded-lg p-4 border border-neutral-800 text-center">
                <p className="text-3xl font-bold text-white font-mono">
                  {(expansionCheck.current_stats.avg_occupancy * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-neutral-400">{t('avgOccupancy')}</p>
              </div>
              <div className="bg-neutral-950 rounded-lg p-4 border border-neutral-800 text-center">
                <p className="text-3xl font-bold text-white font-mono">
                  {expansionCheck.current_stats.pending_queue}
                </p>
                <p className="text-sm text-neutral-400">{t('queueWaiting')}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-lg border border-neutral-800 mb-4">
              <div className="flex items-center gap-3">
                {expansionCheck.needs_expansion ? (
                  <>
                    <AlertTriangle className="w-6 h-6 text-cyan-300" />
                    <div>
                      <p className="text-white font-semibold">{t('needsExpansion')}</p>
                      <p className="text-sm text-neutral-400">{expansionCheck.reason}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-white" />
                    <div>
                      <p className="text-white font-semibold">{t('capacitySufficient')}</p>
                      <p className="text-sm text-neutral-400">{t('noExpansionNeeded')}</p>
                    </div>
                  </>
                )}
              </div>
              <Badge className={expansionCheck.needs_expansion
                ? 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30'
                : 'bg-white/20 text-white border-neutral-700'
              }>
                {expansionCheck.needs_expansion ? t('suggestExpansion') : t('normal')}
              </Badge>
            </div>

            <Button
              onClick={() => setShowExpansionDialog(true)}
              className="w-full bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 border border-cyan-400/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('triggerExpansion')}
            </Button>
          </CardContent>
        </Card>
      )}

      {}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="bg-neutral-900 border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-white">{t('joinDialogTitle')}</DialogTitle>
            <DialogDescription className="text-neutral-400">
              {t('joinDialogDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-neutral-300">{t('preferredStationLabel')}</Label>
              <Input
                value={preferredStation}
                onChange={(e) => setPreferredStation(e.target.value)}
                placeholder={t('preferredStationPlaceholder')}
                className="bg-neutral-800 border-neutral-700 text-white mt-1"
              />
              <p className="text-xs text-neutral-500 mt-1">
                {t('preferredStationHint')}
              </p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowJoinDialog(false)}
              disabled={submitting}
              className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleJoinQueue}
              disabled={submitting}
              className="bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 border border-cyan-400/30"
            >
              {submitting ? t('submitting') : t('joinQueue')}
            </Button>
            <Button
              onClick={handleJoinStation}
              disabled={submitting}
              className="bg-white/20 hover:bg-neutral-800 text-white border border-neutral-700"
            >
              {submitting ? t('submitting') : t('immediateJoin')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="bg-neutral-900 border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-white">{t('leaveDialogTitle')}</DialogTitle>
            <DialogDescription className="text-neutral-400">
              {t('leaveDialogDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-neutral-300">{t('leaveReasonLabel')}</Label>
              <Input
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder={t('leaveReasonPlaceholder')}
                className="bg-neutral-800 border-neutral-700 text-white mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLeaveDialog(false)}
              disabled={submitting}
              className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleLeaveStation}
              disabled={submitting}
              className="bg-red-900/50 hover:bg-red-900/70 text-red-400 border border-red-800"
            >
              {submitting ? t('submitting') : t('confirmLeave')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-neutral-900 border-neutral-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">{t('cancelQueueTitle')}</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              {t('cancelQueueDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={submitting}
              className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700"
            >
              {t('goBack')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelQueue}
              disabled={submitting}
              className="bg-red-900/50 hover:bg-red-900/70 text-red-400 border border-red-800"
            >
              {submitting ? t('submitting') : t('confirmCancel')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {}
      <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <DialogContent className="bg-neutral-900 border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-white">{t('processDialogTitle')}</DialogTitle>
            <DialogDescription className="text-neutral-400">
              {t('processDialogDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-neutral-300">{t('batchSize')}</Label>
              <Input
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value) || 50)}
                min={1}
                max={200}
                className="bg-neutral-800 border-neutral-700 text-white mt-1"
              />
              <p className="text-xs text-neutral-500 mt-1">
                {t('batchSizeHint')}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowProcessDialog(false)}
              disabled={submitting}
              className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleProcessQueue}
              disabled={submitting}
              className="bg-cyan-900/50 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-800"
            >
              {submitting ? t('submitting') : t('startProcessing')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {}
      <AlertDialog open={showExpansionDialog} onOpenChange={setShowExpansionDialog}>
        <AlertDialogContent className="bg-neutral-900 border-neutral-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">{t('expansionDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              {t('expansionDialogDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={submitting}
              className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700"
            >
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTriggerExpansion}
              disabled={submitting}
              className="bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 border border-cyan-400/30"
            >
              {submitting ? t('submitting') : t('confirmExpansion')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
