import React from 'react';
import { connect } from 'react-redux';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { PageSection } from '@patternfly/react-core';
import NotFoundError from '../App/NotFoundError';
import { store } from '../../redux/store';

const mapStateToProps = feature => state => ({
  enabled: state.features[feature],
  allEnabledFeatures: { ...state.features },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export const withFeatureGateCallback = (callback, feature, fallback = () => false) => {
  if (mapStateToProps(feature)(store.getState()).enabled) {
    return callback;
  }
  return fallback;
};

const withFeatureGate = (
  WrappedComponent, feature, FallbackComponent = NotFoundError,
) => connect(
  mapStateToProps(feature),
  undefined,
  mergeProps,
)(({ enabled, location, ...componentProps }) => {
  if (enabled === undefined) {
    return (
      <PageSection>
        <Spinner centered />
      </PageSection>
    );
  }
  if (!enabled) {
    return <FallbackComponent location={location} {...componentProps} />;
  }
  return <WrappedComponent {...componentProps} />;
});

export default withFeatureGate;
