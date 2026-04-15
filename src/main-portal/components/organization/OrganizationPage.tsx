'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Users, Building2, Grid3x3, Map as MapIcon, Globe, Network, Search, Crown, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Link } from '../../i18n/navigation';
import { DiagramNode } from './diagram-node';
import { ConnectionLine } from './connection-line';
import { SystemPanel } from './system-panel';
import { getUnits, getUnitsSummary, type UnitsSummary } from '../../lib/api/services';
import type { Unit } from '../../lib/types/api';
import { useTranslations } from 'next-intl';

interface OrgStats { total_users: number; active_miners: number; zombie_users: number; commanders: number; pioneers: number; wardens: number; admirals: number; total_funds: number; units_by_type: { station: number; matrix: number; sector: number; system: number } }
interface OrgNode { unit_id: string; unit_name: string; unit_type: 'station' | 'matrix' | 'sector' | 'system'; manager_id?: string; manager_name?: string; is_team_managed: boolean; member_count: number; capacity: number; total_funds: number; kpi_qualified: boolean; tech_bonus_lit: boolean; children: OrgNode[] }
interface DiagNode { id: string; label: string; sublabel?: string; type: "system" | "sector" | "matrix" | "station" | "empty" | "team"; x: number; y: number; system: string }
interface DiagConn { from: string; to: string; label?: string; type: "hdmi" | "sdi" | "usb" | "wireless" | "ethernet" | "stream" | "audio"; lineStyle?: "solid" | "dotted" | "thick" }
interface DiagSubgraph { id: string; title: string; x: number; y: number; width: number; height: number }

function buildTree(units: Unit[]): { tree: OrgNode[]; orphans: OrgNode[] } {
  const nodeMap = new Map<string, OrgNode>(); const roots: OrgNode[] = []; const orphans: OrgNode[] = [];
  units.forEach(unit => { const uid = String(unit.unit_id); nodeMap.set(uid, { unit_id: uid, unit_name: unit.unit_name, unit_type: unit.unit_type as OrgNode['unit_type'], manager_id: unit.manager_wallet, manager_name: unit.manager_wallet ? `${unit.manager_wallet.slice(0, 6)}...` : undefined, is_team_managed: !unit.manager_wallet, member_count: unit.current_members || 0, capacity: unit.max_capacity || unit.capacity || 1000, total_funds: unit.vault_balance || 0, kpi_qualified: false, tech_bonus_lit: false, children: [] }) });
  units.forEach(unit => { const uid = String(unit.unit_id); const node = nodeMap.get(uid); if (!node) return; const pid = unit.parent_id || unit.parent_unit_id; if (pid) { const parent = nodeMap.get(String(pid)); if (parent) parent.children.push(node); else if (unit.unit_type === 'station') orphans.push(node) } else roots.push(node) });
  const order = { system: 0, sector: 1, matrix: 2, station: 3 }; const sortN = (ns: OrgNode[]) => { ns.sort((a, b) => order[a.unit_type] - order[b.unit_type]); ns.forEach(n => sortN(n.children)) }; sortN(roots);
  return { tree: roots, orphans };
}

function calcStats(units: Unit[], summary: UnitsSummary | null): OrgStats {
  const ut = { station: 0, matrix: 0, sector: 0, system: 0 }; let tf = 0;
  units.forEach(u => { if (u.unit_type in ut) ut[u.unit_type as keyof typeof ut]++; tf += u.vault_balance || 0 });
  const us = summary?.user_stats;
  return { total_users: us?.total_users ?? summary?.total_members ?? 0, active_miners: us?.miners ?? 0, zombie_users: us?.unassigned_users ?? 0, commanders: us?.commanders ?? 0, pioneers: us?.pioneers ?? 0, wardens: us?.wardens ?? 0, admirals: us?.admirals ?? 0, total_funds: summary?.total_vault_mcd ?? summary?.total_vault_balance ?? tf, units_by_type: summary?.stations_by_type ? { station: summary.stations_by_type.station || ut.station, matrix: summary.stations_by_type.matrix || ut.matrix, sector: summary.stations_by_type.sector || ut.sector, system: summary.stations_by_type.system || ut.system } : ut };
}

