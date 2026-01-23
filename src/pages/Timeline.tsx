import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Bell, User } from 'lucide-react';
import { format } from 'date-fns';

export default function Timeline() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [wins, setWins] = useState<any[]>([]);
    const [filter, setFilter] = useState('ALL IMPACT');

    useEffect(() => {
        async function fetchWins() {
            if (!currentUser) return;
            const q = query(collection(db, 'wins'), orderBy('date', 'desc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWins(data);
        }
        fetchWins();
    }, [currentUser]);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-foreground font-sans">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur border-b border-[#222]">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer" onClick={() => navigate('/')}>
                            <span className="text-black text-lg font-black">✓</span>
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-tight cursor-pointer" onClick={() => navigate('/')}>Personal Impact Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-muted-foreground hover:text-white">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="w-8 h-8 bg-[#222] rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="container mx-auto px-6 pb-6 pt-2">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Filter by Magnitude</div>
                    <div className="flex gap-2">
                        {['ALL IMPACT', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2 text-xs font-bold uppercase tracking-wider border transition-all
                            ${filter === f
                                        ? 'bg-primary border-primary text-black'
                                        : 'bg-[#111] border-[#222] text-muted-foreground hover:border-[#444] hover:text-white'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Timeline Content */}
            <main className="container mx-auto px-6 py-12 relative min-h-[800px]">
                {/* Vertical Line */}
                <div className="absolute left-[24px] md:left-1/2 top-12 bottom-12 w-px bg-[#333] transform md:-translate-x-1/2" />

                <div className="space-y-24 relative">
                    {wins.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground">No timeline events found. Start logging.</p>
                        </div>
                    )}

                    {wins.map((win, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div key={win.id} className={`flex flex-col md:flex-row items-center w-full group ${isEven ? '' : 'md:flex-row-reverse'}`}>
                                {/* Left Side */}
                                <div className="w-full md:w-1/2 flex md:justify-end px-8 md:px-12 mb-4 md:mb-0">
                                    {isEven ? (
                                        <div className="text-right">
                                            <h3 className="text-primary font-black text-lg uppercase tracking-widest">{format(new Date(win.date), 'MMMM')}</h3>
                                            <h4 className="text-primary font-bold text-xl">{format(new Date(win.date), 'yyyy')}</h4>
                                        </div>
                                    ) : (
                                        <TimelineCard win={win} onClick={() => navigate(`/achievement/${win.id}`)} />
                                    )}
                                </div>

                                {/* Center Dot */}
                                <div className="relative z-10 flex items-center justify-center shrink-0 w-12 h-12">
                                    <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)] border-4 border-[#0A0A0A]" />
                                </div>

                                {/* Right Side */}
                                <div className="w-full md:w-1/2 flex md:justify-start px-8 md:px-12">
                                    {isEven ? (
                                        <TimelineCard win={win} onClick={() => navigate(`/achievement/${win.id}`)} />
                                    ) : (
                                        <div className="text-left">
                                            <h3 className="text-primary font-black text-lg uppercase tracking-widest">{format(new Date(win.date), 'MMMM')}</h3>
                                            <h4 className="text-primary font-bold text-xl">{format(new Date(win.date), 'yyyy')}</h4>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Floating Action Button */}
            <div className="fixed bottom-12 right-12 z-50">
                <Button
                    onClick={() => navigate('/log-achievement')}
                    className="h-14 px-8 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-2"
                >
                    <Plus className="w-5 h-5 stroke-[3]" />
                    Add Achievement
                </Button>
            </div>
        </div>
    );
}

const TimelineCard = ({ win, onClick }: { win: any, onClick: () => void }) => (
    <div onClick={onClick} className="bg-[#151515] border border-[#2A2A2A] p-6 lg:p-8 rounded-lg w-full max-w-xl hover:border-primary/50 transition-colors group cursor-pointer">
        <div className="mb-4">
            {win.magnitude && (
                <span className="bg-[#222] text-[10px] font-bold text-white px-2 py-1 uppercase tracking-widest border border-[#333] mb-3 inline-block">
                    {win.magnitude} Impact
                </span>
            )}
            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{win.title}</h3>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
            {win.description}
        </p>

        {win.metric && (
            <div className="pt-4 border-t border-[#222]">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Impact Metric</p>
                <p className="text-lg font-bold text-primary">{win.metric}</p>
            </div>
        )}
    </div>
);
