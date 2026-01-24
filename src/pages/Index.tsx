import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, LayoutDashboard, Clock, FileText, Sparkles, Zap, Search, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
    { id: 'manager', label: 'Manager Ready', icon: FileText },
    { id: 'reflection', label: 'Reflect', icon: Sparkles },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-foreground">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                {APP_CONFIG.APP_NAME}
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center bg-gray-50 rounded-xl px-4 py-2 w-64 border border-gray-100">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input type="text" placeholder="Search entries..." className="bg-transparent border-none text-sm outline-none w-full placeholder:text-gray-400" />
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-gray-100 items-center justify-center text-gray-500 hover:text-blue-600 hover:shadow-md transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>
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
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100 my-1" />
                <DropdownMenuItem onClick={() => setShowProfile(true)} className="rounded-xl cursor-pointer px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 outline-none">
                  <User className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Profile</span>
                </DropdownMenuItem>
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
        <div className="flex flex-wrap gap-2 mb-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border",
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
                    <Plus className="w-8 h-8 text-white" />
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
