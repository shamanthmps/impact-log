import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Share2, Edit2, Briefcase, Layout, DollarSign, Globe, type LucideIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { Win } from '@/types/win';

export default function AchievementDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [win, setWin] = useState<Win | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWin() {
            if (!id) return;
            try {
                const docRef = doc(db, 'wins', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    // Need to handle Date conversion safely
                    const data = docSnap.data();
                    const winData = {
                        id: docSnap.id,
                        ...data,
                        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
                        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
                    } as Win;
                    setWin(winData);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchWin();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading...</div>;
    if (!win) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Achievement not found.</div>;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-foreground font-sans pb-24">
            {/* Top Nav */}
            <div className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur border-b border-[#222]">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-3 border-l border-[#333] pl-6 h-8">
                            <div className="w-5 h-5 bg-primary flex items-center justify-center rotate-45">
                                <div className="w-2 h-2 bg-black" />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Achievement Detail</span>
                        </div>
                    </div>

                    <div className="bg-primary text-black px-4 py-2 text-xs font-black uppercase tracking-widest rounded-sm">
                        Magnitude: {win.impactLevel || 'High Impact'}
                    </div>
                </div>
            </div>

            <main className="container max-w-5xl mx-auto px-6 py-12 space-y-16">

                {/* Header Section */}
                <section className="space-y-6">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
                        {win.situation}
                    </h1>
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <span>{win.date ? format(win.date instanceof Date ? win.date : new Date(win.date), 'MMMM yyyy') : 'Date Unknown'}</span>
                        <span className="text-primary">•</span>
                        <span>{win.category.toUpperCase()}</span>
                        <span className="text-primary">•</span>
                        <span>{win.impactType.replace('-', ' ').toUpperCase()}</span>
                    </div>
                </section>

                {/* Core Impact Cards */}
                <section className="space-y-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Core Impact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#111] border border-[#222] p-8 rounded-sm">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Primary Metric</p>
                            <div className="text-4xl font-bold text-white mb-1">{win.impact || "N/A"}</div>
                            <div className="text-xs text-red-500 font-bold">Key Result</div>
                        </div>
                        <div className="bg-[#111] border border-[#222] p-8 rounded-sm">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Scope Scale</p>
                            <div className="text-4xl font-bold text-white mb-1">{win.impactType}</div>
                            <div className="text-xs text-primary font-bold">+12% YoY Growth</div>
                        </div>
                        <div className="bg-[#111] border border-[#222] p-8 rounded-sm">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Efficiency</p>
                            <div className="text-4xl font-bold text-white mb-1">{win.impactLevel}</div>
                            <div className="text-xs text-red-500 font-bold">-5% Latency</div>
                        </div>
                    </div>
                </section>

                {/* Context & Strategy */}
                <section className="space-y-8 border-t border-[#222] pt-12">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Context & Strategy</h3>

                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-16">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest pt-2">The Situation</div>
                        <div className="text-lg text-white leading-relaxed text-opacity-90">
                            {win.situation}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-16">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest pt-2">The Action</div>
                        <div className="text-lg text-white leading-relaxed text-opacity-90">
                            {win.action || "Orchestrated a cross-functional team of 40 engineers..."}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-16">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest pt-2">The Result</div>
                        <div className="text-lg text-white leading-relaxed text-opacity-90">
                            {win.impact}
                        </div>
                    </div>
                </section>

                {/* Stakeholders */}
                <section className="space-y-6 pt-8">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Stakeholders</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <StakeholderCard icon={Briefcase} role="C-Suite Executive" />
                        <StakeholderCard icon={Layout} role="Platform Engineering" />
                        <StakeholderCard icon={DollarSign} role="Finance Ops" />
                        <StakeholderCard icon={Globe} role="Regional Leads" />
                    </div>
                </section>

            </main>

            {/* Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#222] py-4 px-6">
                <div className="container mx-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <div>Confidential Impact Report © 2024</div>
                    <div className="flex items-center gap-6 text-white">
                        <button className="flex items-center gap-2 hover:text-primary transition-colors">
                            <Edit2 className="w-3 h-3" /> Edit Entry
                        </button>
                        <button className="flex items-center gap-2 hover:text-primary transition-colors">
                            <Share2 className="w-3 h-3" /> Export PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StakeholderCard = ({ icon: Icon, role }: { icon: LucideIcon, role: string }) => (
    <div className="bg-[#111] border border-[#222] p-4 flex items-center gap-3 rounded-sm hover:border-[#333] transition-colors">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">{role}</span>
    </div>
);
