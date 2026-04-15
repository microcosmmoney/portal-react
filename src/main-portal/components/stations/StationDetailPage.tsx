// AI-generated · AI-managed · AI-maintained
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormattedDate } from '../ui/time-remaining';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import {
  getUnitDetails,
  updateUnit,
  deleteUnit,
  getUnitMembers,
  getUnitDetailedStats,
} from '../../lib/api-service';
import {
  getUnitTerritoryNft,
  prepareMintTerritoryNft,
} from '../../lib/api/services';
import type { Unit, UnitType, Member, TerritoryNftMetadata, TerritoryNftType } from '../../lib/types/api';
import StationIncomeChart from './StationIncomeChart';
import StationMemberRanking from './StationMemberRanking';
import StationKPIHistory from './StationKPIHistory';
import { MiningDistributionHistory } from '../mining/MiningDistributionHistory';
import {
  Building2,
  Grid3x3,
  Map,
  Globe,
  Users,
  DollarSign,
  Zap,
  Vault,
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Settings,
  Image,
} from 'lucide-react';

const getUnitTypeIcon = (type: UnitType) => {
  switch (type) {
    case 'station': return <Building2 className="w-6 h-6" />;
    case 'matrix': return <Grid3x3 className="w-6 h-6" />;
    case 'sector': return <Map className="w-6 h-6" />;
    case 'system': return <Globe className="w-6 h-6" />;
    default: return <Building2 className="w-6 h-6" />;
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

interface StationDetailPageProps {
  stationId: string;
}

export default function StationDetailPage({ stationId }: StationDetailPageProps) {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<{
    member_count: number;
    max_capacity: number;
    vault_balance: number;
    vault_mcd: number;
    occupancy_rate: number;
  } | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  const [territoryNft, setTerritoryNft] = useState<TerritoryNftMetadata | null>(null);
  const [nftLoading, setNftLoading] = useState(false);
  const [isMintDialogOpen, setIsMintDialogOpen] = useState(false);
  const [minting, setMinting] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    unit_name: '',
    unit_type: 'station' as UnitType,
    location: '',
    capacity: 1000,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStationDetails();
  }, [stationId]);

  const loadStationDetails = async () => {
    try {
      setLoading(true);
      const [detailedRes, membersRes, nftRes] = await Promise.all([
        getUnitDetailedStats(stationId),
        getUnitMembers(stationId),
        getUnitTerritoryNft(stationId),
      ]);

      if (nftRes.success && nftRes.data) {
        setTerritoryNft(nftRes.data);
      } else {
        setTerritoryNft(null);
      }

      const detailedData = detailedRes.data;
      if (detailedRes.success && detailedData?.basic_info) {
        setUnit({
          unit_id: detailedData.unit_id,
          unit_name: detailedData.basic_info.unit_name,
          unit_type: detailedData.basic_info.unit_type as UnitType,
          location: detailedData.basic_info.parent_id || '',
          capacity: detailedData.metrics.max_capacity,
          created_at: detailedData.basic_info.created_at || new Date().toISOString(),
          current_members: detailedData.metrics.member_count,
          vault_balance: detailedData.metrics.vault_balance,
          short_id: detailedData.basic_info.short_id,
          full_path: detailedData.basic_info.full_path,
        } as Unit);
        setFormData({
          unit_name: detailedData.basic_info.unit_name,
          unit_type: detailedData.basic_info.unit_type as UnitType,
          location: detailedData.basic_info.parent_id || '',
          capacity: detailedData.metrics.max_capacity,
        });
        setMetrics(detailedData.metrics);
        if (detailedData.member_ranking) {
          setMembers(detailedData.member_ranking.map((m) => ({
            member_id: m.user_id,
            unit_id: stationId,
            user_id: m.user_id,
            name: m.nickname,
            role: 'member',
            email: m.email,
            joined_at: '',
          })));
        }
      } else {
        toast.error('\u52a0\u8f7d\u9886\u5730\u8be6\u60c5\u5931\u8d25');
        router.push('/user-system/territory');
        return;
      }

      if (membersRes.success && membersRes.data) {
        setMembers(membersRes.data);
      }
    } catch (error) {
      console.error('\u52a0\u8f7d\u9886\u5730 ' + stationId + ' \u6570\u636e\u5931\u8d25:', error);
      toast.error(error instanceof Error ? error.message : '\u52a0\u8f7d\u8be6\u60c5\u5931\u8d25');
      router.push('/user-system/territory');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!formData.unit_name.trim()) { toast.error('\u8bf7\u8f93\u5165\u9886\u5730\u540d\u79f0'); return; }
    try {
      setSubmitting(true);
      const response = await updateUnit(stationId, { unit_name: formData.unit_name });
      if (response.success) {
        toast.success('\u66f4\u65b0\u6210\u529f');
        setIsEditDialogOpen(false);
        loadStationDetails();
      } else {
        toast.error(response.error || '\u66f4\u65b0\u5931\u8d25');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '\u66f4\u65b0\u5931\u8d25');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      const response = await deleteUnit(stationId);
      if (response.success) {
        toast.success('\u5220\u9664\u6210\u529f');
        router.push('/user-system/territory');
      } else {
        toast.error(response.error || '\u5220\u9664\u5931\u8d25');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '\u5220\u9664\u5931\u8d25');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMintNft = async () => {
    if (!unit) return;

    try {
      setMinting(true);

      const nftType = unit.unit_type as TerritoryNftType;
      const nftLabel = unit.unit_type.charAt(0).toUpperCase() + unit.unit_type.slice(1);
      const result = await prepareMintTerritoryNft({
        unit_id: stationId,
        nft_type: nftType,
        name: `${nftLabel} #${unit.short_id || stationId}`,
        symbol: 'MTRR',
        uri: '',
      });

      if (!result.success) {
        throw new Error(result.error || '\u51c6\u5907\u94f8\u9020\u4ea4\u6613\u5931\u8d25');
      }

      toast.info('\u8bf7\u5728\u94b1\u5305\u4e2d\u786e\u8ba4\u4ea4\u6613...');

      toast.success('NFT \u94f8\u9020\u6210\u529f！');
      setIsMintDialogOpen(false);
      loadStationDetails();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '\u94f8\u9020\u5931\u8d25');
    } finally {
      setMinting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-neutral-400 hover:text-cyan-600" onClick={() => router.push('/user-system/territory')}>
            <ArrowLeft className="w-4 h-4 mr-2" />\u8fd4\u56de
          </Button>
        </div>
        <Card className="bg-neutral-900 border-neutral-700 dash-card">
          <CardContent className="pt-6 text-center">
            <p className="text-neutral-400">\u52a0\u8f7d\u4e2d...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!unit) {
    return null;
  }

  const isQualified = metrics ? (metrics.occupancy_rate >= 90) : false;

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-neutral-400 hover:text-white hover:bg-transparent" onClick={() => router.push('/user-system/territory')}>
            <ArrowLeft className="w-4 h-4 mr-2" />\u8fd4\u56de\u5217\u8868
          </Button>
        </div>
        {isAdmin() && (
          <Button size="sm" className="bg-cyan-700 hover:bg-cyan-600 text-white" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="w-4 h-4 mr-1" />\u7f16\u8f91
          </Button>
        )}
      </div>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {territoryNft ? (
              <div className="w-32 h-32 bg-neutral-800 rounded-lg border border-neutral-700 flex-shrink-0 overflow-hidden">
                <img
                  src={territoryNft.image || '/placeholder-nft.png'}
                  alt={territoryNft.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="w-32 h-32 bg-neutral-800 rounded-lg border border-neutral-700 flex flex-col items-center justify-center flex-shrink-0 cursor-pointer hover:border-cyan-400/50 dash-card"
                onClick={() => setIsMintDialogOpen(true)}
              >
                <Image className="w-8 h-8 text-neutral-500 mb-2" />
                <span className="text-xs text-neutral-400">\u94f8\u9020 NFT</span>
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={getUnitTypeColor(unit.unit_type)}>
                      {getUnitTypeIcon(unit.unit_type)}
                    </div>
                    <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{unit.unit_name}</h1>
                    {unit.short_id && (
                      <span className="text-sm font-mono text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded">
                        {unit.short_id}
                      </span>
                    )}
                    <Badge className={isQualified ? "bg-white/20 text-white" : "bg-neutral-500/20 text-neutral-300"}>
                      {isQualified ? <><CheckCircle2 className="w-3 h-3 mr-1" />\u5df2\u8fbe\u6807</> : <><XCircle className="w-3 h-3 mr-1" />\u672a\u8fbe\u6807</>}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-neutral-400">{getUnitTypeLabel(unit.unit_type)}</p>
                    {unit.full_path && (
                      <span className="text-xs font-mono text-neutral-500">{unit.full_path}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {unit.location && (
                  <div className="flex items-center gap-2 text-neutral-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{unit.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-neutral-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">\u521b\u5efa\u4e8e <FormattedDate dateTime={unit.created_at} /></span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">\u5bb9\u91cf: <span className="font-mono">{unit.capacity || 1000}</span></span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-white" />
              <span className="text-xs text-neutral-400 tracking-wider">\u6210\u5458\u6570\u91cf</span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">{metrics?.member_count ?? 0}</p>
            <p className="text-xs text-neutral-500 mt-1">\u5bb9\u91cf: <span className="font-mono">{metrics?.max_capacity ?? 1000}</span></p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Vault className="w-8 h-8 text-white" />
              <span className="text-xs text-neutral-400 tracking-wider">\u91d1\u5e93\u4f59\u989d</span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">{(metrics?.vault_mcd ?? 0).toLocaleString()}</p>
            <p className="text-xs text-neutral-500 mt-1">MCD (\u79ef\u5206)</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-8 h-8 text-white" />
              <span className="text-xs text-neutral-400 tracking-wider">\u79d1\u6280\u52a0\u6210</span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">+{getTechBonusPercentage(unit.unit_type)}%</p>
            <p className="text-xs text-neutral-500 mt-1">\u94f8\u9020\u4ea7\u51fa\u52a0\u6210</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-8 h-8 text-white" />
              <span className="text-xs text-neutral-400 tracking-wider">\u5165\u9a7b\u7387</span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">
              {metrics ? `${metrics.occupancy_rate.toFixed(1)}%` : '0%'}
            </p>
            <p className="text-xs text-neutral-500 mt-1">\u6210\u5458/\u5bb9\u91cf</p>
          </CardContent>
        </Card>
      </div>

      {metrics && (
        <Card className="bg-neutral-900 border-neutral-700 dash-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">KPI \u8fdb\u5ea6</CardTitle>
            <CardDescription className="text-neutral-400">\u5347\u7ea7\u5230 {unit.unit_type === 'station' ? 'Matrix' : '\u66f4\u9ad8\u7b49\u7ea7'} \u7684\u8981\u6c42</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-neutral-400">\u6210\u5458\u6570\u91cf</span>
                  <span className="text-white font-mono">{metrics.member_count} / {metrics.max_capacity}</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${Math.min(metrics.occupancy_rate, 100)}%` }} />
                </div>
                <p className="text-xs text-neutral-500 mt-1 font-mono">{metrics.occupancy_rate.toFixed(1)}% \u5b8c\u6210</p>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-neutral-400">\u91d1\u5e93\u4f59\u989d</span>
                  <span className="text-white font-mono">{metrics.vault_mcd.toLocaleString()} MCD</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, metrics.vault_mcd / 100)}%` }} />
                </div>
                <p className="text-xs text-neutral-500 mt-1">\u5f53\u524d\u91d1\u5e93\u8d44\u91d1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
            <Settings className="w-5 h-5" />
            \u5206\u914d\u673a\u5236
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-neutral-800 rounded">
            <h4 className="font-semibold text-white mb-2">\u81ea\u52a8\u6309\u52b3\u5206\u914d</h4>
            <p className="text-sm text-neutral-400">
              \u91d1\u5e93 MCD \u6bcf\u65e5\u81ea\u52a8\u53d1\u653e\u4f59\u989d\u7684 1%，\u6309\u5f53\u65e5\u4ea7\u77ff\u91cf\u5360\u6bd4\u5206\u914d\u7ed9\u77ff\u5de5。
            </p>
            <div className="mt-3 text-xs text-neutral-500">
              \u5206\u914d\u6bd4\u4f8b：\u77ff\u5de5 100%（\u6309\u52b3\u5206\u914d）
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StationIncomeChart stationId={stationId} />
        <StationMemberRanking stationId={stationId} />
      </div>

      <StationKPIHistory />

      <MiningDistributionHistory
        territoryId={stationId}
        title="\u672c\u9886\u5730\u94f8\u9020\u4ea7\u51fa\u5386\u53f2"
        description="\u663e\u793a\u5f52\u5c5e\u672c Station \u7684\u7528\u6237\u94f8\u9020\u4ea7\u51fa\u8bb0\u5f55"
        showUserColumn={true}
        limit={15}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-white tracking-wider">\u7f16\u8f91\u9886\u5730</DialogTitle>
            <DialogDescription className="text-neutral-400">\u4fee\u6539\u9886\u5730\u4fe1\u606f</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-xs text-neutral-400 tracking-wider">\u9886\u5730\u540d\u79f0 *</Label>
              <Input value={formData.unit_name} onChange={(e) => setFormData({ ...formData, unit_name: e.target.value })} className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={submitting} className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">\u53d6\u6d88</Button>
            <Button onClick={handleEdit} disabled={submitting} className="bg-cyan-700 hover:bg-cyan-600 text-white">{submitting ? '\u66f4\u65b0\u4e2d...' : '\u66f4\u65b0'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMintDialogOpen} onOpenChange={setIsMintDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-white tracking-wider">\u94f8\u9020 Territory NFT</DialogTitle>
            <DialogDescription className="text-neutral-400">
              \u4e3a <span className="text-white font-semibold">{unit.unit_name}</span> \u94f8\u9020\u94fe\u4e0a NFT，\u53ef\u7528\u4e8e\u501f\u8d37\u62b5\u62bc\u6216\u8f6c\u8ba9。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-neutral-800 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-400">\u9886\u5730\u7c7b\u578b</span>
                <span className="text-white font-semibold">{getUnitTypeLabel(unit.unit_type)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-400">NFT \u7c7b\u578b</span>
                <span className="text-white font-semibold font-mono">{unit.unit_type.charAt(0).toUpperCase() + unit.unit_type.slice(1)} NFT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">\u62b5\u62bc\u4ef7\u503c</span>
                <span className="text-white font-semibold font-mono">
                  {unit.unit_type === 'station' && '1,000 MCC'}
                  {unit.unit_type === 'matrix' && '15,000 MCC'}
                  {unit.unit_type === 'sector' && '200,000 MCC'}
                  {unit.unit_type === 'system' && '2,500,000 MCC'}
                </span>
              </div>
            </div>
            <div className="p-3 bg-neutral-800 rounded border border-neutral-700">
              <p className="text-sm text-neutral-400">
                \u94f8\u9020 NFT \u540e，\u60a8\u53ef\u4ee5\u5c06\u5176\u7528\u4e8e MCC \u501f\u8d37\u534f\u8bae\u7684\u62b5\u62bc\u54c1，\u6216\u5728\u5e02\u573a\u4e0a\u8f6c\u8ba9。
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMintDialogOpen(false)} disabled={minting} className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">\u53d6\u6d88</Button>
            <Button onClick={handleMintNft} disabled={minting} className="bg-cyan-700 hover:bg-cyan-600 text-white">
              {minting ? '\u94f8\u9020\u4e2d...' : '\u786e\u8ba4\u94f8\u9020'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
