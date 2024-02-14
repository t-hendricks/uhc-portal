import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, matchPath } from 'react-router-dom-v5-compat';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { Bullseye } from '@patternfly/react-core';
import { validate as isUuid } from 'uuid';
import { advisorBaseName } from '~/common/getBaseName';
import ExternalRedirect from './ExternalRedirect';

// expects the pluginName and errorKey to construct the ruleId recognized by OCP Advisor
export const composeRuleId = (pluginName, errorKey) =>
  encodeURIComponent(
    `${decodeURIComponent(pluginName).replace(/\|/g, '.').split('.report')[0]}|${decodeURIComponent(
      errorKey,
    )}`,
  );

const InsightsAdvisorRedirector = (props) => {
  const { params, clusterDetails, fetchClusterDetails, location, setGlobalError } = props;
  React.useEffect(() => {
    if (!clusterDetails.fulfilled && params.id && !isUuid(params.id)) {
      fetchClusterDetails(params.id);
    }
  }, [clusterDetails, fetchClusterDetails, params]);

  const externalId =
    params?.id && isUuid(params.id) ? params.id : clusterDetails?.cluster?.external_id;
  const path = location.pathname;

  if (externalId) {
    if (
      matchPath(
        {
          path: '/details/:clusterId',
          exact: true,
        },
        path,
      ) ||
      matchPath(
        {
          path: '/details/s/:id',
          exact: true,
        },
        path,
      )
    ) {
      return <ExternalRedirect url={`${advisorBaseName()}/clusters/${externalId}`} />;
    }
    if (
      matchPath(
        {
          path: '/details/:id/insights/:reportId/:errorKey',
          exact: true,
        },
        path,
      ) ||
      matchPath(
        {
          path: '/details/s/:id/insights/:reportId/:errorKey',
          exact: true,
          strict: true,
        },
        path,
      )
    ) {
      const { reportId, errorKey } = params;
      const ruleId = composeRuleId(reportId, errorKey);
      return (
        <ExternalRedirect url={`${advisorBaseName()}/clusters/${externalId}?first=${ruleId}`} />
      );
    }
  }

  if (clusterDetails.error) {
    // Cluster not found or no permission to see it - redirect to cluster list with error on top
    setGlobalError(
      <>
        Cluster with the subscription ID <b>{params?.id}</b> was not found, it might have been
        deleted or you don&apos;t have permission to see it.
      </>,
      'clusterDetails',
      clusterDetails?.errorMessage,
    );
    return <Navigate to="/" />;
  }

  if (clusterDetails.fulfilled && !externalId) {
    // Could not find external id for the given cluster
    setGlobalError(
      <>
        There is no external ID for the cluster with the <b>{params?.id}</b> subscription ID.
      </>,
      'clusterDetails',
      clusterDetails?.errorMessage,
    );
    return <Navigate to="/" />;
  }

  return (
    <Bullseye>
      <Spinner size="lg" centered />
    </Bullseye>
  );
};

InsightsAdvisorRedirector.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
    reportId: PropTypes.string,
    errorKey: PropTypes.string,
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
