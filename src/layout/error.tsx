import * as React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
  info?: React.ErrorInfo;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ info });
    if (typeof window !== 'undefined') {
      console.error('ErrorBoundary caught error:', error, info);
    }
  }

  override render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      if (React.isValidElement(fallback)) {
        return React.cloneElement(fallback, {
          error: this.state.error,
        } as Partial<unknown>);
      }
      return fallback;
    }

    return this.props.children;
  }
}

interface BoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

export const Boundary = ({ fallback, children }: BoundaryProps) => {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
};
