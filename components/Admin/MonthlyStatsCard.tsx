import React, { useEffect, useMemo, useState } from 'react';
import { Clock, Image as ImageIcon, TrendingUp, Users } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { formatDuration, formatMonthLabel, getMonthKey } from '../../utils/analytics';

type MonthlyAnalyticsRow = {
  unique_visits: number;
  artwork_views: number;
  avg_time_seconds: number;
};

const DEFAULT_ROW: MonthlyAnalyticsRow = {
  unique_visits: 0,
  artwork_views: 0,
  avg_time_seconds: 0,
};

const numberFormatter = new Intl.NumberFormat('en-US');

export const MonthlyStatsCard = () => {
  const [loading, setLoading] = useState(false);
  const [row, setRow] = useState<MonthlyAnalyticsRow>(DEFAULT_ROW);

  useEffect(() => {
    const fetchMonthlyAnalytics = async () => {
      setLoading(true);

      try {
        const monthKey = getMonthKey(new Date());
        const { data, error } = await supabase
          .from('analytics_monthly')
          .select('unique_visits, artwork_views, avg_time_seconds')
          .eq('month', monthKey)
          .maybeSingle();

        if (error) {
          console.error('Error fetching monthly analytics:', error);
          setRow(DEFAULT_ROW);
          return;
        }

        setRow({
          unique_visits: data?.unique_visits ?? 0,
          artwork_views: data?.artwork_views ?? 0,
          avg_time_seconds: data?.avg_time_seconds ?? 0,
        });
      } catch (error) {
        console.error('Unexpected error fetching monthly analytics:', error);
        setRow(DEFAULT_ROW);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyAnalytics();
  }, []);

  const monthLabel = useMemo(() => formatMonthLabel(new Date()), []);
  const uniqueVisitsLabel = loading ? '...' : numberFormatter.format(row.unique_visits);
  const artworkViewsLabel = loading ? '...' : numberFormatter.format(row.artwork_views);
  const avgTimeLabel = loading ? '...' : formatDuration(row.avg_time_seconds);

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-black/5">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-bold text-emerald-950 flex items-center gap-3">
          <TrendingUp className="text-emerald-500" size={24} /> Statistiques du Mois
        </h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">{monthLabel}</span>
      </div>
      <div className="space-y-6">
        <ActivityItem icon={Users} label="Visites uniques" val={uniqueVisitsLabel} color="bg-emerald-50 text-emerald-600" />
        <ActivityItem icon={ImageIcon} label="Vues des œuvres" val={artworkViewsLabel} color="bg-blue-50 text-blue-600" />
        <ActivityItem icon={Clock} label="Temps moyen" val={avgTimeLabel} color="bg-purple-50 text-purple-600" />
      </div>
    </div>
  );
};

const ActivityItem = ({ icon: Icon, label, val, color }: any) => (
  <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-black/5 group">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
      <span className="text-sm font-bold text-emerald-950/80">{label}</span>
    </div>
    <span className="text-lg font-black text-emerald-950">{val}</span>
  </div>
);

