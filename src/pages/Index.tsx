import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, LayoutDashboard, Clock, FileText, Sparkles } from 'lucide-react';
import { WinsProvider } from '@/contexts/WinsContext';
import { Button } from '@/components/ui/button';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { AddWinDialog } from '@/components/wins/AddWinDialog';
import { WinsTimeline } from '@/components/wins/WinsTimeline';
import { ManagerReadyView } from '@/components/manager/ManagerReadyView';
import { WeeklyReflection } from '@/components/reflection/WeeklyReflection';
import { cn } from '@/lib/utils';

type View = 'dashboard' | 'timeline' | 'manager' | 'reflection';

const MOTIVATIONAL_LINES = [
  "Small wins compound into big impact.",
  "Your work matters. Document it.",
  "Evidence beats memory. Every time.",
  "Great leaders track their impact.",
  "Build your narrative, one win at a time.",
];

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  const today = new Date();
  const greeting = format(today, 'EEEE, MMMM d');
  const motivation = MOTIVATIONAL_LINES[today.getDay() % MOTIVATIONAL_LINES.length];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'manager', label: 'Manager Ready', icon: FileText },
    { id: 'reflection', label: 'Reflect', icon: Sparkles },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-main">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-0 border-b border-border/30">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient-primary">
                ImpactLog
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Your personal impact operating system
              </p>
            </div>
            <AddWinDialog />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-[73px] z-40 glass-card border-0 border-b border-border/30">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView(item.id)}
                className={cn(
                  "flex-shrink-0 gap-2",
                  currentView === item.id && "bg-white shadow-sm"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Greeting */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">{greeting}</p>
              <h2 className="text-xl font-medium text-foreground">
                {motivation}
              </h2>
            </div>

            {/* Stats */}
            <StatsCards />

            {/* Quick Add Section */}
            <div className="text-center py-8">
              <AddWinDialog 
                trigger={
                  <Button variant="primary" size="lg" className="gap-2 text-lg px-8 py-6 h-auto">
                    <Plus className="w-6 h-6" />
                    Log Today's Win
                  </Button>
                }
              />
              <p className="text-sm text-muted-foreground mt-4">
                Capture your impact in under 60 seconds
              </p>
            </div>
          </div>
        )}

        {currentView === 'timeline' && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">Wins Timeline</h2>
              <p className="text-sm text-muted-foreground">
                Your complete history of impact
              </p>
            </div>
            <WinsTimeline />
          </div>
        )}

        {currentView === 'manager' && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">Manager Ready View</h2>
              <p className="text-sm text-muted-foreground">
                Curated summaries for your 1:1s and reviews
              </p>
            </div>
            <ManagerReadyView />
          </div>
        )}

        {currentView === 'reflection' && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">Weekly Reflection</h2>
              <p className="text-sm text-muted-foreground">
                Pause and reflect on your journey
              </p>
            </div>
            <WeeklyReflection />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-xs text-muted-foreground">
          Built for leaders who lead through clarity and ownership
        </p>
      </footer>
    </div>
  );
}

const Index = () => {
  return (
    <WinsProvider>
      <AppContent />
    </WinsProvider>
  );
};

export default Index;
