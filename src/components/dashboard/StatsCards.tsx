import { Trophy, Calendar, Layers } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { useWinsContext } from '@/contexts/WinsContext';
import { DateFilter } from '@/components/wins/WinsTimeline';

interface StatsCardsProps {
  onNavigate: (filter: DateFilter) => void;
}

export function StatsCards({ onNavigate }: StatsCardsProps) {
  const { getWinsThisWeek, getWinsThisMonth, getCategoriesCovered } = useWinsContext();

  const stats = [
    {
      label: 'Wins This Week',
      value: getWinsThisWeek(),
      icon: Trophy,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      delay: '0ms',
      filter: 'week' as DateFilter
    },
    {
      label: 'Wins This Month',
      value: getWinsThisMonth(),
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      delay: '100ms',
      filter: 'month' as DateFilter
    },
    {
      label: 'Categories Covered',
      value: getCategoriesCovered(),
      icon: Layers,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      delay: '200ms',
      filter: 'all' as DateFilter
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <GlassCard
          key={stat.label}
          className="animate-slide-up hover:border-primary/50 transition-colors duration-300 cursor-pointer active:scale-[98%] transition-transform"
          style={{ animationDelay: stat.delay }}
          hover
          onClick={() => onNavigate(stat.filter)}
        >
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${stat.bgColor} ring-1 ring-inset ring-white/5`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-4xl font-bold text-foreground tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
