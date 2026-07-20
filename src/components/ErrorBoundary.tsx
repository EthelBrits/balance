import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Bewust alleen naar console — er gaat niets naar een server.
    console.error('Er ging iets mis in de app:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="font-heading text-2xl font-semibold text-text">Er ging iets mis</h1>
          <p className="text-text-muted">
            Uw gegevens blijven bewaard op dit toestel. Probeer de pagina te herladen.
          </p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Pagina herladen
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
