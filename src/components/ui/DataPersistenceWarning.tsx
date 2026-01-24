import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { useWinsContext } from '@/contexts/WinsContext';
import { cn } from '@/lib/utils';

export const SHOW_WARNING_EVENT = 'show-guest-warning';

export function DataPersistenceWarning() {
    const { isGuest } = useWinsContext();
    const [isVisible, setIsVisible] = useState(false);

    // Function to show warning for 10 seconds
    const showWarning = useCallback(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    // Initial show on mount
    useEffect(() => {
        if (isGuest) {
            const cleanup = showWarning();
            return cleanup;
        }
    }, [isGuest, showWarning]);

    // Listen for custom event triggers
    useEffect(() => {
        if (!isGuest) return;

        const handleTrigger = () => {
            showWarning();
        };

        window.addEventListener(SHOW_WARNING_EVENT, handleTrigger);
        return () => window.removeEventListener(SHOW_WARNING_EVENT, handleTrigger);
    }, [isGuest, showWarning]);

    // Dismiss on any click anywhere in the document
    useEffect(() => {
        if (!isVisible) return;

        const handleDismiss = () => setIsVisible(false);

        // Slight delay to ensure we don't catch the triggering click event
        const timer = setTimeout(() => {
            document.addEventListener('click', handleDismiss);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('click', handleDismiss);
        };
    }, [isVisible]);

    if (!isGuest || !isVisible) return null;

    return (
        <div className={cn(
            "fixed z-50 animate-in fade-in slide-in-from-bottom-5 duration-300",
            "bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm", // Mobile: Bottom center
            "sm:left-auto sm:right-6 sm:translate-x-0" // Desktop: Bottom right
        )}>
            <div
                // Prevent click inside the card from dismissing it immediately (optional, but usually good UX)
                // But the user said "clicks anywhere on the app", so I will NOT stop propagation.
                // Actually, stopping propagation is safer so they can click the link.
                onClick={(e) => e.stopPropagation()}
                className="glass-card bg-white/95 backdrop-blur-xl border-l-4 border-l-red-500 border-red-200/50 shadow-2xl p-5 rounded-r-xl rounded-l-sm border-t border-r border-b"
            >
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-50 rounded-lg shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide leading-none mb-2">
                                WARNING
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-1 list-disc list-outside ml-4">
                                <li>Data is saved <strong className="text-gray-800">only in this browser</strong>.</li>
                                <li>It is <strong className="text-gray-800">not synced across devices</strong>.</li>
                                <li>Export your data regularly to avoid loss.</li>
                            </ul>
                        </div>

                        <a
                            href="https://github.com/shamanthmps/impact-log/blob/main/README.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:underline transition-colors mt-1"
                        >
                            Want your data saved long-term? Learn how
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
