import React from 'react';
import type { RouteProps, RouteComponentProps } from 'react-router-dom';
import { Route } from 'react-router-dom';
import TermsGuard from '../common/TermsGuard';

type Props = {
  history: RouteComponentProps['history'];
  gobackPath?: string;
  render?: (props: RouteComponentProps) => React.ReactElement;
} & Omit<RouteProps, 'render'>;

const TermsGuardedRoute = ({
  component: WrappedComponent,
  render: WarppedRender,
  history,
  gobackPath = '/',
  ...restProps
}: Props) => {
  let render;
  if (WrappedComponent) {
    render = (props: RouteComponentProps) => (
      <TermsGuard history={history} gobackPath={gobackPath}>
        <WrappedComponent {...props} />
      </TermsGuard>
    );
  }
  if (WarppedRender) {
    render = (props: RouteComponentProps) => (
      <TermsGuard history={history} gobackPath={gobackPath}>
        {WarppedRender(props)}
      </TermsGuard>
    );
  }
  return <Route {...restProps} render={render} />;
};

export default TermsGuardedRoute;
