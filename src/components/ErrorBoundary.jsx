import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert, EmptyState
} from 'patternfly-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, info) {
    this.setState({ error: info });
  }

  render() {
    if (this.state.error) {
      return (
        // Fallback UI
        <EmptyState>
          <Alert type="error">
            Something went wrong:
            <pre>
              {this.state.error.componentStack}
            </pre>
          </Alert>
        </EmptyState>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
