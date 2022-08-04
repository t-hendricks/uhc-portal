import React from 'react';
import PropTypes from 'prop-types';
import { Alert, EmptyState } from '@patternfly/react-core';
import * as Sentry from '@sentry/browser';

class ErrorBoundary extends React.Component {
  state = { error: null, componentStack: null }

  componentDidCatch(error, info) {
    this.setState({ error: error.toString(), componentStack: info.componentStack });
    Sentry.withScope((scope) => {
      scope.setExtras(info);
      Sentry.captureException(error);
    });
  }

  render() {
    const { error, componentStack } = this.state;
    if (error) {
      return (
        // Fallback UI
        <EmptyState>
          <Alert variant="danger" isInline title="Something went wrong">
            <div style={{ whiteSpace: 'pre-wrap', textAlign: 'left', fontFamily: 'monospace' }}>
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
