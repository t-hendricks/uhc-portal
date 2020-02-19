import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import has from 'lodash/has';

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  IntegrationIcon,
  InProgressIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
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
// eslint-disable-next-line camelcase
import { global_success_color_100, global_danger_color_100 } from '@patternfly/react-tokens';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import clusterStates from '../../../common/clusterStates';
import ErrorBox from '../../../../common/ErrorBox';
import AddOnsConstants from './AddOnsConstants';

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

  getInstallState(addOn) {
    const { clusterAddOns } = this.props;

    const installedAddOn = clusterAddOns.items.find(item => item.addon.id === addOn.id);
    if (!installedAddOn) {
      return '';
    }

    let icon = '';
    let state = '';

    switch (installedAddOn.state) {
      case AddOnsConstants.INSTALLATION_STATE.PENDING:
      case AddOnsConstants.INSTALLATION_STATE.INSTALLING:
      case undefined:
        // undefined state implies that the user just started
        // the installation and there is no state available yet
        icon = <InProgressIcon size="md" />;
        state = 'Installing';
        break;
      case AddOnsConstants.INSTALLATION_STATE.DELETING:
        icon = <InProgressIcon size="md" />;
        state = 'Deleting';
        break;
      case AddOnsConstants.INSTALLATION_STATE.FAILED:
        icon = <ExclamationCircleIcon color={global_danger_color_100.value} size="md" />;
        state = 'Install failed';
        break;
      case AddOnsConstants.INSTALLATION_STATE.READY:
        icon = <CheckCircleIcon color={global_success_color_100.value} size="md" />;
        state = 'Installed';
        break;
      default:
        icon = <UnknownIcon size="md" />;
        state = 'Unknown';
        break;
    }

    return (
      <>
        { icon }
        <span>{ state }</span>
      </>
    );
  }

  // An add-on is only visible if it has an entry in the quota summary
  // regardless of whether the org has quota or not
  isAvailable(addOn) {
    const { organization, quota } = this.props;
    if (!addOn.enabled || !organization.fulfilled) {
      return false;
    }

    // If the add-on is not in the quota summary, it should not be available
    return has(quota.addOnsQuota, addOn.resource_name);
  }

  isInstalled(addOn) {
    const { clusterAddOns } = this.props;

    if (!get(clusterAddOns, 'items.length', false)) {
      return false;
    }

    return clusterAddOns.items.some(clusterAddOn => clusterAddOn.addon.id === addOn.id);
  }

  // An add-on can only be installed if the org has quota for this particular add-on
  hasQuota(addOn) {
    const { quota } = this.props;

    if (!this.isAvailable(addOn)) {
      return false;
    }

    return get(quota.addOnsQuota, addOn.resource_name, 0) >= addOn.resource_cost;
  }

  availableAddOns() {
    const { addOns } = this.props;

    if (!get(addOns, 'items.length', false)) {
      return [];
    }

    return addOns.items.filter(addOn => this.isAvailable(addOn) || this.isInstalled(addOn));
  }

  render() {
    const {
      addOns,
      cluster,
      clusterAddOns,
      clusterID,
      addClusterAddOn,
      addClusterAddOnResponse,
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
    const hasAddOns = this.availableAddOns().length > 0;

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
        { this.availableAddOns().map(addOn => (
          <Card key={addOn.id}>
            <CardHead>
              <Title headingLevel="h2" size="2xl">{addOn.name}</Title>
              <CardActions>
                { (this.isInstalled(addOn) && this.getInstallState(addOn)) || (
                <Button
                  variant="secondary"
                  aria-label="Install"
                  isDisabled={
                    addClusterAddOnResponse.pending
                      || !isClusterReady
                      || !cluster.canEdit
                      || !this.hasQuota(addOn)
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
