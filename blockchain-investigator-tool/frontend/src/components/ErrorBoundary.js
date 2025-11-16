import React from "react";
import "../styles/ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message || "Unexpected error" };
  }

  componentDidUpdate(prevProps) {
    if (this.props.error && this.props.error !== prevProps.error) {
      this.setState({
        hasError: true,
        message: this.props.error,
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: "" });
    this.props.onClearError?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-overlay">
          <div className="error-modal">
            <h2>Error</h2>
            <p>{this.state.message}</p>
            <button onClick={this.handleRetry}>Retry</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
