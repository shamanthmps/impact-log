import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, Bell, Shield, Database, Eye, Download, Archive, AlertTriangle } from 'lucide-react';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 border-r border-[#333] pt-6 md:min-h-screen bg-[#0A0A0A]">
                <div className="px-6 mb-8">
                    <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">User Settings</h2>
                </div>
                <nav className="space-y-1">
                    {[
                        { id: 'profile', label: 'Profile', icon: User },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'security', label: 'Security', icon: Shield },
                        { id: 'data', label: 'Account Data', icon: Database },
                        { id: 'privacy', label: 'Privacy', icon: Eye },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors relative
                ${activeTab === item.id
                                    ? 'bg-[#1A1A1A] text-white'
                                    : 'text-muted-foreground hover:bg-[#111] hover:text-white'
                                }`}
                        >
                            {activeTab === item.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                            )}
                            <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-primary' : ''}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <div className="max-w-3xl">
                    <div className="mb-12">
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Profile Settings</h1>
                        <p className="text-muted-foreground">Update your professional presence and personal career details.</p>
                    </div>

                    <div className="space-y-12">

                        {/* 01. Profile Info */}
                        <section className="space-y-6">
                            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-6">01. Profile Information</h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Full Name</Label>
                                    <Input
                                        defaultValue="Alexander Sterling"
                                        className="bg-transparent border-0 border-b border-[#333] rounded-none px-0 text-2xl font-bold h-auto py-2 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Professional Title</Label>
                                    <Input
                                        defaultValue="Chief Impact Officer"
                                        className="bg-transparent border-0 border-b border-[#333] rounded-none px-0 text-2xl font-bold h-auto py-2 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Impact Statement</Label>
                                    <Input
                                        defaultValue="Driving sustainable growth through data-driven architectural innovation."
                                        className="bg-transparent border-0 border-b border-[#333] rounded-none px-0 text-xl text-muted-foreground h-auto py-2 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 02. Alerts */}
                        <section className="space-y-6">
                            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-6">02. Achievement Alerts</h3>

                            <div className="space-y-4">
                                <div className="bg-[#111] p-6 flex items-center justify-between border border-[#222]">
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase">Real-Time Achievement Updates</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Notify me as soon as a milestone is reached</p>
                                    </div>
                                    <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                                </div>

                                <div className="bg-[#111] p-6 flex items-center justify-between border border-[#222]">
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase">Weekly Impact Digest</h4>
                                        <p className="text-xs text-muted-foreground mt-1">A summarized report of your career movement</p>
                                    </div>
                                    <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                                </div>

                                <div className="bg-[#111] p-6 flex items-center justify-between border border-[#222]">
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase">Network Connection Alerts</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Alert me when industry leaders interact with my profile</p>
                                    </div>
                                    <Switch disabled />
                                </div>
                            </div>
                        </section>

                        {/* 03. Account Data */}
                        <section className="space-y-6">
                            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-6">03. Account Data</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button className="bg-[#111] border border-[#222] p-6 flex items-center gap-4 hover:bg-[#1A1A1A] transition-colors group text-left">
                                    <div className="w-10 h-10 bg-[#222] rounded flex items-center justify-center group-hover:bg-[#333]">
                                        <Download className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Export Career Data</h4>
                                        <p className="text-[10px] text-muted-foreground mt-1 uppercase">Download all achievements as JSON/PDF</p>
                                    </div>
                                </button>

                                <button className="bg-[#111] border border-[#222] p-6 flex items-center gap-4 hover:bg-[#1A1A1A] transition-colors group text-left">
                                    <div className="w-10 h-10 bg-[#222] rounded flex items-center justify-center group-hover:bg-[#333]">
                                        <Archive className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Archive History</h4>
                                        <p className="text-[10px] text-muted-foreground mt-1 uppercase">Move inactive records to storage</p>
                                    </div>
                                </button>
                            </div>

                            <div className="pt-4">
                                <button className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-400 flex items-center gap-2">
                                    <AlertTriangle className="w-3 h-3" />
                                    Delete Account Permanently
                                </button>
                            </div>
                        </section>

                        {/* Action Bar */}
                        <div className="pt-8">
                            <Button className="w-full h-14 bg-primary text-black hover:bg-primary/90 font-black uppercase tracking-widest text-lg rounded-sm">
                                Save All Changes
                            </Button>
                            <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest mt-4">
                                Last synced: 2 minutes ago
                            </p>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
