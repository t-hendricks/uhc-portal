import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert, EmptyState,
} from 'patternfly-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, componentStack: null };
  }

  componentDidCatch(error, info) {
    this.setState({ error: error.toString(), componentStack: info.componentStack });
  }

  render() {
    const { error, componentStack } = this.state;
    if (error) {
      return (
        // Fallback UI
        <EmptyState>
          <Alert type="error">
            <h3>Something went wrong:</h3>
            <div style={{ 'white-space': 'pre-wrap', 'text-align': 'left', 'font-family': 'monospace' }}>
              {error}

              {componentStack}
            </div>
          </Alert>
        </EmptyState>
      );
    }

    const { children } = this.props;
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
