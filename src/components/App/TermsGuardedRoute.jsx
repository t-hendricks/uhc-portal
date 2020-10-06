import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import TermsGuard from '../common/TermsGuard';

const TermsGuardedRoute = ({
  component: WrappedComponent,
  render: WarppedRender,
  history,
  gobackPath = '/',
  ...restProps
}) => {
  let render;
  if (WrappedComponent) {
    render = props => (
      <TermsGuard history={history} gobackPath={gobackPath}>
        <WrappedComponent {...props} />
      </TermsGuard>
    );
  }
  if (WarppedRender) {
    render = props => (
      <TermsGuard history={history} gobackPath={gobackPath}>
        {WarppedRender(props)}
      </TermsGuard>
    );
  }
  return <Route {...restProps} render={render} />;
};

TermsGuardedRoute.propTypes = {
  component: PropTypes.func,
  render: PropTypes.func,
  history: PropTypes.object.isRequired,
  gobackPath: PropTypes.string,
};

export default TermsGuardedRoute;
