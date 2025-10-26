import * as React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false };

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: React.ErrorInfo) {
    // log
  }

  render() {
    if (this.state.hasError) {
      console.error(this.state);
      return this.props.fallback;
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
