// AI-generated · AI-managed · AI-maintained
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Trophy, Medal, Award } from 'lucide-react';
import { getUnitMemberRanking } from '../../lib/api-service';

interface MemberRank {
  rank: number;
  user_id: string;
  nickname: string;
  contribution: number;
  email?: string;
}

interface StationMemberRankingProps {
  stationId: string;
  members?: MemberRank[];
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Trophy className="w-5 h-5 text-cyan-400" />;
    case 2: return <Medal className="w-5 h-5 text-neutral-400" />;
    case 3: return <Award className="w-5 h-5 text-cyan-300" />;
    default: return null;
  }
};

const getRankBadgeColor = (rank: number) => {
  switch (rank) {
    case 1: return 'bg-cyan-400/20 text-cyan-400';
    case 2: return 'bg-white/20 text-white';
    case 3: return 'bg-cyan-400/20 text-cyan-300';
    default: return 'bg-neutral-500/20 text-neutral-300';
  }
};

export default function StationMemberRanking({ stationId, members }: StationMemberRankingProps) {
  const [data, setData] = useState<MemberRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (members) {
      setData(members);
      setLoading(false);
    } else {
      loadMemberRanking();
    }
  }, [stationId, members]);

  const loadMemberRanking = async () => {
    try {
      setLoading(true);
      const response = await getUnitMemberRanking(stationId, 10);
      if (response.success && response.data) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('\u52a0\u8f7d\u6210\u5458\u6392\u540d\u5931\u8d25:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="pt-6">
          <div className="h-64 flex items-center justify-center">
            <p className="text-neutral-500">\u52a0\u8f7d\u4e2d...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
          <Trophy className="w-5 h-5 text-cyan-400" />
          \u6210\u5458\u8d21\u732e\u6392\u884c
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((member) => (
            <div
              key={member.user_id}
              className="flex items-center gap-3 p-2 bg-neutral-800 rounded hover:bg-neutral-700 transition-colors"
            >
              <div className="w-8 flex justify-center">
                {getRankIcon(member.rank) || (
                  <span className="text-neutral-500 font-mono text-sm">#{member.rank}</span>
                )}
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-neutral-700 text-white text-xs">
                  {member.nickname.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium truncate">{member.nickname}</span>
                  {member.rank <= 3 && (
                    <Badge className={getRankBadgeColor(member.rank)}>
                      TOP {member.rank}
                    </Badge>
                  )}
                </div>
                {member.email && (
                  <span className="text-xs text-neutral-500">{member.email}</span>
                )}
              </div>
              <div className="text-right">
                <span className="text-white font-mono font-medium">
                  {member.contribution.toLocaleString()}
                </span>
                <span className="text-neutral-500 text-sm ml-1">MCD</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
