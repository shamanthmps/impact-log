import { useState } from 'react';
import { format, startOfWeek } from 'date-fns';
import { Save, Sparkles } from 'lucide-react';
import { useWinsContext } from '@/contexts/WinsContext';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function WeeklyReflection() {
  const { addReflection, reflections } = useWinsContext();
  const [wentWell, setWentWell] = useState('');
  const [unblocked, setUnblocked] = useState('');
  const [proudOf, setProudOf] = useState('');

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const existingReflection = reflections.find(
    r => format(r.weekStartDate, 'yyyy-MM-dd') === format(weekStart, 'yyyy-MM-dd')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!wentWell.trim() && !unblocked.trim() && !proudOf.trim()) {
      toast.error('Please fill in at least one field');
      return;
    }

    addReflection({
      weekStartDate: weekStart,
      wentWell: wentWell.trim(),
      unblocked: unblocked.trim(),
      proudOf: proudOf.trim(),
    });

    toast.success('Reflection saved! 🌟');
    setWentWell('');
    setUnblocked('');
    setProudOf('');
  };

  const prompts = [
    {
      id: 'wentWell',
      label: 'What went well this week?',
      value: wentWell,
      onChange: setWentWell,
      placeholder: 'Shipped the new feature, got positive feedback from stakeholders...',
    },
    {
      id: 'unblocked',
      label: 'What did I unblock?',
      value: unblocked,
      onChange: setUnblocked,
      placeholder: 'Resolved the dependency issue, facilitated a key decision...',
    },
    {
      id: 'proudOf',
      label: 'What am I proud of?',
      value: proudOf,
      onChange: setProudOf,
      placeholder: 'Led a difficult conversation, mentored a team member...',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            Week of {format(weekStart, 'MMMM d, yyyy')}
          </h3>
          <p className="text-sm text-muted-foreground">
            Take a moment to reflect on your impact this week
          </p>
        </div>
      </div>

      {existingReflection ? (
        <GlassCard>
          <p className="text-sm text-muted-foreground mb-4">
            You've already reflected on this week. Here's what you wrote:
          </p>
          <div className="space-y-4">
            {existingReflection.wentWell && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  What went well
                </p>
                <p className="text-sm text-foreground">{existingReflection.wentWell}</p>
              </div>
            )}
            {existingReflection.unblocked && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  What I unblocked
                </p>
                <p className="text-sm text-foreground">{existingReflection.unblocked}</p>
              </div>
            )}
            {existingReflection.proudOf && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  What I'm proud of
                </p>
                <p className="text-sm text-foreground">{existingReflection.proudOf}</p>
              </div>
            )}
          </div>
        </GlassCard>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {prompts.map((prompt, index) => (
            <GlassCard 
              key={prompt.id} 
              className="animate-slide-up p-5"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            >
              <Label htmlFor={prompt.id} className="text-sm font-medium">
                {prompt.label}
              </Label>
              <Textarea
                id={prompt.id}
                value={prompt.value}
                onChange={(e) => prompt.onChange(e.target.value)}
                placeholder={prompt.placeholder}
                className="mt-2 bg-white/50 min-h-[100px] resize-none"
              />
            </GlassCard>
          ))}

          <Button type="submit" variant="primary" size="lg" className="w-full">
            <Save className="w-5 h-5 mr-2" />
            Save Reflection
          </Button>
        </form>
      )}
    </div>
  );
}
