import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "40px 24px",
            textAlign: "center",
            fontFamily: "var(--font-body)",
            color: "var(--muted)",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠</div>
          <p
            style={{ fontSize: 16, marginBottom: 8, color: "var(--charcoal)" }}
          >
            Something went wrong
          </p>
          <p style={{ fontSize: 13, marginBottom: 20 }}>
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: "8px 20px",
              background: "var(--forest)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
