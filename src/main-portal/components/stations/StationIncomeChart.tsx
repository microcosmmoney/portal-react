// AI-generated · AI-managed · AI-maintained
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { getUnitIncomeChart } from '../../lib/api-service';

interface IncomeChartData {
  date: string;
  income: number;
  cumulative: number;
}

interface StationIncomeChartProps {
  stationId: string;
  incomeData?: IncomeChartData[];
}

export default function StationIncomeChart({ stationId, incomeData }: StationIncomeChartProps) {
  const [data, setData] = useState<IncomeChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (incomeData) {
      setData(incomeData);
      setLoading(false);
    } else {
      loadIncomeData();
    }
  }, [stationId, incomeData]);

  const loadIncomeData = async () => {
    try {
      setLoading(true);
      const response = await getUnitIncomeChart(stationId, '30d');
      const chart = response.data;
      if (response.success && chart?.labels && chart?.datasets) {
        const chartData: IncomeChartData[] = chart.labels.map((label: string, index: number) => ({
          date: label,
          income: chart.datasets.income[index] || 0,
          cumulative: chart.datasets.cumulative[index] || 0,
        }));
        setData(chartData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('\u52a0\u8f7d\u6536\u5165\u6570\u636e\u5931\u8d25:', error);
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
          <TrendingUp className="w-5 h-5 text-white" />
          \u6536\u5165\u8d8b\u52bf (\u8fd130\u5929)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#a3a3a3', fontSize: 12 }}
                axisLine={{ stroke: '#525252' }}
              />
              <YAxis
                tick={{ fill: '#a3a3a3', fontSize: 12 }}
                axisLine={{ stroke: '#525252' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  border: '1px solid #404040',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#a3a3a3' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ color: '#a3a3a3' }} />
              <Line
                type="monotone"
                dataKey="income"
                name="\u65e5\u6536\u5165"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                name="\u7d2f\u8ba1\u6536\u5165"
                stroke="#ffffff"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
