import React, { ErrorInfo } from 'react';

export interface ErrorBoundaryProps {
   children: React.ReactNode;
   renderError?: (props: { error: Error }) => React.ReactNode;
   onError?: (error: Error, info: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
   error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
   constructor(props: ErrorBoundaryProps) {
      super(props);

      this.state = { error: undefined };
   }

   static getDerivedStateFromError(error: Error) {
      return { error };
   }

   public componentDidCatch(error: Error, info: ErrorInfo) {
      if (this.props.onError) {
         this.props.onError(error, info);
      }
   }

   public render() {
      if (this.state.error) {
         return this.props.renderError ? this.props.renderError({ error: this.state.error }) : null;
      }

      return this.props.children;
   }
}

export default ErrorBoundary;
