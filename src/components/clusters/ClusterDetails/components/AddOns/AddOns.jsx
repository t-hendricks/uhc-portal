import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import has from 'lodash/has';

import { IntegrationIcon, OutlinedCheckCircleIcon } from '@patternfly/react-icons';
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
import { global_success_color_100 } from '@patternfly/react-tokens';

import clusterStates from '../../../common/clusterStates';
import ErrorBox from '../../../../common/ErrorBox';

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
    } = this.props;
    if ((addClusterAddOnResponse.fulfilled && prevProps.addClusterAddOnResponse.pending)
        && !clusterAddOns.pending) {
      // fetch cluster add-ons again if we just added a cluster add-on.
      getClusterAddOns(clusterID);
    }
  }

  componentWillUnmount() {
    const { clearAddOnsResponses } = this.props;
    clearAddOnsResponses();
  }

  // An add-on is only visible if it has an entry in the quota summary
  // regardless of whether the org has quota or not
  isAvailable(addOn) {
    const { organization, quota } = this.props;
    if (!addOn.enabled || !organization.fulfilled) {
      return false;
    }
    // If the add-on is not in the quota summary, it should not be available
    if (!quota.addOnsQuota || !has(quota.addOnsQuota, addOn.id)) {
      return false;
    }
    return true;
  }

  isInstalled(addOn) {
    const { clusterAddOns } = this.props;

    if (!get(clusterAddOns, 'items.length', false)) {
      return false;
    }

    return clusterAddOns.items.some(clusterAddOn => clusterAddOn.id === addOn.id);
  }

  // An add-on can only be installed if the org has quota for this particular add-on
  hasQuota(addOn) {
    const { quota } = this.props;

    if (!this.isAvailable(addOn)) {
      return false;
    }

    const available = quota.addOnsQuota[addOn.id] || 0;
    return available > 0;
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

    // Add-ons can only be installed when the cluster is ready
    const isClusterReady = cluster.state === clusterStates.READY;
    const hasAddOns = this.availableAddOns().length > 0;

    if (addOns.error || !hasAddOns) {
      return (
        <EmptyState>
          <EmptyStateIcon icon={IntegrationIcon} />
          {addOns.error && (
            <ErrorBox message="Error getting add-ons" response={addOns} />
          )}
          <Title headingLevel="h5" size="lg">No add-ons available for this cluster</Title>
          <EmptyStateBody>
            There are no add-ons available or there was an error getting the list of add-ons.
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
                { (this.isInstalled(addOn) && (
                <OutlinedCheckCircleIcon color={global_success_color_100.value} size="md" />
                )) || (
                <Button
                  variant="secondary"
                  aria-label="Install"
                  isDisabled={!isClusterReady || !this.hasQuota(addOn)}
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
  getClusterAddOns: PropTypes.func.isRequired,
  addClusterAddOn: PropTypes.func.isRequired,
  addClusterAddOnResponse: PropTypes.object.isRequired,
  clearAddOnsResponses: PropTypes.func.isRequired,
};

export default AddOns;
