import React from 'react';
import PropTypes from 'prop-types';
import { matchPath, Redirect } from 'react-router';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye/Bullseye';
import { validate as isUuid } from 'uuid';
import ExternalRedirect from './ExternalRedirect';

// expects the pluginName and errorKey to construct the ruleId recognized by OCP Advisor
export const composeRuleId = (pluginName, errorKey) =>
  encodeURIComponent(
    `${decodeURIComponent(pluginName).replace(/\|/g, '.').split('.report')[0]}|${decodeURIComponent(
      errorKey,
    )}`,
  );

class InsightsAdvisorRedirector extends React.Component {
  componentDidMount() {
    const { match, clusterDetails, fetchClusterDetails } = this.props;
    if (!clusterDetails.fulfilled && match.params.id && !isUuid(match.params.id)) {
      fetchClusterDetails(match.params.id);
    }
  }

  render() {
    const { clusterDetails, match, location, setGlobalError } = this.props;
    const externalId =
      match.params?.id && isUuid(match.params.id)
        ? match.params.id
        : clusterDetails?.cluster?.external_id;
    const path = location.pathname;

    if (externalId) {
      if (
        matchPath(path, {
          path: '/details/:clusterId',
          exact: true,
        }) ||
        matchPath(path, {
          path: '/details/s/:id',
          exact: true,
        })
      ) {
        return (
          <ExternalRedirect
            url={`${window.location.origin}/${
              APP_BETA ? 'beta/' : ''
            }openshift/insights/advisor/clusters/${externalId}`}
          />
        );
      }
      if (
        matchPath(path, {
          path: '/details/:id/insights/:reportId/:errorKey',
          exact: true,
        }) ||
        matchPath(path, {
          path: '/details/s/:id/insights/:reportId/:errorKey',
          exact: true,
          strict: true,
        })
      ) {
        const { reportId, errorKey } = match.params;
        const ruleId = composeRuleId(reportId, errorKey);
        return (
          <ExternalRedirect
            url={`${window.location.origin}/${
              APP_BETA ? 'beta/' : ''
            }openshift/insights/advisor/clusters/${externalId}?first=${ruleId}`}
          />
        );
      }
    }

    if (clusterDetails.error) {
      // Cluster not found or no permission to see it - redirect to cluster list with error on top
      setGlobalError(
        <>
          Cluster with the subscription ID <b>{match.params?.id}</b> was not found, it might have
          been deleted or you don&apos;t have permission to see it.
        </>,
        'clusterDetails',
        clusterDetails?.errorMessage,
      );
      return <Redirect to="/" />;
    }

    if (clusterDetails.fulfilled && !externalId) {
      // Could not find external id for the given cluster
      setGlobalError(
        <>
          There is no external ID for the cluster with the <b>{match.params?.id}</b> subscription
          ID.
        </>,
        'clusterDetails',
        clusterDetails?.errorMessage,
      );
      return <Redirect to="/" />;
    }

    return (
      <Bullseye>
        <Spinner size="lg" centered />
      </Bullseye>
    );
  }
}

InsightsAdvisorRedirector.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      reportId: PropTypes.string,
      errorKey: PropTypes.string,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  fetchClusterDetails: PropTypes.func.isRequired,
  clusterDetails: PropTypes.shape({
    cluster: PropTypes.object,
    error: PropTypes.bool,
    errorCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
    fulfilled: PropTypes.bool,
    history: PropTypes.object,
  }),
  setGlobalError: PropTypes.func.isRequired,
};

export default InsightsAdvisorRedirector;
