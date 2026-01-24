import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, X, CalendarIcon, Sparkles, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useWinsContext } from '@/contexts/WinsContext';
import { WinCategory, ImpactType, ImpactLevel, WIN_CATEGORIES, IMPACT_TYPES, IMPACT_LEVELS, Win } from '@/types/win';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AddWinDialogProps {
  trigger?: React.ReactNode;
  winToEdit?: Win | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddWinDialog({ trigger, winToEdit, open: controlledOpen, onOpenChange: setControlledOpen }: AddWinDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  const [date, setDate] = useState<Date>(new Date());
  const [category, setCategory] = useState<WinCategory>('delivery');
  const [situation, setSituation] = useState('');
  const [action, setAction] = useState('');
  const [impact, setImpact] = useState('');
  const [impactType, setImpactType] = useState<ImpactType>('time-saved');
  const [impactLevel, setImpactLevel] = useState<ImpactLevel>('Medium');
  const [evidence, setEvidence] = useState('');

  const { addWin, updateWin } = useWinsContext();

  const isEditing = !!winToEdit;

  useEffect(() => {
    if (winToEdit) {
      setDate(new Date(winToEdit.date));
      setCategory(winToEdit.category);
      setSituation(winToEdit.situation);
      setAction(winToEdit.action);
      setImpact(winToEdit.impact);
      setImpactType(winToEdit.impactType);
      setImpactLevel(winToEdit.impactLevel || 'Medium'); // Default to Medium for existing records
      setEvidence(winToEdit.evidence || '');
    } else if (isOpen && !isEditing) {
      if (!trigger) { // If controlled
        resetForm();
      }
    }
  }, [winToEdit, isOpen]);

  const resetForm = () => {
    setDate(new Date());
    setCategory('delivery');
    setSituation('');
    setAction('');
    setImpact('');
    setImpactType('time-saved');
    setImpactLevel('Medium');
    setEvidence('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!situation.trim() || !action.trim() || !impact.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (isEditing && winToEdit) {
        await updateWin(winToEdit.id, {
          date,
          category,
          situation: situation.trim(),
          action: action.trim(),
          impact: impact.trim(),
          impactType,
          impactLevel,
          evidence: evidence.trim() || undefined,
        });
        toast.success('Win updated successfully! 📝');
      } else {
        await addWin({
          date,
          category,
          situation: situation.trim(),
          action: action.trim(),
          impact: impact.trim(),
          impactType,
          impactLevel,
          evidence: evidence.trim() || undefined,
        });
        toast.success('Win logged successfully! 🎉');
      }

      setOpen(false);
      if (!isEditing) resetForm();

    } catch (error) {
      toast.error("Failed to save win");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[550px] glass-card border-white/10 p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-2 text-primary mb-1">
            {isEditing ? <Pencil className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            <span className="text-xs font-medium uppercase tracking-wider">{isEditing ? 'Update Entry' : 'New Entry'}</span>
          </div>
          <DialogTitle className="text-2xl font-bold">{isEditing ? 'Edit Win' : 'Log a Win'}</DialogTitle>
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

          {/* Challenge (mapped to situation field) */}
          <div className="space-y-2">
            <Label htmlFor="situation">Challenge <span className="text-muted-foreground text-xs font-normal ml-1">(context vs problem)</span></Label>
            <Input
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g., Critical release stalled due to unmanaged dependencies"
              className="bg-black/20 border-white/10 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>

          {/* Action */}
          <div className="space-y-2">
            <Label htmlFor="action">Action <span className="text-muted-foreground text-xs font-normal ml-1">(your specific contribution)</span></Label>
            <Textarea
              id="action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="e.g., Initiated daily cross-functional standups and created a dependency map"
              className="bg-black/20 border-white/10 focus:border-primary/50 focus:ring-primary/20 min-h-[80px] resize-none"
            />
          </div>

          {/* Result (mapped to impact field) */}
          <div className="space-y-2">
            <Label htmlFor="impact">Result <span className="text-muted-foreground text-xs font-normal ml-1">(measurable outcome)</span></Label>
            <Textarea
              id="impact"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="e.g., Unblocked deployment in 48h, preventing a 1-week slip"
              className="bg-black/20 border-white/10 focus:border-primary/50 focus:ring-primary/20 min-h-[80px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Impact Category */}
            <div className="space-y-2">
              <Label htmlFor="impactType">Impact Category</Label>
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

            {/* Impact Level */}
            <div className="space-y-2">
              <Label htmlFor="impactLevel">Impact Level</Label>
              <Select value={impactLevel} onValueChange={(v) => setImpactLevel(v as ImpactLevel)}>
                <SelectTrigger className="bg-black/20 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  {Object.entries(IMPACT_LEVELS).map(([key, { label, color }]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", color.replace('bg-', 'bg-current text-'))}></span>
                        {label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              {isEditing ? 'Update Win' : 'Save Win'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