const emptyStats: OrgStats = { total_users: 0, active_miners: 0, zombie_users: 0, commanders: 0, pioneers: 0, wardens: 0, admirals: 0, total_funds: 0, units_by_type: { station: 0, matrix: 0, sector: 0, system: 0 } };
const fmtMCD = (v: number) => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : v.toLocaleString();

function djb(s: string): number { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return ((h & 0x7fffffff) % 1000) / 1000 }

function FlipCard({ front, back }: { front: React.ReactNode; back: React.ReactNode }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div style={{ perspective: '1500px' }}>
      <motion.div className="relative w-full cursor-pointer" onClick={() => setFlipped(!flipped)} animate={{ rotateY: flipped ? 180 : 0, scale: flipped ? [1, 1.03, 1] : 1 }} transition={{ rotateY: { duration: 0.7, ease: [0.4, 0, 0.2, 1] }, scale: { duration: 0.7, ease: [0.4, 0, 0.2, 1], times: [0, 0.5, 1] } }} style={{ transformStyle: 'preserve-3d' }}>
        <motion.div className="group relative overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 dash-card" style={{ backfaceVisibility: 'hidden', display: flipped ? 'none' : undefined }} animate={{ opacity: flipped ? 0 : 1, filter: flipped ? 'blur(4px)' : 'blur(0px)' }} transition={{ duration: 0.35, ease: 'easeInOut' }}>
          <div className="relative z-10 p-6">{front}</div>
        </motion.div>
        <motion.div className="overflow-hidden rounded-lg border border-cyan-400/30 bg-neutral-900 dash-card" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', display: flipped ? undefined : 'none' }} animate={{ opacity: flipped ? 1 : 0, filter: flipped ? 'blur(0px)' : 'blur(4px)' }} transition={{ duration: 0.35, ease: 'easeInOut' }}>
          <div className="relative z-10 p-6">{back}</div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function enrichTree(nodes: OrgNode[]): OrgNode[] {
  return nodes.map(node => {
    const e = { ...node, children: [...node.children] };
    const mk = (type: OrgNode['unit_type'], pid: string, idx: number, name: string, cap: number): OrgNode => ({ unit_id: `sim-${type.slice(0, 3)}-${pid}-${idx}`, unit_name: name, unit_type: type, is_team_managed: true, member_count: 0, capacity: cap, total_funds: 0, kpi_qualified: false, tech_bonus_lit: false, children: [] });
    if (node.unit_type === 'system' && e.children.length < 3) { const nm = ['Alpha', 'Beta', 'Gamma']; while (e.children.length < 3) { const i = e.children.length; e.children.push(mk('sector', node.unit_id, i, `Sector ${nm[i]}`, 100000)) } }
    else if (node.unit_type === 'sector') { const t = 2 + Math.floor(djb(node.unit_id + 'c') * 2); while (e.children.length < t) { const i = e.children.length; e.children.push(mk('matrix', node.unit_id, i, `Matrix ${String.fromCharCode(65 + i)}`, 10000)) } }
    else if (node.unit_type === 'matrix' && e.children.length === 0 && djb(node.unit_id) > 0.35) { const c = 1 + Math.floor(djb(node.unit_id + 's') * 2); for (let i = 0; i < c; i++) e.children.push(mk('station', node.unit_id, i, `Station ${String.fromCharCode(65 + i)}`, 1000)) }
    e.children = enrichTree(e.children); return e;
  });
}

function treeToDiagram(roots: OrgNode[], orphans: OrgNode[], pal: string): { nodes: DiagNode[]; connections: DiagConn[]; subgraphs: DiagSubgraph[] } {
  const eRoots = enrichTree(roots); const nodes: DiagNode[] = []; const connections: DiagConn[] = [];
  const NW = 130, NH = 80, HG = 22, VG = [120, 110, 100];
  const tMap: Record<string, DiagNode['type']> = { system: 'system', sector: 'sector', matrix: 'matrix', station: 'station' };
  const cMap: Record<string, DiagConn['type']> = { system: 'stream', sector: 'sdi', matrix: 'usb', station: 'hdmi' };
  function measure(n: OrgNode): number { return n.children.length === 0 ? NW : n.children.reduce((s, c) => s + measure(c) + HG, -HG) }
  function layout(n: OrgNode, x: number, y: number, gid: string, lvl: number) {
    const jx = (djb(n.unit_id + 'x') - 0.5) * 18, jy = (djb(n.unit_id + 'y') - 0.5) * 14, isSim = n.unit_id.startsWith('sim-');
    const sub = isSim ? pal : n.is_team_managed ? `${n.member_count}/${n.capacity}` : `${n.manager_name || ''} · ${n.member_count}`;
    nodes.push({ id: n.unit_id, label: n.unit_name, sublabel: sub, type: isSim ? 'empty' : (tMap[n.unit_type] || 'station'), x: x + jx, y: y + jy, system: gid });
    if (n.children.length === 0) return;
    const tw = n.children.reduce((s, c) => s + measure(c) + HG, -HG); let cx = x + NW / 2 - tw / 2; const vg = VG[Math.min(lvl, VG.length - 1)];
    n.children.forEach(child => { const cw = measure(child); layout(child, cx + cw / 2 - NW / 2, y + vg, gid, lvl + 1); connections.push({ from: n.unit_id, to: child.unit_id, type: cMap[n.unit_type] || 'hdmi', lineStyle: child.unit_id.startsWith('sim-') ? 'dotted' : undefined }); cx += cw + HG });
  }
  let sx = 40; eRoots.forEach((r, i) => { const w = measure(r); layout(r, sx + w / 2 - NW / 2, 40, `group-${i}`, 0); sx += w + 80 });
  if (orphans.length > 0) { const COLS = Math.min(orphans.length, 5); orphans.forEach((o, idx) => { const col = idx % COLS, row = Math.floor(idx / COLS); nodes.push({ id: o.unit_id, label: o.unit_name, sublabel: `${o.member_count}/${o.capacity}`, type: o.is_team_managed ? 'team' : 'station', x: sx + 60 + col * (NW + HG) + (djb(o.unit_id + 'x') - 0.5) * 12, y: 40 + row * 100 + (djb(o.unit_id + 'y') - 0.5) * 10, system: 'orphans' }) }) }
  const gMap = new Map<string, DiagNode[]>(); nodes.forEach(n => { if (!gMap.has(n.system)) gMap.set(n.system, []); gMap.get(n.system)!.push(n) });
  const subgraphs: DiagSubgraph[] = []; const PAD = 30;
  gMap.forEach((gN, gId) => { if (gN.length === 0) return; const minX = Math.min(...gN.map(n => n.x)), maxX = Math.max(...gN.map(n => n.x)), minY = Math.min(...gN.map(n => n.y)), maxY = Math.max(...gN.map(n => n.y)); const root = eRoots.find((_, i) => `group-${i}` === gId); subgraphs.push({ id: gId, title: root ? root.unit_name : gId === 'orphans' ? 'Orphan Stations' : gId, x: minX - PAD, y: minY - PAD - 20, width: maxX - minX + NW + PAD * 2, height: maxY - minY + NH + PAD * 2 + 20 }) });
  return { nodes, connections, subgraphs };
}

function filterTree(nodes: OrgNode[], search: string, mgmt: string): OrgNode[] {
  return nodes.reduce<OrgNode[]>((acc, node) => {
    const fc = filterTree(node.children, search, mgmt);
    const nm = !search || node.unit_name.toLowerCase().includes(search.toLowerCase()) || node.unit_id.toLowerCase().includes(search.toLowerCase());
    const mm = mgmt === 'all' || (mgmt === 'team' && node.is_team_managed) || (mgmt === 'user' && !node.is_team_managed);
    if ((nm && mm) || fc.length > 0) acc.push({ ...node, children: fc });
    return acc;
  }, []);
}

export default function OrganizationPage() {
  const t = useTranslations('userSystem');
  const [stats, setStats] = useState<OrgStats>(emptyStats);
  const [orgTree, setOrgTree] = useState<OrgNode[]>([]);
  const [orphans, setOrphans] = useState<OrgNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMgmt, setFilterMgmt] = useState('all');

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true); else setLoading(true); setError(null);
      let units: Unit[] = [], summary: UnitsSummary | null = null;
      try { const r = await getUnits(); if (r.success && r.data && Array.isArray(r.data)) units = r.data } catch {}
      try { const r = await getUnitsSummary(); if (r.success) summary = (r.data || r) as UnitsSummary } catch {}
      if (units.length > 0) { const { tree, orphans: o } = buildTree(units); setOrgTree(tree); setOrphans(o) } else { setOrgTree([]); setOrphans([]) }
      setStats(calcStats(units, summary));
    } catch (err) { setError(err instanceof Error ? err.message : t('loadFailed')) }
    finally { setLoading(false); setIsRefreshing(false) }
  }, [t]);

  useEffect(() => { loadData() }, [loadData]);

  const filteredTree = useMemo(() => filterTree(orgTree, searchTerm, filterMgmt), [orgTree, searchTerm, filterMgmt]);
  const filteredOrphans = useMemo(() => filterTree(orphans, searchTerm, filterMgmt), [orphans, searchTerm, filterMgmt]);
  const pal = t('pendingAuction');
  const diagData = useMemo(() => treeToDiagram(filteredTree, filteredOrphans, pal), [filteredTree, filteredOrphans, pal]);

  const [selNode, setSelNode] = useState<string | null>(null);
  const [hovNode, setHovNode] = useState<string | null>(null);
  const [dZoom, setDZoom] = useState(1);
  const [dPan, setDPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [dNodes, setDNodes] = useState(diagData.nodes);
  const [dSubs, setDSubs] = useState(diagData.subgraphs);

  const fitToView = useCallback((nodes: DiagNode[]) => {
    if (nodes.length === 0 || !containerRef.current) return;
    const el = containerRef.current, cw = el.clientWidth, ch = el.clientHeight, P = 60;
    const minX = Math.min(...nodes.map(n => n.x)), maxX = Math.max(...nodes.map(n => n.x)) + 130, minY = Math.min(...nodes.map(n => n.y)), maxY = Math.max(...nodes.map(n => n.y)) + 80;
    const cW = maxX - minX + P * 2, cH = maxY - minY + P * 2, zoom = Math.min(cw / cW, ch / cH, 1.5);
    setDZoom(Math.round(zoom * 100) / 100); setDPan({ x: (cw - cW * zoom) / 2 - (minX - P) * zoom, y: (ch - cH * zoom) / 2 - (minY - P) * zoom });
  }, []);

  useEffect(() => { setDNodes(diagData.nodes); setDSubs(diagData.subgraphs); requestAnimationFrame(() => fitToView(diagData.nodes)) }, [diagData, fitToView]);
  useEffect(() => { const el = containerRef.current; if (!el) return; const ro = new ResizeObserver(() => fitToView(dNodes)); ro.observe(el); return () => ro.disconnect() }, [dNodes, fitToView]);

  const getConnected = useCallback((id: string) => { const s = new Set<string>(); diagData.connections.forEach(c => { if (c.from === id) s.add(c.to); if (c.to === id) s.add(c.from) }); return s }, [diagData.connections]);
  const connNodes = hovNode ? getConnected(hovNode) : new Set<string>();
  const handleNodeDrag = useCallback((id: string, nx: number, ny: number) => { setDNodes(prev => prev.map(n => n.id === id ? { ...n, x: nx, y: ny } : n)) }, []);
  const handleGroupDrag = useCallback((gid: string, dx: number, dy: number) => { setDNodes(prev => prev.map(n => n.system === gid ? { ...n, x: n.x + dx, y: n.y + dy } : n)); setDSubs(prev => prev.map(sg => sg.id === gid ? { ...sg, x: sg.x + dx, y: sg.y + dy } : sg)) }, []);

  const diagBounds = useMemo(() => {
    if (dNodes.length === 0) return { minX: 0, minY: 0, maxX: 1000, maxY: 500, width: 1000, height: 500 };
    const P = 100, minX = Math.min(...dNodes.map(n => n.x)) - P, maxX = Math.max(...dNodes.map(n => n.x)) + 140 + P, minY = Math.min(...dNodes.map(n => n.y)) - P, maxY = Math.max(...dNodes.map(n => n.y)) + 80 + P;
    return { minX: Math.min(0, minX), minY: Math.min(0, minY), maxX, maxY, width: Math.max(1000, maxX - Math.min(0, minX)), height: Math.max(500, maxY - Math.min(0, minY)) };
  }, [dNodes]);

  const dynSubs = useMemo(() => dSubs.map(sg => {
    const sn = dNodes.filter(n => n.system === sg.id); if (sn.length === 0) return sg; const P = 30;
    const minX = Math.min(...sn.map(n => n.x)), maxX = Math.max(...sn.map(n => n.x)), minY = Math.min(...sn.map(n => n.y)), maxY = Math.max(...sn.map(n => n.y));
    return { ...sg, x: minX - P, y: minY - P - 20, width: maxX - minX + 140 + P * 2, height: maxY - minY + 80 + P * 2 + 20 };
  }), [dSubs, dNodes]);

  if (loading) return <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6"><div><h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1><p className="text-xs sm:text-sm text-neutral-400 mt-1">{t('subtitle')}</p></div><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-neutral-400 animate-spin" /><span className="ml-3 text-neutral-400 text-sm">{t('loading')}</span></div></div>;

  const unitIcons = { station: Building2, matrix: Grid3x3, sector: MapIcon, system: Globe };

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1><p className="text-xs sm:text-sm text-neutral-400 mt-1">{t('subtitle')}</p></div>
        <Button variant="outline" size="sm" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent" onClick={() => loadData(true)} disabled={isRefreshing}><RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />{t('refresh')}</Button>
      </div>

      {error && <Card className="bg-red-500/10 border-red-500/20"><CardContent className="p-4"><div className="flex items-center gap-2 text-red-400"><AlertTriangle className="w-4 h-4" /><span className="text-sm">{error}</span></div></CardContent></Card>}

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="mb-4 flex items-center gap-3"><Users className="w-5 h-5 text-cyan-400" /><div><div className="text-sm font-bold text-cyan-400 tracking-wide">{t('userStats')}</div><div className="text-[10px] text-neutral-500 font-mono tracking-wider">User Statistics</div></div></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[{ label: t('totalUsers'), value: stats.total_users }, { label: 'Miner', value: stats.active_miners }, { label: t('unassigned'), value: stats.zombie_users }].map(({ label, value }) => (
              <div key={label} className="p-3 bg-neutral-800 rounded border border-neutral-700"><div className="text-xs text-cyan-400/70 tracking-wider mb-1">{label}</div><div className="text-lg font-bold text-white font-mono">{value.toLocaleString()}</div></div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FlipCard front={<><div className="mb-4 flex items-center gap-3"><Network className="w-5 h-5 text-cyan-400" /><div><div className="text-sm font-bold text-cyan-400 tracking-wide">{t('territoryDistribution')}</div><div className="text-[10px] text-neutral-500 font-mono tracking-wider">Territory Distribution</div></div></div><div className="grid grid-cols-4 gap-3">{(['station', 'matrix', 'sector', 'system'] as const).map(k => { const Icon = unitIcons[k]; return <div key={k} className="text-center p-3 bg-neutral-800 rounded border border-neutral-700"><Icon className="w-5 h-5 text-cyan-400/70 mx-auto mb-2" /><div className="text-lg font-bold text-white font-mono">{stats.units_by_type[k]}</div><div className="text-xs text-cyan-400/70 tracking-wider">{k.charAt(0).toUpperCase() + k.slice(1)}</div></div> })}</div><div className="mt-3 text-xs text-neutral-500">{t('fourTierArchitecture')}</div></>} back={<div className="space-y-3"><div className="flex items-center gap-3"><Network className="w-5 h-5 text-cyan-400" /><div><div className="text-sm font-bold text-cyan-400 tracking-wide">{t('territorySystem')}</div><div className="text-[10px] text-neutral-500 font-mono tracking-wider">Territory System</div></div></div><p className="text-sm text-neutral-300 leading-relaxed">{t('territorySystemDesc')}</p><div className="text-sm text-neutral-400 leading-relaxed space-y-1.5">{['Station', 'Matrix', 'Sector', 'System'].map(k => <p key={k}><span className="text-cyan-400/80 font-mono">{k}</span> — {t(`${k.toLowerCase()}Desc`)}</p>)}</div><p className="text-sm text-neutral-400 leading-relaxed">{t('magistrateDesc')}</p><Link href="/docs" className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono mt-1 transition-colors">{t('learnMore')}</Link></div>} />
        <FlipCard front={<><div className="mb-4 flex items-center gap-3"><Building2 className="w-5 h-5 text-cyan-400" /><div><div className="text-sm font-bold text-cyan-400 tracking-wide">{t('vaultBalance')}</div><div className="text-[10px] text-neutral-500 font-mono tracking-wider">Vault Balance</div></div></div><div className="p-4 bg-neutral-800 rounded border border-neutral-700"><div className="text-3xl font-bold text-cyan-300 font-mono">{fmtMCD(stats.total_funds)}</div><div className="text-sm text-cyan-400/50 mt-1">MCD</div></div><div className="mt-3 text-xs text-neutral-500">{t('dailyDistribution')}</div></>} back={<div className="space-y-3"><div className="flex items-center gap-3"><Building2 className="w-5 h-5 text-cyan-400" /><div><div className="text-sm font-bold text-cyan-400 tracking-wide">{t('vaultMechanism')}</div><div className="text-[10px] text-neutral-500 font-mono tracking-wider">Vault Mechanism</div></div></div><p className="text-sm text-neutral-300 leading-relaxed">{t('vaultMechanismDesc')}</p><div className="text-sm text-neutral-400 leading-relaxed space-y-1.5">{['source', 'distribution', 'peg', 'transparency'].map(k => <p key={k}><span className="text-cyan-400/80">{t(`${k}Label`)}</span> — {t(`${k}Desc`)}</p>)}</div><p className="text-sm text-neutral-400 leading-relaxed">{t('vaultIncentive')}</p><Link href="/docs" className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono mt-1 transition-colors">{t('learnMore')}</Link></div>} />
      </div>

      <Card className="bg-neutral-900 border-neutral-700 dash-card"><CardContent className="p-3 sm:p-6">
        <div className="mb-4 flex items-center gap-3"><Crown className="w-5 h-5 text-cyan-400" /><div><div className="text-sm font-bold text-cyan-400 tracking-wide">{t('levelProgression')}</div><div className="text-[10px] text-neutral-500 font-mono tracking-wider">Level Progression</div></div></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {['Miner', 'Commander', 'Pioneer', 'Warden', 'Admiral'].map((level, i) => (
            <div key={level} className="flex items-center gap-3 p-3 bg-neutral-800 rounded border border-neutral-700">
              <div className="text-2xl font-bold text-cyan-400 font-mono leading-none">{i + 1}</div>
              <div><div className="text-sm font-medium text-neutral-200">{level}</div><div className="text-xs text-neutral-400">{t(level.toLowerCase())}</div><div className="text-xs text-neutral-500">{t(`${level.toLowerCase()}Condition`)}</div></div>
            </div>
          ))}
        </div>
      </CardContent></Card>

      <Card className="bg-neutral-900 border-neutral-700 dash-card"><CardContent className="p-3 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3"><Network className="w-5 h-5 text-cyan-400" /><div><div className="text-sm font-bold text-cyan-400 tracking-wide">{t('territoryStructure')}</div><div className="text-[10px] text-neutral-500 font-mono tracking-wider">Territory Structure</div></div></div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-neutral-500">
              {[{ l: 'System', c: 'bg-purple-400' }, { l: 'Sector', c: 'bg-blue-400' }, { l: 'Matrix', c: 'bg-cyan-400' }, { l: 'Station', c: 'bg-emerald-400' }].map(({ l, c }) => <span key={l} className="flex items-center gap-1"><span className={cn('w-1.5 h-1.5 rounded-full', c)} />{l}</span>)}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" /><Input placeholder={t('searchTerritory')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 w-40 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 text-sm h-8" /></div>
              <Select value={filterMgmt} onValueChange={setFilterMgmt}><SelectTrigger className="w-28 bg-neutral-800 border-neutral-600 text-white text-sm h-8"><SelectValue placeholder={t('managementStatus')} /></SelectTrigger><SelectContent className="bg-neutral-900 border-neutral-700"><SelectItem value="all">{t('filterAll')}</SelectItem><SelectItem value="user">{t('filterUserManaged')}</SelectItem><SelectItem value="team">{t('filterTeamManaged')}</SelectItem></SelectContent></Select>
            </div>
          </div>
        </div>

        {dNodes.length > 0 ? (
          <div ref={containerRef} className="relative h-[500px] rounded-lg border border-neutral-800 overflow-hidden touch-none"
            onMouseDown={e => { if (e.button === 1 || (e.button === 0 && e.altKey)) { e.preventDefault(); setIsPanning(true); setPanStart({ x: e.clientX - dPan.x, y: e.clientY - dPan.y }) } }}
            onMouseMove={e => { if (isPanning) setDPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y }) }}
            onMouseUp={() => setIsPanning(false)} onMouseLeave={() => setIsPanning(false)}
            onWheel={e => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); setDZoom(prev => Math.max(0.25, Math.min(3, prev + (e.deltaY > 0 ? -0.1 : 0.1)))) } }}>
            <div className="absolute inset-0 opacity-10"><svg className="w-full h-full"><defs><pattern id="territory-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" /></pattern></defs><rect width="100%" height="100%" fill="url(#territory-grid)" /></svg></div>
            <div className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-1 rounded-lg border border-neutral-700 bg-neutral-900/80 backdrop-blur-sm">
              <button className="p-1 hover:bg-neutral-800 rounded text-neutral-400" onClick={() => setDZoom(prev => Math.max(prev - 0.25, 0.25))}><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg></button>
              <span className="text-[10px] text-neutral-500 font-mono min-w-[36px] text-center">{Math.round(dZoom * 100)}%</span>
              <button className="p-1 hover:bg-neutral-800 rounded text-neutral-400" onClick={() => setDZoom(prev => Math.min(prev + 0.25, 3))}><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" /></svg></button>
              <button className="p-1 hover:bg-neutral-800 rounded text-neutral-400" onClick={() => fitToView(dNodes)}><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg></button>
            </div>
            <div className={`relative ${isPanning ? 'cursor-grabbing' : 'cursor-default'}`} style={{ minWidth: `${diagBounds.width}px`, minHeight: `${diagBounds.height}px`, transform: `translate(${dPan.x}px, ${dPan.y}px) scale(${dZoom})`, transformOrigin: '0 0' }}>
              {dynSubs.map(sg => <SystemPanel key={sg.id} id={sg.id} title={sg.title} x={sg.x} y={sg.y} width={sg.width} height={sg.height} onDrag={handleGroupDrag} />)}
              <svg className="absolute pointer-events-none" style={{ left: 0, top: 0, width: `${diagBounds.width}px`, height: `${diagBounds.height}px`, overflow: 'visible' }}>
                <defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
                {diagData.connections.map((conn, i) => { const fn = dNodes.find(n => n.id === conn.from), tn = dNodes.find(n => n.id === conn.to); if (!fn || !tn) return null; const hl = hovNode === conn.from || hovNode === conn.to || (selNode && (selNode === conn.from || selNode === conn.to)); return <ConnectionLine key={`${conn.from}-${conn.to}-${i}`} fromX={fn.x + 60} fromY={fn.y + 50} toX={tn.x + 60} toY={tn.y + 50} label={conn.label} type={conn.type} lineStyle={conn.lineStyle} isHighlighted={!!hl} /> })}
              </svg>
              {dNodes.map(node => <DiagramNode key={node.id} {...node} isSelected={selNode === node.id} isConnected={connNodes.has(node.id)} isHovered={hovNode === node.id} onSelect={() => setSelNode(selNode === node.id ? null : node.id)} onHover={h => setHovNode(h ? node.id : null)} onDrag={handleNodeDrag} />)}
            </div>
            <div className="absolute bottom-2 left-2 z-20 text-[10px] text-neutral-600 font-mono">{t('diagramControls', { nodes: dNodes.length, connections: diagData.connections.length })}</div>
          </div>
        ) : <div className="flex items-center justify-center py-16 text-neutral-500 text-sm">{searchTerm || filterMgmt !== 'all' ? t('noMatchResults') : t('noStructure')}</div>}
      </CardContent></Card>
    </div>
  );
}
