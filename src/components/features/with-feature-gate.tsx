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

export type WithFeatureGateProps = {
  allEnabledFeatures: {
    [feature: string]: boolean | undefined;
  };
};

const withFeatureGate = <Props = {},>(
  WrappedComponent: React.ComponentType<Props & WithFeatureGateProps>,
  feature: string,
  FallbackComponent: React.ComponentType<Props & WithFeatureGateProps> = NotFoundError,
) =>
  connect(
    mapStateToProps(feature),
    undefined,
    (stateProps, dispatchProps: unknown, ownProps: Props) => ({
      // merge props into separate properties such that stateProps don't override ownProps
      stateProps,
      ownProps,
    }),
  )(
    ({
      stateProps: { enabled, allEnabledFeatures },
      ownProps,
    }: {
      stateProps: StateProps;
      ownProps: Props;
    }) => {
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
    },
  );

export default withFeatureGate;
