import { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export function GlassCard({ children, className, hover = false, onClick, style }: GlassCardProps) {
  return (
    <div 
      className={cn(
        hover ? 'glass-card-hover cursor-pointer' : 'glass-card',
        'rounded-2xl p-6',
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
