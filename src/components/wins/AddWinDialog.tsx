import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, X, CalendarIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useWinsContext } from '@/contexts/WinsContext';
import { WinCategory, ImpactType, WIN_CATEGORIES, IMPACT_TYPES } from '@/types/win';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AddWinDialogProps {
  trigger?: React.ReactNode;
}

export function AddWinDialog({ trigger }: AddWinDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [category, setCategory] = useState<WinCategory>('delivery');
  const [situation, setSituation] = useState('');
  const [action, setAction] = useState('');
  const [impact, setImpact] = useState('');
  const [impactType, setImpactType] = useState<ImpactType>('time-saved');
  const [evidence, setEvidence] = useState('');

  const { addWin } = useWinsContext();

  const resetForm = () => {
    setDate(new Date());
    setCategory('delivery');
    setSituation('');
    setAction('');
    setImpact('');
    setImpactType('time-saved');
    setEvidence('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!situation.trim() || !action.trim() || !impact.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    addWin({
      date,
      category,
      situation: situation.trim(),
      action: action.trim(),
      impact: impact.trim(),
      impactType,
      evidence: evidence.trim() || undefined,
    });

    toast.success('Win logged successfully! 🎉');
    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            className="btn-primary-glow bg-blue-600 hover:bg-blue-700 text-white gap-2 h-12 w-12 rounded-full sm:h-12 sm:w-auto sm:rounded-xl sm:px-6 p-0 sm:p-4 flex items-center justify-center"
          >
            <Plus className="w-6 h-6 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add Win</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] glass-card border-white/10 p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">New Entry</span>
          </div>
          <DialogTitle className="text-2xl font-bold">Log a Win</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-black/20 border-white/10 hover:bg-black/40",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {date ? format(date, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-white/10" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                    className="glass-card"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Win Type */}
            <div className="space-y-2">
              <Label htmlFor="category">Win Type</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as WinCategory)}>
                <SelectTrigger className="bg-black/20 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  {Object.entries(WIN_CATEGORIES).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Situation */}
          <div className="space-y-2">
            <Label htmlFor="situation">Situation <span className="text-muted-foreground text-xs font-normal ml-1">(context in one line)</span></Label>
            <Input
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g., Sprint delivery was at risk due to unresolved dependencies"
              className="bg-black/20 border-white/10 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>

          {/* Action */}
          <div className="space-y-2">
            <Label htmlFor="action">Action Taken <span className="text-muted-foreground text-xs font-normal ml-1">(what you did)</span></Label>
            <Textarea
              id="action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="e.g., Facilitated a cross-team sync to unblock critical dependencies"
              className="bg-black/20 border-white/10 focus:border-primary/50 focus:ring-primary/20 min-h-[80px] resize-none"
            />
          </div>

          {/* Impact */}
          <div className="space-y-2">
            <Label htmlFor="impact">Impact <span className="text-muted-foreground text-xs font-normal ml-1">(outcome in business terms)</span></Label>
            <Textarea
              id="impact"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="e.g., Delivered sprint on time, avoiding $50K delay cost"
              className="bg-black/20 border-white/10 focus:border-primary/50 focus:ring-primary/20 min-h-[80px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Impact Type */}
            <div className="space-y-2">
              <Label htmlFor="impactType">Impact Type</Label>
              <Select value={impactType} onValueChange={(v) => setImpactType(v as ImpactType)}>
                <SelectTrigger className="bg-black/20 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  {Object.entries(IMPACT_TYPES).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Evidence */}
            <div className="space-y-2">
              <Label htmlFor="evidence">Evidence <span className="text-muted-foreground text-xs font-normal ml-1">(optional)</span></Label>
              <Input
                id="evidence"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Link or notes"
                className="bg-black/20 border-white/10 focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="flex-1 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1 btn-primary-glow">
              Save Win
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
