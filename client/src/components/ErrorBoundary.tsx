import { ArrowLeft, RotateCcw, AlertTriangle } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (import.meta.env.DEV) console.error("[NIGHT MARKET] render error", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="nm-error-screen" role="alert">
          <div className="nm-error-orbit" aria-hidden="true"><span /></div>
          <p className="nm-eyebrow"><AlertTriangle size={14} /> NIGHT MARKET / AFTER DARK</p>
          <h1>Something went<br /><i>off-script.</i></h1>
          <p>Эта страница временно недоступна. Вернитесь в каталог или попробуйте открыть её ещё раз.</p>
          <div className="nm-error-actions">
            <a className="nm-cta" href="/">Вернуться в каталог <ArrowLeft size={17} /></a>
            <button className="nm-underlink" onClick={() => window.location.reload()}><RotateCcw size={15} /> Обновить страницу</button>
          </div>
          <a className="nm-error-contact" href="https://t.me/eloquncy" target="_blank" rel="noreferrer">Если нужна помощь — @eloquncy</a>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

