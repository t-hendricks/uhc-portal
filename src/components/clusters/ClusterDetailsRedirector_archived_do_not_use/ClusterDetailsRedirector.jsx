import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useParams } from 'react-router-dom';

import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';

import { Navigate } from '~/common/routing';

import Unavailable from '../../common/Unavailable';

const ClusterDetailsRedirector = (props) => {
  const params = useParams();
  const location = useLocation();

  const {
    fetchSubscriptionIDForCluster,
    clearSubscriptionIDForCluster,
    subscriptionIDResponse,
    setGlobalError,
  } = props;

  React.useEffect(() => {
    fetchSubscriptionIDForCluster(params.id);

    return () => {
      clearSubscriptionIDForCluster();
    };
  }, [clearSubscriptionIDForCluster, fetchSubscriptionIDForCluster, params]);

  if (subscriptionIDResponse.error) {
    if (subscriptionIDResponse.errorCode === 404 || subscriptionIDResponse.errorCode === 403) {
      // Cluster not found / no permission to see it - redirect to cluster list with error on top
      setGlobalError(
        <>
          Cluster with ID <b>{params.id}</b> was not found, it might have been deleted or you
          don&apos;t have permission to see it.
        </>,
        'clusterDetails',
        subscriptionIDResponse.errorMessage,
      );
      return <Navigate replace to="/cluster-list" />;
    }
    // other errors = Unavailable
    return (
      <Unavailable message="Error retrieving cluster details" response={subscriptionIDResponse} />
    );
  }
  if (subscriptionIDResponse.fulfilled) {
    return <Navigate replace to={`/details/s/${subscriptionIDResponse.id}${location.hash}`} />;
  }

  return <Spinner centered />;
};

ClusterDetailsRedirector.propTypes = {
  fetchSubscriptionIDForCluster: PropTypes.func.isRequired,
  clearSubscriptionIDForCluster: PropTypes.func.isRequired,
  setGlobalError: PropTypes.func.isRequired,
  subscriptionIDResponse: PropTypes.shape({
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
    error: PropTypes.bool,
    errorCode: PropTypes.number,
    errorMessage: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
};

export default ClusterDetailsRedirector;
