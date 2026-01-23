import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

type Magnitude = 'LOW' | 'MID' | 'HIGH' | 'CRITICAL';

export default function LogAchievement() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [metric, setMetric] = useState('');
    const [magnitude, setMagnitude] = useState<Magnitude>('HIGH');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        setLoading(true);
        try {
            await addDoc(collection(db, 'wins'), {
                userId: currentUser.uid,
                title,
                date: date?.toISOString(),
                metric,
                magnitude,
                description,
                createdAt: new Date().toISOString(),
                status: 'verified' // Default to verified for now as per mockup style
            });

            toast({
                title: "Achievement Recorded",
                description: "Your win has been successfully logged to the database.",
            });

            navigate('/'); // Go back to dashboard
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to save achievement. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        {/* Yellow Brand Icon Placeholder */}
                        <div className="h-8 w-8 bg-primary rounded-sm flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black transform rotate-45">
                                <rect x="2" y="10" width="20" height="4" fill="currentColor" />
                                <rect x="10" y="2" width="4" height="20" fill="currentColor" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight">IMPACT.DB</span>
                    </div>

                    <div className="pt-8">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase">
                            Log Application
                        </h1>
                        <p className="text-muted-foreground text-lg mt-2">
                            Quantify your success and archive key career milestones.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">

                    {/* Title Input */}
                    <div className="space-y-3">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Achievement Title
                        </Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Optimized Core Database Engine"
                            className="bg-transparent border-0 border-b border-border rounded-none px-0 text-2xl md:text-3xl font-bold placeholder:text-muted/20 focus-visible:ring-0 focus-visible:border-primary h-auto py-2 transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Date Picker */}
                        <div className="space-y-3 flex flex-col">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                Date of Achievement
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal bg-transparent border-0 border-b border-border rounded-none px-0 h-12 text-lg hover:bg-transparent hover:text-foreground",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                        {date ? format(date, "MM/dd/yyyy") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 border-border bg-card" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        className="bg-card text-card-foreground"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Metric Input */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                Primary Metric (KPI)
                            </Label>
                            <Input
                                value={metric}
                                onChange={(e) => setMetric(e.target.value)}
                                placeholder="+45% Query Efficiency"
                                className="bg-transparent border-0 border-b border-border rounded-none px-0 text-lg md:text-xl placeholder:text-muted/20 focus-visible:ring-0 focus-visible:border-primary h-12 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Magnitude Selector */}
                    <div className="space-y-3">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Impact Magnitude
                        </Label>
                        <div className="grid grid-cols-4 gap-0 border border-border rounded-sm overflow-hidden">
                            {(['LOW', 'MID', 'HIGH', 'CRITICAL'] as Magnitude[]).map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setMagnitude(level)}
                                    className={cn(
                                        "h-12 text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center hover:bg-muted",
                                        magnitude === level
                                            ? "bg-primary text-black"
                                            : "bg-card text-muted-foreground"
                                    )}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description Textarea */}
                    <div className="space-y-3">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Description (STAR Method)
                        </Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Situation: describe the challenge...&#10;Task: what needed to be done?&#10;Action: what did YOU do?&#10;Result: quantifiable impact..."
                            className="min-h-[200px] bg-transparent border-0 border-b border-border rounded-none px-0 text-lg placeholder:text-muted/20 focus-visible:ring-0 focus-visible:border-primary resize-none leading-relaxed"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-primary text-black hover:bg-primary/90 rounded-sm text-lg font-black tracking-widest uppercase flex items-center justify-between px-8 group mt-8"
                    >
                        <span>Record Achievement</span>
                        <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                    </Button>

                </form>
            </div>
        </div>
    );
}
