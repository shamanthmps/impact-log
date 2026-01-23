import { Trophy, Calendar, Layers } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { useWinsContext } from '@/contexts/WinsContext';

export function StatsCards() {
  const { getWinsThisWeek, getWinsThisMonth, getCategoriesCovered } = useWinsContext();

  const stats = [
    {
      label: 'Wins This Week',
      value: getWinsThisWeek(),
      icon: Trophy,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Wins This Month',
      value: getWinsThisMonth(),
      icon: Calendar,
      color: 'text-category-stakeholder',
      bgColor: 'bg-category-stakeholder/10',
    },
    {
      label: 'Categories Covered',
      value: getCategoriesCovered(),
      icon: Layers,
      color: 'text-category-leadership',
      bgColor: 'bg-category-leadership/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <GlassCard 
          key={stat.label} 
          className="animate-slide-up"
          hover
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-3xl font-semibold text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
