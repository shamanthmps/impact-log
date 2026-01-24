import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, LayoutDashboard, Clock, FileText, Sparkles, Zap, Search, Bell, LogOut, User, AlertTriangle, ShieldAlert, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WinsProvider, useWinsContext } from '@/contexts/WinsContext';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { AddWinDialog } from '@/components/wins/AddWinDialog';
import { ProfileDialogContent } from '@/components/profile/ProfileDialog';
import { WinsTimeline } from '@/components/wins/WinsTimeline';
import { ManagerReadyView } from '@/components/manager/ManagerReadyView';
import { WeeklyReflection } from '@/components/reflection/WeeklyReflection';
import { cn } from '@/lib/utils';
import { MOTIVATIONAL_LINES, APP_CONFIG, DATE_CONFIG } from '@/lib/constants';
import { toast } from 'sonner';

type View = 'dashboard' | 'timeline' | 'manager' | 'reflection';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const { logout, currentUser } = useAuth();
  const { isGuest } = useWinsContext();
  const navigate = useNavigate();

  // Show welcome toast for members (Guests)
  useEffect(() => {
    if (isGuest) {
      toast.warning("Member Access Active", {
        description: "Your data is securely saved in your browser. Contact Admin for cross-device cloud storage.",
        duration: 8000,
        className: "!border-2 !border-red-500 !bg-red-50 !text-red-900",
        descriptionClassName: "!text-red-800 !font-semibold"
      });
    }
  }, [isGuest]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const today = new Date();
  const greeting = format(today, DATE_CONFIG.FULL_DATE_FORMAT);
  const motivation = MOTIVATIONAL_LINES[today.getDay() % MOTIVATIONAL_LINES.length];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'manager', label: 'Impact Report', icon: FileText },
    { id: 'reflection', label: 'Reflect', icon: Sparkles },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-foreground">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                {APP_CONFIG.APP_NAME}
              </h1>
            </div>
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            <AddWinDialog />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg transition-all ml-1 cursor-pointer",
                  isGuest ? "bg-gray-500" : "bg-gradient-to-br from-blue-500 to-blue-600"
                )}>
                  {currentUser?.displayName?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 mt-2 bg-white border-gray-100 shadow-xl">
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="font-bold text-gray-900">{currentUser?.displayName || 'User'}</div>
                  <div className="text-xs text-gray-500 font-normal">{currentUser?.email}</div>
                  {isGuest && (
                    <div className="mt-1 text-[10px] text-amber-600 font-bold uppercase tracking-wider">Guest Access</div>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100 my-1" />
                <DropdownMenuItem onClick={() => setShowProfile(true)} className="rounded-xl cursor-pointer px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 outline-none">
                  <User className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Profile</span>
                </DropdownMenuItem>

                {!isGuest && (
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-xl cursor-pointer px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 outline-none">
                    <Settings className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="bg-gray-100 my-1" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl cursor-pointer px-3 py-2 hover:bg-red-50 focus:bg-red-50 text-red-600 focus:text-red-700 outline-none">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showProfile} onOpenChange={setShowProfile}>
              <DialogContent className="sm:max-w-[425px] rounded-3xl p-6 bg-white border-none shadow-2xl">
                <ProfileDialogContent />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Guest Warning Banner (REMOVED as requested, replaced by Toast) */}

        {/* Page Title & Motivation */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">{greeting}</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1A1A1A] tracking-tight mb-4">
            Professional <span className="text-blue-600">Impact</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
            "{motivation}"
          </p>
        </div>

        {/* Custom Navigation Pills */}
        <div className="flex sm:flex-wrap overflow-x-auto sm:overflow-visible gap-2 mb-10 pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border whitespace-nowrap flex-shrink-0",
                currentView === item.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                  : "bg-white text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-4 h-4", currentView === item.id ? "text-white" : "text-gray-400")} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Views */}
        <div className="space-y-8">
          {currentView === 'dashboard' && (
            <div className="space-y-10 animate-fade-in">
              {/* Stats Row */}
              <StatsCards />

              {/* Main Action Area */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-10 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20 group cursor-pointer transition-all leading-tight hover:scale-[1.005]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300 opacity-20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                <div className="relative z-10 max-w-lg mx-auto space-y-6">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto border border-white/20">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-full h-full flex items-center justify-center outline-none focus:ring-2 focus:ring-white/50 rounded-2xl transition-all hover:bg-white/20">
                          <Plus className="w-8 h-8 text-white" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-48 bg-white/95 backdrop-blur-xl border-white/20 shadow-xl rounded-xl">
                        <AddWinDialog
                          trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer gap-2 p-3 font-medium text-gray-700 hover:text-blue-600 focus:text-blue-600 hover:bg-blue-50 focus:bg-blue-50 rounded-lg">
                              <Zap className="w-4 h-4" />
                              Log Win
                            </DropdownMenuItem>
                          }
                        />
                        <DropdownMenuItem onClick={() => setCurrentView('reflection')} className="cursor-pointer gap-2 p-3 font-medium text-gray-700 hover:text-purple-600 focus:text-purple-600 hover:bg-purple-50 focus:bg-purple-50 rounded-lg">
                          <Sparkles className="w-4 h-4" />
                          Start Reflection
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentView('manager')} className="cursor-pointer gap-2 p-3 font-medium text-gray-700 hover:text-emerald-600 focus:text-emerald-600 hover:bg-emerald-50 focus:bg-emerald-50 rounded-lg">
                          <FileText className="w-4 h-4" />
                          Impact Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Log a New Achievement</h2>
                    <p className="text-blue-100 text-lg">Capture your impact while it's fresh. Only takes 60 seconds.</p>
                  </div>
                  <AddWinDialog
                    trigger={
                      <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-900/10 transition-all active:scale-95">
                        Log Today's Win
                      </button>
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {currentView === 'timeline' && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <WinsTimeline />
              </div>
            </div>
          )}

          {currentView === 'manager' && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <ManagerReadyView />
              </div>
            </div>
          )}

          {currentView === 'reflection' && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <WeeklyReflection />
              </div>
            </div>
          )}
        </div>
      </main>
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
