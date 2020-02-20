import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardHead,
  CardActions,
  CardBody,
  Button,
  EmptyState,
  EmptyStateBody,
  Title,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import { IntegrationIcon } from '@patternfly/react-icons';

import clusterStates from '../../../common/clusterStates';
import ErrorBox from '../../../../common/ErrorBox';

import {
  getInstallState,
  isInstalled,
  hasQuota,
  availableAddOns,
} from './AddOnsHelper';

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
    } = this.props;
    if ((addClusterAddOnResponse.fulfilled && prevProps.addClusterAddOnResponse.pending)
        && !clusterAddOns.pending) {
      // Fetch cluster add-ons again if we just added a cluster add-on
      getClusterAddOns(clusterID);
      // Refresh quota after installing add-ons
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
      clusterID,
      addClusterAddOn,
      addClusterAddOnResponse,
      organization,
      quota,
    } = this.props;

    if (clusterAddOns.pending || addClusterAddOnResponse.pending) {
      return (
        <EmptyState>
          <EmptyStateBody>
            <Spinner centered />
          </EmptyStateBody>
        </EmptyState>
      );
    }

    // Add-ons can only be installed when the cluster is ready
    const isClusterReady = cluster.state === clusterStates.READY;
    const availableAddOnsList = availableAddOns(addOns, clusterAddOns, organization, quota);
    const hasAddOns = availableAddOnsList.length > 0;

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
      <div className="cluster-details-addons-tab-contents">
        { addClusterAddOnResponse.error && (
        <ErrorBox message="Error adding add-ons" response={addClusterAddOnResponse} />
        )}
        { availableAddOnsList.map(addOn => (
          <Card key={addOn.id}>
            <CardHead>
              <Title headingLevel="h2" size="2xl">{addOn.name}</Title>
              <CardActions>
                { (isInstalled(addOn, clusterAddOns) && getInstallState(addOn, clusterAddOns)) || (
                <Button
                  variant="secondary"
                  aria-label="Install"
                  isDisabled={
                    addClusterAddOnResponse.pending
                      || !isClusterReady
                      || !cluster.canEdit
                      || !hasQuota(addOn, organization, quota)
                  }
                  onClick={() => addClusterAddOn(clusterID, addOn.id)}
                >
                  Install
                </Button>
                )}
              </CardActions>
            </CardHead>
            <CardBody className="addon-card">
              <div className="addon-icon">
                { addOn.icon && (
                <img alt={addOn.name} src={`data:image/png;base64,${addOn.icon}`} />
                )}
              </div>
              <div className="addon-description">
                {addOn.description}
              </div>
            </CardBody>
          </Card>
        ))}
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
  addClusterAddOn: PropTypes.func.isRequired,
  addClusterAddOnResponse: PropTypes.object.isRequired,
  clearClusterAddOnsResponses: PropTypes.func.isRequired,
};

export default AddOns;
