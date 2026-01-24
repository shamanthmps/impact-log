import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, Bell, Shield, Database, Eye, Download, Archive, AlertTriangle, Loader2 } from 'lucide-react';
import { useWins } from '@/hooks/useWins';
import { toast } from 'sonner';
import { useProfile, UserProfile } from '@/hooks/useProfile';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const { wins, reflections } = useWins();
    const { profile, updateProfile, isLoading: isProfileLoading } = useProfile();

    // Local form state
    const [formData, setFormData] = useState<Partial<UserProfile>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile(formData);
            // toast success handled in hook
        } catch (error) {
            // error handled in hook
        } finally {
            setIsSaving(false);
        }
    };

    const handleExportData = () => {
        try {
            const dataToExport = {
                wins,
                reflections,
                profile,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `impact-log-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success("Data export started successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to export data.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] text-foreground flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 border-r border-gray-200 pt-6 md:min-h-screen bg-white">
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
                                    ? 'bg-blue-50 text-primary'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-black'
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
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Profile Settings</h1>
                        <p className="text-gray-500">Update your professional presence and personal career details.</p>
                    </div>

                    <div className="space-y-12">

                        {/* 01. Profile Info */}
                        <section className="space-y-6">
                            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-6">01. Profile Information</h3>

                            <div className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</Label>
                                    <Input
                                        value={formData.displayName || ''}
                                        onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                        className="bg-transparent border-0 border-b border-gray-200 rounded-none px-0 text-xl font-bold h-auto py-2 focus-visible:ring-0 focus-visible:border-primary transition-all placeholder:text-gray-300"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Professional Title</Label>
                                    <Input
                                        value={formData.role || ''}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="bg-transparent border-0 border-b border-gray-200 rounded-none px-0 text-xl font-bold h-auto py-2 focus-visible:ring-0 focus-visible:border-primary transition-all placeholder:text-gray-300"
                                        placeholder="e.g. Senior Product Manager"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Impact Statement (Bio)</Label>
                                    <Input
                                        value={formData.bio || ''}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        className="bg-transparent border-0 border-b border-gray-200 rounded-none px-0 text-lg text-gray-500 h-auto py-2 focus-visible:ring-0 focus-visible:border-primary transition-all placeholder:text-gray-300"
                                        placeholder="Your professional mission statement"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 02. Alerts */}
                        <section className="space-y-6">
                            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-6">02. Achievement Alerts</h3>

                            <div className="space-y-4">
                                <div className="bg-white p-6 flex items-center justify-between border border-gray-100 rounded-xl shadow-sm">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 uppercase">Real-Time Achievement Updates</h4>
                                        <p className="text-xs text-gray-500 mt-1">Notify me as soon as a milestone is reached</p>
                                    </div>
                                    <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                                </div>

                                <div className="bg-white p-6 flex items-center justify-between border border-gray-100 rounded-xl shadow-sm">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 uppercase">Weekly Impact Digest</h4>
                                        <p className="text-xs text-gray-500 mt-1">A summarized report of your career movement</p>
                                    </div>
                                    <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                                </div>
                            </div>
                        </section>

                        {/* 03. Account Data */}
                        <section className="space-y-6">
                            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-6">03. Account Data</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={handleExportData}
                                    className="bg-white border border-gray-100 p-6 flex items-center gap-4 hover:border-primary/50 hover:shadow-md transition-all group text-left rounded-xl shadow-sm"
                                >
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                                        <Download className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Export Career Data</h4>
                                        <p className="text-[10px] text-gray-500 mt-1 uppercase">Download all achievements as JSON</p>
                                    </div>
                                </button>

                                <button className="bg-white border border-gray-100 p-6 flex items-center gap-4 hover:border-primary/50 hover:shadow-md transition-all group text-left rounded-xl shadow-sm">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                                        <Archive className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Archive History</h4>
                                        <p className="text-[10px] text-gray-500 mt-1 uppercase">Move inactive records to storage</p>
                                    </div>
                                </button>
                            </div>

                            <div className="pt-4">
                                <button className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-600 flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors">
                                    <AlertTriangle className="w-3 h-3" />
                                    Delete Account Permanently
                                </button>
                            </div>
                        </section>

                        {/* Action Bar */}
                        <div className="pt-8">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full h-14 text-white hover:bg-primary/90 font-black uppercase tracking-widest text-lg rounded-xl shadow-lg shadow-primary/20"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : 'Save All Changes'}
                            </Button>
                            <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest mt-4">
                                Last synced: {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleTimeString() : 'Never'}
                            </p>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
