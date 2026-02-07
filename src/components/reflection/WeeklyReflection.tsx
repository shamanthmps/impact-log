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
  const [focusedOn, setFocusedOn] = useState('');
  const [contributed, setContributed] = useState('');
  const [impact, setImpact] = useState('');
  const [learned, setLearned] = useState('');
  const [carryForward, setCarryForward] = useState('');

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const existingReflection = reflections.find(
    r => format(r.weekStartDate, 'yyyy-MM-dd') === format(weekStart, 'yyyy-MM-dd')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !focusedOn.trim() &&
      !contributed.trim() &&
      !impact.trim() &&
      !learned.trim() &&
      !carryForward.trim()
    ) {
      toast.error('Please fill in at least one field');
      return;
    }

    addReflection({
      weekStartDate: weekStart,
      focusedOn: focusedOn.trim(),
      contributed: contributed.trim(),
      impact: impact.trim(),
      learned: learned.trim(),
      carryForward: carryForward.trim(),
    });

    toast.success('Reflection saved! 🌟');
    setFocusedOn('');
    setContributed('');
    setImpact('');
    setLearned('');
    setCarryForward('');
  };

  const prompts = [
    {
      id: 'focusedOn',
      label: '1. What I focused on this week',
      value: focusedOn,
      onChange: setFocusedOn,
      placeholder: 'I focused on establishing trust, understanding team challenges deeply...',
    },
    {
      id: 'contributed',
      label: '2. What I contributed',
      value: contributed,
      onChange: setContributed,
      placeholder: 'I introduced multiple process and tooling improvements...',
    },
    {
      id: 'impact',
      label: '3. What impact I observed',
      value: impact,
      onChange: setImpact,
      placeholder: 'There is a noticeable shift in how I am perceived within the team...',
    },
    {
      id: 'learned',
      label: '4. What I learned',
      value: learned,
      onChange: setLearned,
      placeholder: 'Impact is accelerated when solutions are paired with empathy...',
    },
    {
      id: 'carryForward',
      label: '5. What I will carry forward',
      value: carryForward,
      onChange: setCarryForward,
      placeholder: 'I will continue to anchor my contributions around clarity...',
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
            {/* New Format Display */}
            {existingReflection.focusedOn && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Focused On
                </p>
                <p className="text-sm text-foreground whitespace-pre-wrap">{existingReflection.focusedOn}</p>
              </div>
            )}
            {existingReflection.contributed && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Contributed
                </p>
                <p className="text-sm text-foreground whitespace-pre-wrap">{existingReflection.contributed}</p>
              </div>
            )}
            {existingReflection.impact && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Impact Observed
                </p>
                <p className="text-sm text-foreground whitespace-pre-wrap">{existingReflection.impact}</p>
              </div>
            )}
            {existingReflection.learned && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Learned
                </p>
                <p className="text-sm text-foreground whitespace-pre-wrap">{existingReflection.learned}</p>
              </div>
            )}
            {existingReflection.carryForward && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Carry Forward
                </p>
                <p className="text-sm text-foreground whitespace-pre-wrap">{existingReflection.carryForward}</p>
              </div>
            )}

            {/* Old Format Display (Backward Compatibility) */}
            {existingReflection.wentWell && (
              <div className="pt-4 border-t border-border/50 mt-4">
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
