import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, X, CalendarIcon } from 'lucide-react';
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
          <Button variant="primary" size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Add Win
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] glass-card border-0 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold">Log a Win</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Win Type */}
            <div className="space-y-2">
              <Label htmlFor="category">Win Type</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as WinCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
            <Label htmlFor="situation">Situation <span className="text-muted-foreground">(context in one line)</span></Label>
            <Input
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g., Sprint delivery was at risk due to unresolved dependencies"
              className="bg-white/50"
            />
          </div>

          {/* Action */}
          <div className="space-y-2">
            <Label htmlFor="action">Action Taken <span className="text-muted-foreground">(what you did)</span></Label>
            <Textarea
              id="action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="e.g., Facilitated a cross-team sync to unblock critical dependencies"
              className="bg-white/50 min-h-[80px] resize-none"
            />
          </div>

          {/* Impact */}
          <div className="space-y-2">
            <Label htmlFor="impact">Impact <span className="text-muted-foreground">(outcome in business terms)</span></Label>
            <Textarea
              id="impact"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="e.g., Delivered sprint on time, avoiding $50K delay cost"
              className="bg-white/50 min-h-[80px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Impact Type */}
            <div className="space-y-2">
              <Label htmlFor="impactType">Impact Type</Label>
              <Select value={impactType} onValueChange={(v) => setImpactType(v as ImpactType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="evidence">Evidence <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                id="evidence"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Link or notes"
                className="bg-white/50"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Save Win
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
