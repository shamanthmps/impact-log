import { useState, useMemo } from 'react';
import { format, subDays, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { Copy, Download, CalendarIcon, FileText, CheckCircle } from 'lucide-react';
import { useWinsContext } from '@/contexts/WinsContext';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Win, WIN_CATEGORIES, IMPACT_TYPES } from '@/types/win';

export function ManagerReadyView() {
  const { wins, getWinsByDateRange } = useWinsContext();
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());

  const filteredWins = useMemo(() => {
    return getWinsByDateRange(startDate, endDate).slice(0, 5);
  }, [startDate, endDate, getWinsByDateRange]);

  const formatWinForCopy = (win: Win, index: number) => {
    return `${index + 1}. ${WIN_CATEGORIES[win.category].label}
   Problem: ${win.situation}
   Action: ${win.action}
   Impact: ${win.impact}`;
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
      {/* Date Range Selection */}
      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Date Range:</span>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-white/50">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {format(startDate, 'MMM d')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(d) => d && setStartDate(d)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <span className="text-muted-foreground">to</span>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-white/50">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {format(endDate, 'MMM d, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(d) => d && setEndDate(d)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={handleCopy} className="bg-white/50">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" onClick={handleExport} className="bg-white/50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span>Top {filteredWins.length} wins ready for your 1:1</span>
          </div>

          {filteredWins.map((win, index) => (
            <GlassCard 
              key={win.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{index + 1}</span>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                      {WIN_CATEGORIES[win.category].label}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Problem
                    </p>
                    <p className="text-sm text-foreground">{win.situation}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Action
                    </p>
                    <p className="text-sm text-foreground">{win.action}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Impact
                    </p>
                    <p className="text-sm text-foreground font-medium">{win.impact}</p>
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
