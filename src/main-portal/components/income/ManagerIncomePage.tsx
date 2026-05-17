// AI-generated · AI-managed · AI-maintained
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { getManagerIncome } from '../../lib/api-service';
import type { ManagerIncomeSummary, ManagerLevel } from '../../lib/types/api';
import { ManagerRoleNames, ManagerShareRatios } from '../../lib/types/api';
import { cn } from '../../lib/utils';
import {
  Building2,
  Grid3x3,
  Map as MapIcon,
  Globe,
  TrendingUp,
  Wallet,
  PiggyBank,
  Users,
  RefreshCw,
  Info,
  History,
  Loader2
} from 'lucide-react';
import { MiningDistributionHistory } from '../mining/MiningDistributionHistory';
import { useTranslations } from 'next-intl';

const getLevelIcon = (level: ManagerLevel) => {
  switch (level) {
    case 'station': return <Building2 className="w-5 h-5" />;
    case 'matrix': return <Grid3x3 className="w-5 h-5" />;
    case 'sector': return <MapIcon className="w-5 h-5" />;
    case 'system': return <Globe className="w-5 h-5" />;
  }
};

const getLevelColor = (level: ManagerLevel) => {
  switch (level) {
    case 'station': return 'text-neutral-300';
    case 'matrix': return 'text-cyan-400';
    case 'sector': return 'text-cyan-400';
    case 'system': return 'text-cyan-400';
  }
};

const getLevelLabel = (level: ManagerLevel) => {
  switch (level) {
    case 'station': return 'Station';
    case 'matrix': return 'Matrix';
    case 'sector': return 'Sector';
    case 'system': return 'System';
  }
};

