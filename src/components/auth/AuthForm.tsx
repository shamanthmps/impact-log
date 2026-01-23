import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
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
                description: "Please check your credentials and try again.",
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
                description: "Could not create account. Please try again.",
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

                {/* Decorative Blue Blob (Top Right) */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-90 blur-xl" />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary rounded-full" />

                <div className="relative z-10">
                    <div className="mb-8">
                        <p className="text-gray-500 text-sm font-medium mb-1">Please enter your details</p>
                        <h1 className="text-4xl font-extrabold text-[#1A1A1A] tracking-tight">Welcome Back</h1>
                    </div>

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1 mb-6">
                            <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign In</TabsTrigger>
                            <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Email address</Label>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-14 rounded-xl border-gray-200 bg-white text-base focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5 relative">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-14 rounded-xl border-gray-200 bg-white text-base focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="remember" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <label htmlFor="remember" className="text-sm text-gray-500 font-medium">Remember me</label>
                                    </div>
                                    <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Forgot password?</button>
                                </div>

                                <Button type="submit" disabled={loading} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-bold shadow-lg shadow-blue-600/20 transition-all transform active:scale-[0.98]">
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup">
                            <form onSubmit={handleSignup} className="space-y-5">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Full Name</Label>
                                    <Input
                                        placeholder="John Doe"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="h-14 rounded-xl border-gray-200 bg-white text-base focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Email address</Label>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-14 rounded-xl border-gray-200 bg-white text-base focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5 relative">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Password</Label>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-14 rounded-xl border-gray-200 bg-white text-base focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all pr-12"
                                    />
                                </div>

                                <Button type="submit" disabled={loading} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-bold shadow-lg shadow-blue-600/20 transition-all transform active:scale-[0.98]">
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-medium tracking-wider">Or continue with</span></div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <SocialButton icon={<GoogleIcon />} onClick={handleGoogleLogin} />
                        <SocialButton icon={<FacebookIcon />} onClick={() => { }} />
                        <SocialButton icon={<AppleIcon />} onClick={() => { }} />
                    </div>

                    <div className="mt-8 text-center text-sm font-medium text-gray-500">
                        Don't have an account? <span className="text-blue-600 cursor-pointer hover:underline font-bold">Sign up</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SocialButton = ({ icon, onClick }: { icon: React.ReactNode, onClick: () => void }) => (
    <button
        onClick={onClick}
        type="button"
        className="h-14 flex items-center justify-center rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all bg-white"
    >
        {icon}
    </button>
);

const GoogleIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
);

const FacebookIcon = () => (
    <svg className="w-6 h-6 text-[#1877F2] fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
);

const AppleIcon = () => (
    <svg className="w-6 h-6 text-black fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.48 2.24-.82 3.67-.82 1.5.15 2.45.69 3.05 1.56-2.64 1.63-2.18 5.61.43 7.04-.54 1.7-1.39 3.19-2.23 4.39zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
);
