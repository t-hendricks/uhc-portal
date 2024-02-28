import React from 'react';
import type { RouteProps, RouteComponentProps } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import TermsGuard from '../common/TermsGuard';

type Props = {
  gobackPath?: string;
  render?: (props: RouteComponentProps) => React.ReactElement;
} & Omit<RouteProps, 'render'>;

const TermsGuardedRoute = ({
  component: WrappedComponent,
  render: WrappedRender,
  gobackPath = '/',
  ...restProps
}: Props) => {
  let render;
  if (WrappedComponent) {
    render = (props: RouteComponentProps) => (
      <TermsGuard gobackPath={gobackPath}>
        <WrappedComponent {...props} />
      </TermsGuard>
    );
  }
  if (WrappedRender) {
    render = (props: RouteComponentProps) => (
      <TermsGuard gobackPath={gobackPath}>{WrappedRender(props)}</TermsGuard>
    );
  }
  return <CompatRoute {...restProps} render={render} />;
};

export default TermsGuardedRoute;