export default function ManagerIncomePage() {
  const t = useTranslations('managerIncome');
  
  const [income, setIncome] = useState<ManagerIncomeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const getDateParams = () => {
    const now = new Date();
    let start: string | undefined;
    let end: string | undefined;

    if (dateRange === '7d') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      start = d.toISOString().split('T')[0];
    } else if (dateRange === '30d') {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      start = d.toISOString().split('T')[0];
    } else if (dateRange === '90d') {
      const d = new Date(now);
      d.setDate(d.getDate() - 90);
      start = d.toISOString().split('T')[0];
    }

    if (startDate) start = startDate;
    if (endDate) end = endDate;

    return { start, end };
  };

  const loadData = async () => {
    setLoading(true);
    const { start, end } = getDateParams();

    try {
      const incomeRes = await getManagerIncome(start, end);
      if (incomeRes.success) {
        setIncome(incomeRes);
      } else {
        console.warn('[ManagerIncome] Failed to fetch income data:', incomeRes.error);
      }
    } catch (e) {
      console.warn('[ManagerIncome] Failed to fetch income data:', e);
      setIncome(null);
    }

    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success(t('refreshed'));
  };

  const handleCustomDateSearch = () => {
    if (startDate || endDate) {
      setDateRange('all');
      loadData();
    }
  };

  const totalIncome = income?.total_income ? parseFloat(income.total_income) : 0;

  const levels: ManagerLevel[] = ['station', 'matrix', 'sector', 'system'];
  const levelIncomes = levels.map(level => ({
    level,
    data: income?.income_by_level?.[level],
    share: ManagerShareRatios[level],
    role: ManagerRoleNames[level]
  }));

  const maxIncome = Math.max(
    ...levelIncomes.map(l => l.data?.total_income ? parseFloat(l.data.total_income) : 0)
  ) || 1;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1>
          <p className="text-xs sm:text-sm text-neutral-400">{t('subtitle')}</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400 mr-3" />
          <span className="text-neutral-400">{t('loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1>
          <p className="text-xs sm:text-sm text-neutral-400">{t('subtitle')}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
          {t('refresh')}
        </Button>
      </div>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <Info className="w-4 h-4" />
            <span className="tracking-wider">{t('distributionRatio')}</span>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            <div className="text-center p-3 bg-neutral-800 rounded border border-neutral-700">
              <Users className="w-4 h-4 mx-auto mb-1 text-white" />
              <div className="text-lg font-bold text-white font-mono">50%</div>
              <div className="text-xs text-neutral-500">{t('userMcc')}</div>
            </div>
            <div className="text-center p-3 bg-neutral-800 rounded border border-neutral-700">
              <PiggyBank className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
              <div className="text-lg font-bold text-cyan-400 font-mono">10%</div>
              <div className="text-xs text-neutral-500">{t('teamMcc')}</div>
            </div>
            <div className="text-center p-3 bg-neutral-800 rounded border border-neutral-700">
              <Building2 className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
              <div className="text-lg font-bold text-cyan-400 font-mono">4%</div>
              <div className="text-xs text-neutral-500">{t('stationMagistrate')}</div>
            </div>
            <div className="text-center p-3 bg-neutral-800 rounded border border-neutral-700">
              <Grid3x3 className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
              <div className="text-lg font-bold text-cyan-400 font-mono">3%</div>
              <div className="text-xs text-neutral-500">{t('matrixMagistrate')}</div>
            </div>
            <div className="text-center p-3 bg-neutral-800 rounded border border-neutral-700">
              <MapIcon className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
              <div className="text-lg font-bold text-cyan-400 font-mono">2%</div>
              <div className="text-xs text-neutral-500">{t('sectorMagistrate')}</div>
            </div>
            <div className="text-center p-3 bg-neutral-800 rounded border border-neutral-700">
              <Globe className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
              <div className="text-lg font-bold text-cyan-400 font-mono">1%</div>
              <div className="text-xs text-neutral-500">{t('systemMagistrate')}</div>
            </div>
            <div className="col-span-2 text-center p-3 bg-neutral-800 rounded border border-neutral-700">
              <Wallet className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
              <div className="text-lg font-bold text-cyan-400 font-mono">30%</div>
              <div className="text-xs text-neutral-500">{t('stationVaultMcd')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex gap-2 flex-wrap">
              {(['7d', '30d', '90d', 'all'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded transition-colors",
                    dateRange === range
                      ? "bg-cyan-700 text-white"
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white"
                  )}
                >
                  {range === '7d' ? t('days7') : range === '30d' ? t('days30') : range === '90d' ? t('days90') : t('all')}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-end flex-1">
              <div>
                <Label className="text-neutral-400 text-xs tracking-wider">{t('startDate')}</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-neutral-800 border-neutral-600 text-white w-36 h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-neutral-400 text-xs tracking-wider">{t('endDate')}</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-neutral-800 border-neutral-600 text-white w-36 h-8 text-sm"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                onClick={handleCustomDateSearch}
              >
                {t('query')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-400 tracking-wider mb-1">total_manager_income</div>
              <div className="text-4xl font-bold text-white font-mono">
                {totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-lg text-neutral-500 ml-2">MCC</span>
              </div>
            </div>
            <div className="p-4 bg-neutral-800 rounded-full">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {levelIncomes.map(({ level, data, share, role }) => {
          const incomeAmount = data?.total_income ? parseFloat(data.total_income) : 0;
          const recordCount = data?.record_count || 0;
          const percentage = maxIncome > 0 ? (incomeAmount / maxIncome) * 100 : 0;

          return (
            <Card key={level} className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded bg-neutral-800", getLevelColor(level))}>
                      {getLevelIcon(level)}
                    </div>
                    <div>
                      <div className="text-white font-medium">{getLevelLabel(level)}</div>
                      <div className="text-xs text-neutral-500">{role} - {share * 100}%</div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={incomeAmount > 0
                      ? "bg-white/20 text-white border border-white/30"
                      : "bg-neutral-500/20 text-neutral-300 border border-neutral-600"
                    }
                  >
                    {incomeAmount > 0 ? t('hasIncome') : t('noIncome')}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-400">{t('cumulativeIncome')}</span>
                    <span className="text-white font-mono">
                      {incomeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} MCC
                    </span>
                  </div>
                  <div className="bg-neutral-800 rounded-full h-2">
                    <div
                      className="bg-cyan-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-700">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white font-mono">{recordCount}</div>
                    <div className="text-xs text-neutral-500">{t('outputRecords')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white font-mono">
                      {recordCount > 0 ? (incomeAmount / recordCount).toFixed(2) : '0.00'}
                    </div>
                    <div className="text-xs text-neutral-500">{t('avgPerRecord')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>


      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <History className="w-4 h-4" />
            <span className="tracking-wider">{t('outputHistory')}</span>
          </div>
          <MiningDistributionHistory
            title=""
            description=""
            showUserColumn={true}
            limit={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
