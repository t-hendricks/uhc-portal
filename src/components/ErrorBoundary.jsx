import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert, EmptyState,
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
    const { error } = this.state;
    if (error) {
      return (
        // Fallback UI
        <EmptyState>
          <Alert type="error">
            Something went wrong:
            <pre>
              {error.componentStack}
            </pre>
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
