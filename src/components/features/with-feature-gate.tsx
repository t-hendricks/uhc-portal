import React from 'react';
import { connect } from 'react-redux';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { PageSection } from '@patternfly/react-core';
import NotFoundError from '../App/NotFoundError';
import { GlobalState } from '../../redux/store';

const mapStateToProps = (feature: string) => (state: GlobalState) => ({
  enabled: state.features[feature],
  allEnabledFeatures: { ...state.features },
});

type StateProps = ReturnType<ReturnType<typeof mapStateToProps>>;

type ConnectedProps = {
  stateProps: StateProps;
  ownProps: any;
};

// merge props into separate properties such that stateProps don't override ownProps
const mergeProps = (
  stateProps: StateProps,
  dispatchProps: unknown,
  ownProps: any,
): ConnectedProps => ({
  stateProps,
  ownProps,
});

type WrappedProps = {
  allEnabledFeatures: {
    [feature: string]: boolean | undefined;
  };
};

const withFeatureGate = <Props = {},>(
  WrappedComponent: React.ComponentType<Props & WrappedProps>,
  feature: string,
  FallbackComponent: React.ComponentType<Props & WrappedProps> = NotFoundError,
): React.ComponentType<Omit<Props, keyof WrappedProps>> =>
  connect(
    mapStateToProps(feature),
    undefined,
    mergeProps,
  )(({ stateProps: { enabled, allEnabledFeatures }, ownProps }: ConnectedProps) => {
    if (enabled === undefined) {
      return (
        <PageSection>
          <Spinner centered />
        </PageSection>
      );
    }
    if (!enabled) {
      return <FallbackComponent {...ownProps} allEnabledFeatures={allEnabledFeatures} />;
    }
    return <WrappedComponent {...ownProps} allEnabledFeatures={allEnabledFeatures} />;
  });

export default withFeatureGate;
