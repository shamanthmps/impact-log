
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, UserProfile } from "@/hooks/useProfile";
import { User, Briefcase, Award, Loader2, Edit2, Save, X } from "lucide-react";
import { useWinsContext } from "@/contexts/WinsContext";

export function ProfileDialogContent() {
    const { currentUser } = useAuth();
    const { profile, isLoading, updateProfile } = useProfile();
    const { wins } = useWinsContext();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<UserProfile>>({});
    const [isSaving, setIsSaving] = useState(false);

    // Sync form data when profile loads or editing starts
    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile(formData);
            setIsEditing(false);
        } catch (error) {
            // error handled in hook
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header / Avatar */}
            <div className="flex flex-col items-center justify-center -mt-4 mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white overflow-hidden">
                    {currentUser?.displayName?.[0]?.toUpperCase() || <User className="w-10 h-10" />}
                </div>

                {isEditing ? (
                    <div className="mt-4 w-full text-center space-y-2">
                        <Input
                            value={formData.displayName || ''}
                            onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                            className="text-center font-bold text-lg"
                            placeholder="Full Name"
                        />
                    </div>
                ) : (
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 text-center">
                        {profile?.displayName || currentUser?.displayName || 'User Profile'}
                    </h2>
                )}

                <p className="text-gray-500 text-sm">{currentUser?.email}</p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4 border border-gray-100">
                    <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role</p>
                        {isEditing ? (
                            <Input
                                value={formData.role || ''}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                className="h-8 mt-1 bg-white"
                                placeholder="e.g. Engineering Lead"
                            />
                        ) : (
                            <p className="font-semibold text-gray-900">{profile?.role || 'Professional'}</p>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4 border border-gray-100">
                    <div className="p-3 bg-white rounded-lg shadow-sm text-amber-500">
                        <Award className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                        {isEditing ? (
                            <Input
                                value={formData.status || ''}
                                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                className="h-8 mt-1 bg-white"
                                placeholder="Status"
                            />
                        ) : (
                            <p className="font-semibold text-gray-900">{profile?.status || 'Active'}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Summary (Calculated from Wins) */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2">
                    <div className="text-xl font-bold text-gray-900">{wins.length}</div>
                    <div className="text-xs text-gray-500">Total Wins</div>
                </div>
                <div className="p-2 border-l border-r border-gray-100">
                    <div className="text-xl font-bold text-gray-900">
                        {new Set(wins.map(w => w.category)).size}
                    </div>
                    <div className="text-xs text-gray-500">Categories</div>
                </div>
                <div className="p-2">
                    <div className="text-xl font-bold text-gray-900">Top</div>
                    <div className="text-xs text-gray-500">Performer</div>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                {isEditing ? (
                    <>
                        <Button
                            variant="outline"
                            className="flex-1 rounded-xl border-gray-200"
                            onClick={() => setIsEditing(false)}
                            disabled={isSaving}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="outline"
                        className="w-full rounded-xl border-gray-200 hover:bg-gray-50 hover:text-blue-600"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                )}
            </div>
        </div>
    );
}
