import { useState, useMemo } from 'react';
import { format, subDays, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { Copy, Download, CalendarIcon, FileText, CheckCircle, ArrowRight, ArrowUpDown } from 'lucide-react';
import { useWinsContext } from '@/contexts/WinsContext';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Win, WIN_CATEGORIES, IMPACT_TYPES, IMPACT_LEVELS } from '@/types/win';

type SortOption = 'priority' | 'date_desc' | 'date_asc';

export function ManagerReadyView() {
  const { wins, getWinsByDateRange } = useWinsContext();
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [sortBy, setSortBy] = useState<SortOption>('priority');

  const filteredWins = useMemo(() => {
    const rangeWins = getWinsByDateRange(startDate, endDate);

    return rangeWins.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityA = IMPACT_LEVELS[a.impactLevel || 'Medium'].value;
        const priorityB = IMPACT_LEVELS[b.impactLevel || 'Medium'].value;
        if (priorityA !== priorityB) {
          return priorityB - priorityA; // Descending priority
        }
        return b.date.getTime() - a.date.getTime(); // Descending date fallback
      }

      if (sortBy === 'date_asc') {
        return a.date.getTime() - b.date.getTime();
      }

      // Default: date_desc
      return b.date.getTime() - a.date.getTime();
    });
  }, [startDate, endDate, getWinsByDateRange, sortBy]);

  const formatWinForCopy = (win: Win, index: number) => {
    const priorityLabel = win.impactLevel ? `[${IMPACT_LEVELS[win.impactLevel].label}] ` : '';
    return `${index + 1}. ${priorityLabel}${WIN_CATEGORIES[win.category].label} (${format(win.date, 'MMM d')})
   Challenge: ${win.situation}
   Action: ${win.action}
   Result: ${win.impact}`;
  };

  const generateSummary = () => {
    if (filteredWins.length === 0) return '';

    const dateRange = `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
    const header = `📊 Impact Summary (${dateRange})\n\n`;
    const winsText = filteredWins.map((win, i) => formatWinForCopy(win, i)).join('\n\n');

    return header + winsText;
  };

  const handleCopy = async () => {
    const text = generateSummary();
    if (!text) {
      toast.error('No wins to copy');
      return;
    }

    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleExport = () => {
    const text = generateSummary();
    if (!text) {
      toast.error('No wins to export');
      return;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `impact-summary-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Date Range & Sort Selection */}
      <GlassCard className="p-4 sm:p-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

            {/* Controls Group */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Date Range */}
              <div className="space-y-1.5 w-full sm:w-auto">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Date Range</span>
                <div className="flex items-center gap-2 bg-white/50 p-1 rounded-xl border border-white/40 w-full sm:w-auto">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="flex-1 sm:w-[120px] justify-start text-left font-normal hover:bg-white/60 h-9 px-3">
                        <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="truncate">{format(startDate, 'MMM d')}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(d) => d && setStartDate(d)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <div className="text-muted-foreground/50 px-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="flex-1 sm:w-[120px] justify-start text-left font-normal hover:bg-white/60 h-9 px-3">
                        <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="truncate">{format(endDate, 'MMM d, yyyy')}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(d) => d && setEndDate(d)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-1.5 w-full sm:w-auto">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Sort Order</span>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-white/50 border-white/40 h-[46px] rounded-xl px-3 hover:bg-white/60 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="priority">Impact Level</SelectItem>
                    <SelectItem value="date_desc">Newest First</SelectItem>
                    <SelectItem value="date_asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full lg:w-auto self-end lg:self-center">
              <Button variant="secondary" onClick={handleCopy} className="flex-1 lg:flex-none border border-white/40 bg-white/40 hover:bg-white/60 shadow-sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="default" onClick={handleExport} className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 text-white">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Summary Preview */}
      {filteredWins.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">
            No wins in this date range. Adjust the dates or log some wins!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Found {filteredWins.length} achievements</span>
            </div>
            <span className="text-xs uppercase tracking-wide opacity-70">
              Sorted by {sortBy === 'priority' ? 'Impact Level' : 'Date'}
            </span>
          </div>

          {filteredWins.map((win, index) => (
            <GlassCard
              key={win.id}
              className="animate-slide-up bg-white/60 hover:bg-white/80 transition-colors"
              style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-sm">
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {win.impactLevel && (
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border shadow-sm", IMPACT_LEVELS[win.impactLevel].color)}>
                        {IMPACT_LEVELS[win.impactLevel].label}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-0.5 bg-gray-100 rounded-full">
                      {WIN_CATEGORIES[win.category].label}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {format(win.date, 'MMM d, yyyy')}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      Challenge
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">{win.situation}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      Action
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{win.action}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      Result
                    </p>
                    <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                      <p className="text-sm text-gray-800 font-semibold">{win.impact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
