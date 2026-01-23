import { useState, useMemo } from 'react';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Filter, Search } from 'lucide-react';
import { WinCard } from './WinCard';
import { useWinsContext } from '@/contexts/WinsContext';
import { WinCategory, WIN_CATEGORIES } from '@/types/win';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type DateFilter = 'all' | 'week' | 'month' | '3months';

export function WinsTimeline() {
  const { wins, deleteWin } = useWinsContext();
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<WinCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWins = useMemo(() => {
    let filtered = [...wins];

    // Date filter
    const now = new Date();
    if (dateFilter === 'week') {
      const weekAgo = subDays(now, 7);
      filtered = filtered.filter(w => w.date >= weekAgo);
    } else if (dateFilter === 'month') {
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      filtered = filtered.filter(w => w.date >= start && w.date <= end);
    } else if (dateFilter === '3months') {
      const threeMonthsAgo = subMonths(now, 3);
      filtered = filtered.filter(w => w.date >= threeMonthsAgo);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(w => w.category === categoryFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w => 
        w.situation.toLowerCase().includes(query) ||
        w.action.toLowerCase().includes(query) ||
        w.impact.toLowerCase().includes(query)
      );
    }

    // Sort by date descending
    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [wins, dateFilter, categoryFilter, searchQuery]);

  const handleDelete = (id: string) => {
    deleteWin(id);
    toast.success('Win deleted');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search wins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/50"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
            <SelectTrigger className="w-[140px] bg-white/50">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as WinCategory | 'all')}>
            <SelectTrigger className="w-[160px] bg-white/50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(WIN_CATEGORIES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Wins List */}
      {filteredWins.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {wins.length === 0 
              ? "No wins logged yet. Start capturing your impact!"
              : "No wins match your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWins.map((win, index) => (
            <div 
              key={win.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <WinCard 
                win={win} 
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
