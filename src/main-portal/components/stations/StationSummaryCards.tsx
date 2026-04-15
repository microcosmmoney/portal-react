'use client';

import { Card, CardContent } from '../ui/card';
import { Building2, Users, Vault } from 'lucide-react';

interface StationSummary {
  total_stations: number;
  total_members: number;
  total_vault_balance: number;
  total_vault_mcd: number;
  avg_kpi_score?: number;
}

interface StationSummaryCardsProps {
  summary: StationSummary | null;
  loading?: boolean;
}

export default function StationSummaryCards({ summary, loading }: StationSummaryCardsProps) {
  const cards = [
    {
      title: '\u9886\u5730\u603b\u6570',
      value: summary?.total_stations ?? 0,
      icon: Building2,
      format: (v: number) => v.toString(),
    },
    {
      title: '\u603b\u6210\u5458\u6570',
      value: summary?.total_members ?? 0,
      icon: Users,
      format: (v: number) => v.toLocaleString(),
    },
    {
      title: '\u603b\u91d1\u5e93\u4f59\u989d',
      value: summary?.total_vault_mcd ?? 0,
      icon: Vault,
      format: (v: number) => `${v.toLocaleString()} MCD`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <card.icon className="w-8 h-8 text-white" />
              <span className="text-xs text-neutral-400 tracking-wider">{card.title}</span>
            </div>
            {loading ? (
              <div className="h-8 bg-neutral-800 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-white font-mono">
                {card.format(card.value)}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
