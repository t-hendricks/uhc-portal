import React from 'react';
import PropTypes from 'prop-types';

import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Gallery,
  Title,
} from '@patternfly/react-core';
import { IntegrationIcon } from '@patternfly/react-icons';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import ErrorBox from '../../../../common/ErrorBox';
import { availableAddOns, getInstalled, hasQuota } from './AddOnsHelper';
import AddOnsCard from './AddOnsCard';
import AddOnsParametersModal from './AddOnsParametersModal';
import AddOnsDeleteModal from './AddOnsDeleteModal';

class AddOns extends React.Component {
  componentDidMount() {
    const {
      clusterID,
      getClusterAddOns,
      clusterAddOns,
    } = this.props;
    if (clusterAddOns.clusterID !== clusterID || (!clusterAddOns.pending)) {
      getClusterAddOns(clusterID);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      clusterID,
      getClusterAddOns,
      clusterAddOns,
      addClusterAddOnResponse,
      getOrganizationAndQuota,
      deleteClusterAddOnResponse,
    } = this.props;
    if (((addClusterAddOnResponse.fulfilled && prevProps.addClusterAddOnResponse.pending)
    || (deleteClusterAddOnResponse.fulfilled && prevProps.deleteClusterAddOnResponse.pending))
        && !clusterAddOns.pending) {
      // Fetch cluster add-ons again if we just added or deleted a cluster add-on
      getClusterAddOns(clusterID);
      // Refresh quota after installing or deleting add-ons
      getOrganizationAndQuota();
    }
  }

  componentWillUnmount() {
    const { clearClusterAddOnsResponses } = this.props;
    clearClusterAddOnsResponses();
  }

  render() {
    const {
      addOns,
      cluster,
      clusterAddOns,
      addClusterAddOnResponse,
      organization,
      quota,
    } = this.props;

    if (clusterAddOns.pending && clusterAddOns.items.length === 0) {
      return (
        <EmptyState>
          <EmptyStateBody>
            <Spinner centered />
          </EmptyStateBody>
        </EmptyState>
      );
    }

    const addOnsList = availableAddOns(addOns, cluster, clusterAddOns, organization, quota);
    const hasAddOns = addOnsList.length > 0;

    if (!hasAddOns) {
      return (
        <EmptyState>
          <EmptyStateIcon icon={IntegrationIcon} />
          {addOns.error && (
            <ErrorBox message="Error getting add-ons" response={addOns} />
          )}
          <Title headingLevel="h5" size="lg">No add-ons available for this cluster</Title>
          <EmptyStateBody>
            There are no add-ons available for this cluster.
          </EmptyStateBody>
        </EmptyState>
      );
    }

    if (clusterAddOns.error) {
      return (
        <EmptyState>
          <ErrorBox message="Error getting cluster add-ons" response={clusterAddOns} />
        </EmptyState>
      );
    }

    return (
      <div>
        { addClusterAddOnResponse.error && (
          <ErrorBox message="Error adding add-ons" response={addClusterAddOnResponse} />
        )}
        <Gallery hasGutter>
          { addOnsList.map(addOn => (
            <AddOnsCard
              addOn={addOn}
              installedAddOn={getInstalled(addOn, clusterAddOns)}
              hasQuota={hasQuota(addOn, cluster, organization, quota)}
            />
          ))}
        </Gallery>
        <AddOnsParametersModal
          clusterID={cluster.id}
        />
        <AddOnsDeleteModal />
      </div>
    );
  }
}

AddOns.propTypes = {
  clusterID: PropTypes.string.isRequired,
  cluster: PropTypes.object.isRequired,
  addOns: PropTypes.object.isRequired,
  clusterAddOns: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  quota: PropTypes.object.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  getClusterAddOns: PropTypes.func.isRequired,
  addClusterAddOnResponse: PropTypes.object.isRequired,
  deleteClusterAddOnResponse: PropTypes.object.isRequired,
  clearClusterAddOnsResponses: PropTypes.func.isRequired,
};

export default AddOns;
