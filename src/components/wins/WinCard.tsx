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
        "transition-all duration-300",
        expanded ? "ring-2 ring-primary/20" : ""
      )}
      hover
    >
      <div 
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs font-medium",
                  `bg-${category.color}/10 text-${category.color} border-0`
                )}
                style={{
                  backgroundColor: `hsl(var(--${category.color}) / 0.1)`,
                  color: `hsl(var(--${category.color}))`,
                }}
              >
                {category.label}
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{
                  borderColor: `hsl(var(--${impactType.color}) / 0.3)`,
                  color: `hsl(var(--${impactType.color}))`,
                }}
              >
                {impactType.label}
              </Badge>
            </div>
            
            <p className="font-medium text-foreground line-clamp-2 mb-1">
              {win.situation}
            </p>
            
            <p className="text-sm text-muted-foreground">
              {format(win.date, 'MMM d, yyyy')}
            </p>
          </div>
          
          <Button variant="ghost" size="icon" className="shrink-0">
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Action Taken
              </p>
              <p className="text-sm text-foreground">{win.action}</p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Impact
              </p>
              <p className="text-sm text-foreground">{win.impact}</p>
            </div>

            {win.evidence && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Evidence
                </p>
                <p className="text-sm text-foreground flex items-center gap-1">
                  {win.evidence}
                  {win.evidence.startsWith('http') && (
                    <ExternalLink className="w-3 h-3" />
                  )}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(win);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="w-4 h-4 mr-1" />
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
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
