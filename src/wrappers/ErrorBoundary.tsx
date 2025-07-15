import React, { type ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by ErrorBoundary:', error);
        console.error('Error information:', errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <p>{this.state.error?.message}</p>
                    <pre>{JSON.stringify(this.state.errorInfo, null, 2)}</pre>
                    {this.props.fallback}
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
