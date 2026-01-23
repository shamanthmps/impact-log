import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Briefcase, Award } from "lucide-react";

interface ProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProfileDialogContent() {
    const { currentUser } = useAuth();

    return (
        <div className="space-y-6">
            {/* Header / Avatar */}
            <div className="flex flex-col items-center justify-center -mt-4 mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white">
                    {currentUser?.displayName?.[0]?.toUpperCase() || <User className="w-10 h-10" />}
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">{currentUser?.displayName || 'User Profile'}</h2>
                <p className="text-gray-500">{currentUser?.email}</p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4 border border-gray-100">
                    <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role</p>
                        <p className="font-semibold text-gray-900">Engineering Lead</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4 border border-gray-100">
                    <div className="p-3 bg-white rounded-lg shadow-sm text-amber-500">
                        <Award className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                        <p className="font-semibold text-gray-900">Active Contributor</p>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2">
                    <div className="text-xl font-bold text-gray-900">12</div>
                    <div className="text-xs text-gray-500">Wins</div>
                </div>
                <div className="p-2 border-l border-r border-gray-100">
                    <div className="text-xl font-bold text-gray-900">4</div>
                    <div className="text-xs text-gray-500">Streaks</div>
                </div>
                <div className="p-2">
                    <div className="text-xl font-bold text-gray-900">Top</div>
                    <div className="text-xs text-gray-500"> performer</div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button variant="outline" className="w-full rounded-xl border-gray-200">
                    Edit Profile
                </Button>
            </div>
        </div>
    );
}
