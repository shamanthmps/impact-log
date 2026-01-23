import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Win, WIN_CATEGORIES, IMPACT_TYPES } from '@/types/win';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WinCardProps {
  win: Win;
  onEdit?: (win: Win) => void;
  onDelete?: (id: string) => void;
}

export function WinCard({ win, onEdit, onDelete }: WinCardProps) {
  const [expanded, setExpanded] = useState(false);

  const category = WIN_CATEGORIES[win.category];
  const impactType = IMPACT_TYPES[win.impactType];

  return (
    <GlassCard
      className={cn(
        "transition-all duration-300 border-white/5",
        expanded ? "ring-1 ring-primary/50 shadow-lg shadow-primary/5 scale-[1.01]" : "hover:border-white/10"
      )}
      hover
    >
      <div
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm",
                  `bg-${category.color}/10 text-${category.color} border-0`
                )}
                style={{
                  backgroundColor: `hsl(var(--${category.color}) / 0.15)`,
                  color: `hsl(var(--${category.color}))`,
                  boxShadow: `0 0 10px hsl(var(--${category.color}) / 0.2)`
                }}
              >
                {category.label}
              </Badge>
              <span className="text-xs text-muted-foreground/50">•</span>
              <span className="text-xs font-medium text-muted-foreground">
                {format(win.date, 'MMM d, yyyy')}
              </span>
            </div>

            <p className="text-lg font-medium text-foreground line-clamp-2 leading-snug">
              {win.situation}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-wider px-2 py-0 border-white/10"
                style={{
                  color: `hsl(var(--${impactType.color}))`,
                }}
              >
                {impactType.label}
              </Badge>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="shrink-0 rounded-full hover:bg-white/5 text-muted-foreground">
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-5 pt-5 border-t border-white/5 animate-fade-in space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-primary/80 uppercase tracking-widest">
                Action Taken
              </p>
              <p className="text-sm text-foreground/90 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                {win.action}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-primary/80 uppercase tracking-widest">
                Impact
              </p>
              <p className="text-sm text-foreground/90 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                {win.impact}
              </p>
            </div>
          </div>

          {win.evidence && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Evidence
              </p>
              <div className="text-sm text-foreground/80 flex items-center gap-2 bg-black/20 p-2 rounded-lg border border-white/5">
                <ExternalLink className="w-3.5 h-3.5 text-primary" />
                {win.evidence.startsWith('http') ? (
                  <a
                    href={win.evidence}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {win.evidence}
                  </a>
                ) : (
                  <span>{win.evidence}</span>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1 justify-end">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(win);
                }}
                className="text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(win.id);
                }}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Delete
              </Button>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
