import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import Unavailable from '../../common/Unavailable';

class ClusterDetailsRedirector extends React.Component {
  componentDidMount() {
    const { match, fetchSubscriptionIDForCluster } = this.props;
    fetchSubscriptionIDForCluster(match.params.id);
  }

  componentWillUnmount() {
    const { clearSubscriptionIDForCluster } = this.props;
    clearSubscriptionIDForCluster();
  }

  render() {
    const {
      subscriptionIDResponse,
      setGlobalError,
      match,
      location,
      isInsightsRuleDetails,
    } = this.props;

    if (subscriptionIDResponse.error) {
      if (subscriptionIDResponse.errorCode === 404 || subscriptionIDResponse.errorCode === 403) {
        // Cluster not found / no permission to see it - redirect to cluster list with error on top
        setGlobalError((
          <>
            Cluster with ID
            {' '}
            <b>{match.params.id}</b>
            {' '}
            was not found, it might have been deleted or you don&apos;t have permission to see it.
          </>
        ), 'clusterDetails', subscriptionIDResponse.errorMessage);
        return (<Redirect to="/" />);
      }
      // other errors = Unavailable
      return (<Unavailable message="Error retrieving cluster details" response={subscriptionIDResponse} />);
    }
    if (subscriptionIDResponse.fulfilled) {
      if (isInsightsRuleDetails) {
        const { reportId, errorKey } = match.params;
        return <Redirect to={`/details/s/${subscriptionIDResponse.id}/insights/${reportId}/${errorKey}${location.hash}`} />;
      }

      return <Redirect to={`/details/s/${subscriptionIDResponse.id}${location.hash}`} />;
    }

    return (<Spinner centered />);
  }
}

ClusterDetailsRedirector.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      reportId: PropTypes.string, // insights only
      errorKey: PropTypes.string, // insights only
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    hash: PropTypes.string.isRequired,
  }).isRequired,
  fetchSubscriptionIDForCluster: PropTypes.func.isRequired,
  clearSubscriptionIDForCluster: PropTypes.func.isRequired,
  setGlobalError: PropTypes.func.isRequired,
  isInsightsRuleDetails: PropTypes.bool,
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
