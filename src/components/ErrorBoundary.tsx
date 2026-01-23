import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        logger.error(
            `Uncaught error: ${error.message}`,
            'ErrorBoundary',
            { error, componentStack: errorInfo.componentStack }
        );

        this.setState({ errorInfo });
        this.props.onError?.(error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleReload = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gradient-main flex items-center justify-center p-4">
                    <div className="glass-card p-8 max-w-md w-full text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="p-4 bg-destructive/10 rounded-full">
                                <AlertTriangle className="w-12 h-12 text-destructive" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-xl font-semibold text-foreground">
                                Something went wrong
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                We encountered an unexpected error. Don't worry, your data is safe.
                            </p>
                        </div>

                        {import.meta.env.DEV && this.state.error && (
                            <div className="text-left p-4 bg-muted/50 rounded-lg overflow-auto max-h-40">
                                <p className="text-xs font-mono text-destructive">
                                    {this.state.error.message}
                                </p>
                                {this.state.errorInfo?.componentStack && (
                                    <pre className="text-xs font-mono text-muted-foreground mt-2 whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack.slice(0, 500)}
                                    </pre>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="outline"
                                onClick={this.handleReset}
                                className="gap-2"
                            >
                                Try Again
                            </Button>
                            <Button
                                variant="primary"
                                onClick={this.handleReload}
                                className="gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reload Page
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
