// AI-generated · AI-managed · AI-maintained
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FormattedDate } from '../ui/time-remaining';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import {
  getUnits,
  getUnitDetailedStats,
  setUnitDistributionPlan,
  getTerritoryNameStatus,
  updateTerritoryName,
  type TerritoryNameStatus
} from '../../lib/api-service';
import type { Unit, UnitType } from '../../lib/types/api';
import type { UnitDetailedStats } from '../../lib/api/services';
import { cn } from '../../lib/utils';
import {
  Building2,
  Grid3x3,
  Map as MapIcon,
  Globe,
  Users,
  DollarSign,
  Zap,
  Vault,
  TrendingUp,
  Settings,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  RefreshCw,
  Pencil,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';

const getUnitTypeIcon = (type: UnitType) => {
  switch (type) {
    case 'station': return <Building2 className="w-5 h-5" />;
    case 'matrix': return <Grid3x3 className="w-5 h-5" />;
    case 'sector': return <MapIcon className="w-5 h-5" />;
    case 'system': return <Globe className="w-5 h-5" />;
    default: return <Building2 className="w-5 h-5" />;
  }
};

const getUnitTypeLabel = (type: UnitType) => {
  switch (type) {
    case 'station': return '\u7a7a\u95f4\u7ad9';
    case 'matrix': return '\u77e9\u9635';
    case 'sector': return '\u661f\u533a';
    case 'system': return '\u661f\u7cfb';
    default: return type;
  }
};

const getUnitTypeColor = (type: UnitType) => {
  switch (type) {
    case 'station': return 'text-white';
    case 'matrix': return 'text-cyan-300';
    case 'sector': return 'text-cyan-200';
    case 'system': return 'text-cyan-400';
    default: return 'text-white';
  }
};

const getTechBonusPercentage = (type: UnitType): number => {
  switch (type) {
    case 'station': return 10;
    case 'matrix': return 20;
    case 'sector': return 30;
    case 'system': return 40;
    default: return 0;
  }
};

const distributionPlans = [
  { id: 'equal', name: '\u5e73\u7b49\u5206\u914d', description: '\u6240\u6709\u6210\u5458\u5e73\u5747\u5206\u914d\u5229\u6da6' },
  { id: 'weighted_rank', name: '\u7b49\u7ea7\u52a0\u6743', description: '\u6839\u636e\u7528\u6237\u7b49\u7ea7\u52a0\u6743\u5206\u914d' },
  { id: 'weighted_contribution', name: '\u8d21\u732e\u52a0\u6743', description: '\u6839\u636e\u4ea4\u6613\u91cf\u8d21\u732e\u52a0\u6743\u5206\u914d' },
  { id: 'hybrid', name: '\u6df7\u5408\u6a21\u5f0f', description: '\u7b49\u7ea750% + \u8d21\u732e50%' },
];

export default function StationsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | UnitType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [unitDetailsCache, setUnitDetailsCache] = useState<Record<string, UnitDetailedStats>>({});

  const [isKPIDialogOpen, setIsKPIDialogOpen] = useState(false);
  const [isDistributionDialogOpen, setIsDistributionDialogOpen] = useState(false);
  const [isNameEditDialogOpen, setIsNameEditDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const [nameStatus, setNameStatus] = useState<TerritoryNameStatus | null>(null);
  const [newName, setNewName] = useState('');
  const [nameLoading, setNameLoading] = useState(false);

  const [selectedDistributionPlan, setSelectedDistributionPlan] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadUnits(); }, [filter]);

  const loadUnits = async () => {
    try {
      setLoading(true);
      const filterParam = filter === 'all' ? undefined : filter;
      const response = await getUnits(filterParam);

      if (response.success && response.data) {
        setUnits(response.data);
        for (const unit of response.data) {
          loadStationData(unit.unit_id);
        }
      } else {
        toast.error('\u52a0\u8f7d\u9886\u5730\u5217\u8868\u5931\u8d25');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '\u52a0\u8f7d\u9886\u5730\u5217\u8868\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  };

  const loadStationData = async (unitId: string) => {
    try {
      const response = await getUnitDetailedStats(unitId);
      if (response.success && response.data) {
        setUnitDetailsCache(prev => ({ ...prev, [unitId]: response.data! }));
      }
    } catch (error) {
      console.error(`\u52a0\u8f7d\u9886\u5730 ${unitId} \u6570\u636e\u5931\u8d25:`, error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUnits();
    setRefreshing(false);
    toast.success('\u6570\u636e\u5df2\u5237\u65b0');
  };

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.unit_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (unit.location?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleSetDistributionPlan = async () => {
    if (!selectedUnit || !selectedDistributionPlan) return;
    try {
      setSubmitting(true);
      const response = await setUnitDistributionPlan(selectedUnit.unit_id, parseInt(selectedDistributionPlan));
      if (response.success) {
        toast.success('\u5206\u914d\u65b9\u6848\u8bbe\u7f6e\u6210\u529f');
        setIsDistributionDialogOpen(false);
        setSelectedDistributionPlan('');
        setSelectedUnit(null);
      } else {
        toast.error(response.error || '\u8bbe\u7f6e\u5931\u8d25');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '\u8bbe\u7f6e\u5931\u8d25');
    } finally {
      setSubmitting(false);
    }
  };

  const openNameEditDialog = async (unit: Unit) => {
    setSelectedUnit(unit);
    setNewName(unit.unit_name);
    setIsNameEditDialogOpen(true);
    setNameLoading(true);

    try {
      const response = await getTerritoryNameStatus(unit.unit_id);
      if (response.success && response.data) {
        setNameStatus(response.data);
        setNewName(response.data.current_name);
      } else {
        toast.error(response.error || '\u83b7\u53d6\u540d\u79f0\u72b6\u6001\u5931\u8d25');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '\u83b7\u53d6\u540d\u79f0\u72b6\u6001\u5931\u8d25');
    } finally {
      setNameLoading(false);
    }
  };

  const handleNameUpdate = async () => {
    if (!selectedUnit || !newName.trim()) {
      toast.error('\u8bf7\u8f93\u5165\u65b0\u7684\u9886\u5730\u540d\u79f0');
      return;
    }

    if (newName.trim().length < 2) {
      toast.error('\u9886\u5730\u540d\u79f0\u81f3\u5c11\u9700\u89812\u4e2a\u5b57\u7b26');
      return;
    }

    try {
      setSubmitting(true);
      const response = await updateTerritoryName(selectedUnit.unit_id, newName.trim());

      if (response.success) {
        toast.success(response.message || '\u9886\u5730\u540d\u79f0\u66f4\u65b0\u6210\u529f');
        setIsNameEditDialogOpen(false);
        setSelectedUnit(null);
        setNameStatus(null);
        setNewName('');
        loadUnits();
      } else {
        if (response.error?.includes('90\u5929') || response.error?.includes('cooldown')) {
          toast.error(`\u4fee\u6539\u51b7\u5374\u4e2d\uff1a${response.error}`);
        } else {
          toast.error(response.error || '\u66f4\u65b0\u5931\u8d25');
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '\u66f4\u65b0\u5931\u8d25');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">\u9886\u5730\u7ba1\u7406</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">\u7ba1\u7406\u9886\u5730NFT\u3001\u67e5\u770bKPI\u548c\u91d1\u5e93\u4f59\u989d</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          <span className="ml-2 text-neutral-400 text-sm">\u6b63\u5728\u52a0\u8f7d\u9886\u5730\u6570\u636e...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">\u9886\u5730\u7ba1\u7406</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">\u7ba1\u7406\u9886\u5730NFT\u3001\u67e5\u770bKPI\u548c\u91d1\u5e93\u4f59\u989d</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
          \u5237\u65b0
        </Button>
      </div>

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-2 text-xs text-neutral-400 tracking-wider mb-4">
            <Zap className="w-4 h-4" />
            <span>\u9886\u5730\u5347\u7ea7\u8981\u6c42</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-neutral-800 rounded">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-white" />
                <span className="text-xs text-neutral-400 tracking-wider">member_count</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono">900</div>
              <div className="text-xs text-neutral-500 mt-1">\u6700\u4f4e\u8981\u6c42\u6210\u5458\u6570</div>
            </div>
            <div className="p-3 bg-neutral-800 rounded">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-white" />
                <span className="text-xs text-neutral-400 tracking-wider">trading_volume</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono">50M</div>
              <div className="text-xs text-neutral-500 mt-1">\u6700\u4f4e\u7d2f\u8ba1\u4ea4\u6613\u91cf USDT</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-2 text-xs text-neutral-400 tracking-wider mb-4">
            <Zap className="w-4 h-4" />
            <span>\u4e0d\u540c\u5c42\u7ea7\u9886\u5730\u7684 MCC \u94f8\u9020\u52a0\u6210</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['station', 'matrix', 'sector', 'system'] as UnitType[]).map((type) => (
              <div key={type} className="p-3 bg-neutral-800 rounded text-center">
                <div className={cn("mx-auto mb-2", getUnitTypeColor(type))}>
                  {getUnitTypeIcon(type)}
                </div>
                <div className="text-xs text-neutral-400 tracking-wider mb-1">{getUnitTypeLabel(type)}</div>
                <div className="text-2xl font-bold text-white font-mono">+{getTechBonusPercentage(type)}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="\u641c\u7d22\u9886\u5730\u540d\u79f0\u6216\u4f4d\u7f6e..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 h-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'station', 'matrix', 'sector', 'system'] as const).map((f) => (
                <Button
                  key={f}
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter(f)}
                  className={cn(
                    filter === f
                      ? "bg-cyan-700 hover:bg-cyan-600 text-white border-cyan-700"
                      : "border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                  )}
                >
                  {f === 'all' ? '\u5168\u90e8' : (
                    <>
                      {f === 'station' && <Building2 className="w-3.5 h-3.5 mr-1" />}
                      {f === 'matrix' && <Grid3x3 className="w-3.5 h-3.5 mr-1" />}
                      {f === 'sector' && <MapIcon className="w-3.5 h-3.5 mr-1" />}
                      {f === 'system' && <Globe className="w-3.5 h-3.5 mr-1" />}
                      {getUnitTypeLabel(f)}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredUnits.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 text-sm">\u6682\u65e0\u9886\u5730\u6570\u636e</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUnits.map((unit) => {
            const unitDetails = unitDetailsCache[unit.unit_id];
            const memberCount = unitDetails?.metrics.member_count ?? 0;
            const maxCapacity = unitDetails?.metrics.max_capacity ?? 1000;
            const vaultMcd = unitDetails?.metrics.vault_mcd ?? 0;
            const occupancyRate = unitDetails?.metrics.occupancy_rate ?? 0;
            const isActive = occupancyRate >= 50;
            const techBonusPercent = getTechBonusPercentage(unit.unit_type);

            return (
              <Card key={unit.unit_id} className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded bg-neutral-800", getUnitTypeColor(unit.unit_type))}>
                        {getUnitTypeIcon(unit.unit_type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{unit.unit_name}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); openNameEditDialog(unit); }}
                            className="p-1 text-neutral-500 hover:text-cyan-400 rounded transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs text-neutral-400 tracking-wider">{getUnitTypeLabel(unit.unit_type)}</div>
                      </div>
                    </div>
                    <Badge className={isActive ? "bg-white/20 text-white" : "bg-neutral-500/20 text-neutral-300"}>
                      {isActive ? (
                        <><CheckCircle2 className="w-3 h-3 mr-1" />\u6d3b\u8dc3</>
                      ) : (
                        <><XCircle className="w-3 h-3 mr-1" />\u5f85\u53d1\u5c55</>
                      )}
                    </Badge>
                  </div>

                  <div className="p-3 bg-neutral-800 rounded mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-neutral-400 tracking-wider">
                        <Zap className="w-4 h-4" />
                        <span>tech_bonus</span>
                      </div>
                      <span className="text-lg font-bold text-white font-mono">+{techBonusPercent}%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-800 rounded mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-neutral-400 tracking-wider">
                        <Vault className="w-4 h-4" />
                        <span>vault_mcd</span>
                      </div>
                      <span className="text-lg font-bold text-white font-mono">{vaultMcd.toLocaleString()} MCD</span>
                    </div>
                  </div>

                  {unitDetails && (
                    <div className="space-y-3 mb-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                          <span>\u6210\u5458\u6570\u91cf</span>
                          <span className="font-mono">{memberCount} / {maxCapacity}</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${Math.min((memberCount / maxCapacity) * 100, 100)}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                          <span>\u5165\u9a7b\u7387</span>
                          <span className="font-mono">{occupancyRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${Math.min(occupancyRate, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs border-t border-neutral-700 pt-3 mb-3">
                    {unit.location && (
                      <div className="flex items-center text-neutral-400">
                        <MapPin className="w-3.5 h-3.5 mr-2" />
                        {unit.location}
                      </div>
                    )}
                    <div className="flex items-center text-neutral-400">
                      <Calendar className="w-3.5 h-3.5 mr-2" />
                      \u521b\u5efa\u4e8e <FormattedDate dateTime={unit.created_at} />
                    </div>
                    <div className="flex items-center text-neutral-400">
                      <Users className="w-3.5 h-3.5 mr-2" />
                      \u5bb9\u91cf: <span className="font-mono">{unit.capacity || 1000}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-700">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                      onClick={() => { setSelectedUnit(unit); setIsKPIDialogOpen(true); }}
                    >
                      <TrendingUp className="w-3.5 h-3.5 mr-1" />
                      KPI\u8be6\u60c5
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                      onClick={() => { setSelectedUnit(unit); setIsDistributionDialogOpen(true); }}
                    >
                      <Settings className="w-3.5 h-3.5 mr-1" />
                      \u5206\u914d\u65b9\u6848
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isKPIDialogOpen} onOpenChange={setIsKPIDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-white tracking-wider">
              {selectedUnit?.unit_id.slice(0, 8)} KPI
            </DialogTitle>
            <DialogDescription className="text-neutral-400">
              {selectedUnit?.unit_name} - {getUnitTypeLabel(selectedUnit?.unit_type || 'station')}
            </DialogDescription>
          </DialogHeader>
          {selectedUnit && unitDetailsCache[selectedUnit.unit_id] && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-neutral-800 rounded">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-neutral-400 tracking-wider">member_count</span>
                  {unitDetailsCache[selectedUnit.unit_id].metrics.occupancy_rate >= 50 ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <XCircle className="w-5 h-5 text-neutral-500" />
                  )}
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold text-white font-mono">
                    {unitDetailsCache[selectedUnit.unit_id].metrics.member_count}
                  </span>
                  <span className="text-neutral-500 font-mono">/ {unitDetailsCache[selectedUnit.unit_id].metrics.max_capacity}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <span>\u5165\u9a7b\u7387</span>
                    <span className="font-mono">{unitDetailsCache[selectedUnit.unit_id].metrics.occupancy_rate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${Math.min(unitDetailsCache[selectedUnit.unit_id].metrics.occupancy_rate, 100)}%` }} />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-neutral-800 rounded">
                <div className="text-xs text-neutral-400 tracking-wider mb-2">vault_mcd</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white font-mono">
                    {(unitDetailsCache[selectedUnit.unit_id].metrics.vault_mcd ?? 0).toLocaleString()}
                  </span>
                  <span className="text-neutral-500">MCD</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-800 rounded">
                <div className="text-xs text-neutral-400 tracking-wider mb-2">status</div>
                {unitDetailsCache[selectedUnit.unit_id].metrics.occupancy_rate >= 50 ? (
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>\u6d3b\u8dc3\u72b6\u6001\uff0c\u6301\u7eed\u53d1\u5c55\u4e2d</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-neutral-500">
                    <XCircle className="w-5 h-5" />
                    <span>\u5f85\u53d1\u5c55\uff0c\u9080\u8bf7\u66f4\u591a\u6210\u5458\u52a0\u5165</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
              onClick={() => setIsKPIDialogOpen(false)}
            >
              \u5173\u95ed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDistributionDialogOpen} onOpenChange={setIsDistributionDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-white tracking-wider">
              distribution_plan
            </DialogTitle>
            <DialogDescription className="text-neutral-400">\u9009\u62e9\u5229\u6da6\u5206\u914d\u65b9\u5f0f</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-xs text-neutral-400 tracking-wider mb-2">distribution_plan</div>
            <div className="space-y-2">
              {distributionPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedDistributionPlan(plan.id)}
                  className={cn(
                    "p-4 rounded border cursor-pointer transition-colors",
                    selectedDistributionPlan === plan.id
                      ? "bg-neutral-800 border-cyan-400/50"
                      : "bg-neutral-900 border-neutral-700 hover:border-neutral-600"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-white mb-1">{plan.name}</div>
                      <div className="text-sm text-neutral-400">{plan.description}</div>
                    </div>
                    {selectedDistributionPlan === plan.id && (
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
              onClick={() => { setIsDistributionDialogOpen(false); setSelectedDistributionPlan(''); setSelectedUnit(null); }}
              disabled={submitting}
            >
              \u53d6\u6d88
            </Button>
            <Button
              size="sm"
              onClick={handleSetDistributionPlan}
              disabled={submitting || !selectedDistributionPlan}
              className="bg-cyan-700 hover:bg-cyan-600 text-white"
            >
              {submitting ? '\u8bbe\u7f6e\u4e2d...' : '\u786e\u8ba4\u8bbe\u7f6e'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNameEditDialogOpen} onOpenChange={(open) => {
        setIsNameEditDialogOpen(open);
        if (!open) {
          setSelectedUnit(null);
          setNameStatus(null);
          setNewName('');
        }
      }}>
        <DialogContent className="bg-neutral-900 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-white tracking-wider">
              rename_territory {selectedUnit?.unit_id?.toString().slice(0, 8)}
            </DialogTitle>
            <DialogDescription className="text-neutral-400">
              \u4fee\u6539\u9886\u5730\u540d\u79f0\uff08\u6bcf90\u5929\u53ef\u4fee\u6539\u4e00\u6b21\uff09
            </DialogDescription>
          </DialogHeader>

          {nameLoading ? (
            <div className="py-8 text-center text-neutral-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              \u52a0\u8f7d\u4e2d...
            </div>
          ) : nameStatus ? (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-neutral-800 rounded">
                <div className="text-xs text-neutral-400 tracking-wider mb-2">current_name</div>
                <div className="text-lg text-white font-medium">{nameStatus.current_name}</div>
              </div>

              {!nameStatus.can_modify && (
                <div className="p-3 bg-neutral-800 rounded border border-neutral-700">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-cyan-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">\u4fee\u6539\u51b7\u5374\u4e2d</div>
                      <div className="text-sm text-neutral-400 mt-1">
                        \u8fd8\u9700\u7b49\u5f85 <span className="font-bold font-mono">{nameStatus.remaining_days}</span> \u5929
                        {nameStatus.next_modify_date && (
                          <span className="ml-1">\uff08{nameStatus.next_modify_date} \u53ef\u4fee\u6539\uff09</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {nameStatus.is_team_managed && (
                <div className="p-3 bg-neutral-800 rounded border border-neutral-700">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-cyan-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">\u56e2\u961f\u4ee3\u7ba1\u9886\u5730</div>
                      <div className="text-sm text-neutral-400 mt-1">
                        \u9886\u5730\u5f53\u524d\u7531\u56e2\u961f\u4ee3\u7ba1\uff0c\u4efb\u4f55\u5df2\u767b\u5f55\u7528\u6237\u90fd\u53ef\u4ee5\u4fee\u6539\u540d\u79f0
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-xs text-neutral-400 tracking-wider">new_name *</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="\u8f93\u5165\u65b0\u7684\u9886\u5730\u540d\u79f0"
                  className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 mt-1"
                  maxLength={50}
                  disabled={!nameStatus.can_modify}
                />
                <div className="text-xs text-neutral-500 mt-1 font-mono">
                  {newName.length}/50 \u5b57\u7b26\uff08\u81f3\u5c112\u4e2a\u5b57\u7b26\uff09
                </div>
              </div>

              {nameStatus.last_modified_at && (
                <div className="text-xs text-neutral-500 border-t border-neutral-700 pt-3">
                  <div>\u4e0a\u6b21\u4fee\u6539: {nameStatus.last_modified_at}</div>
                  {nameStatus.last_modified_by && (
                    <div>\u4fee\u6539\u4eba: <span className="font-mono">{nameStatus.last_modified_by.slice(0, 8)}...</span></div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-neutral-500">
              \u52a0\u8f7d\u540d\u79f0\u72b6\u6001\u5931\u8d25
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
              onClick={() => {
                setIsNameEditDialogOpen(false);
                setSelectedUnit(null);
                setNameStatus(null);
                setNewName('');
              }}
              disabled={submitting}
            >
              \u53d6\u6d88
            </Button>
            <Button
              size="sm"
              onClick={handleNameUpdate}
              disabled={
                submitting ||
                !newName.trim() ||
                newName.trim().length < 2 ||
                newName === nameStatus?.current_name ||
                !nameStatus?.can_modify
              }
              className="bg-cyan-700 hover:bg-cyan-600 text-white"
            >
              {submitting ? '\u66f4\u65b0\u4e2d...' : '\u786e\u8ba4\u4fee\u6539'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
