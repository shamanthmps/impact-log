import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login, signup, loginWithGoogle } = useAuth();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            toast({
                title: "Authentication Failed",
                description: "Check your credentials.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signup(email, password, displayName);
        } catch (error) {
            toast({
                title: "Signup Failed",
                description: "Could not create account.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            toast({ title: "Error", description: "Google login failed.", variant: "destructive" });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F8F9FB] p-4 font-sans">
            <div className="w-full max-w-[420px] bg-white rounded-[2rem] shadow-xl relative overflow-hidden p-8 md:p-10 border border-white">

                {/* Decorative Blue Blob */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-90 blur-xl" />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary rounded-full" />

                <div className="relative z-10">
                    <div className="mb-8">
                        <p className="text-gray-500 text-sm font-medium mb-1">Welcome to Impact Log</p>
                        <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Get Started</h1>
                    </div>

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1 mb-6">
                            <TabsTrigger value="login" className="rounded-lg font-semibold">Sign In</TabsTrigger>
                            <TabsTrigger value="signup" className="rounded-lg font-semibold">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-1.5 relative">
                                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-12 pl-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                                            placeholder="name@work.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 relative">
                                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-12 pl-12 pr-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-md font-bold shadow-lg shadow-blue-600/20 mt-2">
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup">
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="space-y-1.5 relative">
                                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                        <Input
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="h-12 pl-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 relative">
                                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-12 pl-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                                            placeholder="name@work.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 relative">
                                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-12 pl-12 pr-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                                            placeholder="Create password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-md font-bold shadow-lg shadow-blue-600/20 mt-2">
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-gray-400 font-bold tracking-widest">Or continue with</span></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="w-full h-12 flex items-center justify-center rounded-xl border-2 border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all bg-white gap-3 group"
                    >
                        <GoogleIcon />
                        <span className="font-semibold text-gray-700 group-hover:text-blue-700">Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
);
