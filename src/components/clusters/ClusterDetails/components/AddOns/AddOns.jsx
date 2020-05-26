import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Card,
  CardActions,
  CardBody,
  CardFooter,
  CardHead,
  CardHeader,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Gallery,
  Title,
  Tooltip,
} from '@patternfly/react-core';

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  IntegrationIcon,
  UnknownIcon,
} from '@patternfly/react-icons';

import { Spinner } from '@redhat-cloud-services/frontend-components';

// eslint-disable-next-line camelcase
import { global_success_color_100, global_danger_color_100 } from '@patternfly/react-tokens';
import get from 'lodash/get';

import clusterStates from '../../../common/clusterStates';
import ErrorBox from '../../../../common/ErrorBox';
import { noQuotaTooltip } from '../../../../../common/helpers';

import {
  isInstalled,
  hasQuota,
  availableAddOns,
} from './AddOnsHelper';

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

    if (!get(clusterAddOns, 'items.length', false)) {
      return '';
    }

    const installedAddOn = clusterAddOns.items.find(item => item.addon.id === addOn.id);
    if (!installedAddOn) {
      return '';
    }

    switch (installedAddOn.state) {
      case AddOnsConstants.INSTALLATION_STATE.PENDING:
      case AddOnsConstants.INSTALLATION_STATE.INSTALLING:
      case undefined:
        // undefined state implies that the user just started
        // the installation and there is no state available yet
        return (
          <>
            <InProgressIcon size="md" />
            <span>Installing</span>
          </>
        );
      case AddOnsConstants.INSTALLATION_STATE.DELETING:
        return (
          <>
            <InProgressIcon size="md" />
            <span>Deleting</span>
          </>
        );
      case AddOnsConstants.INSTALLATION_STATE.FAILED:
        return (
          <>
            <ExclamationCircleIcon color={global_danger_color_100.value} size="md" />
            <span>Install failed</span>
          </>
        );
      case AddOnsConstants.INSTALLATION_STATE.READY:
        return (
          <>
            <CheckCircleIcon color={global_success_color_100.value} size="md" />
            <span>Installed</span>
          </>
        );
      default:
        return (
          <>
            <UnknownIcon size="md" />
            <span>Unknown</span>
          </>
        );
    }
  }

  getActions(addOn) {
    const {
      cluster,
      clusterAddOns,
      clusterID,
      addClusterAddOn,
      addClusterAddOnResponse,
      organization,
      quota,
    } = this.props;

    // Show install button if not installed
    if (!isInstalled(addOn, clusterAddOns)) {
      if (!hasQuota(addOn, cluster, organization, quota)) {
        return (
          <Tooltip content={noQuotaTooltip}>
            <div className="pf-u-display-inline-block">
              <Button isDisabled>
                Install
              </Button>
            </div>
          </Tooltip>
        );
      }
      return (
        <Button
          variant="secondary"
          aria-label="Install"
          isDisabled={
            addClusterAddOnResponse.pending
              || cluster.state !== clusterStates.READY
              || !cluster.canEdit
          }
          onClick={() => addClusterAddOn(clusterID, addOn.id)}
        >
          Install
        </Button>
      );
    }

    if (!get(clusterAddOns, 'items.length', false)) {
      return '';
    }

    const installedAddOn = clusterAddOns.items.find(item => item.addon.id === addOn.id);
    if (!installedAddOn) {
      return '';
    }

    let url;
    switch (installedAddOn.state) {
      case AddOnsConstants.INSTALLATION_STATE.FAILED:
        url = 'https://access.redhat.com/support/cases/#/case/new';
        return (
          <a href={url} rel="noreferrer noopener" target="_blank">
            <Button variant="secondary" size="sm">Contact support</Button>
          </a>
        );
      case AddOnsConstants.INSTALLATION_STATE.READY:
        url = `${cluster.console.url}/k8s/ns/${addOn.target_namespace}/operators.coreos.com~v1alpha1~ClusterServiceVersion/${addOn.id}.v${installedAddOn.operator_version}`;
        return (
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="sm">View in console</Button>
          </a>
        );
      default:
        return '';
    }
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

    if (clusterAddOns.pending || addClusterAddOnResponse.pending) {
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
      <div className="cluster-details-addons-tab-contents">
        { addClusterAddOnResponse.error && (
          <ErrorBox message="Error adding add-ons" response={addClusterAddOnResponse} />
        )}
        <Gallery gutter="md">
          { addOnsList.map(addOn => (
            <Card key={addOn.id}>
              <CardHead className="addon-card-head">
                { addOn.icon && (
                  <img alt={addOn.name} src={`data:image/png;base64,${addOn.icon}`} />
                )}
                <CardActions>
                  { this.getInstallState(addOn) }
                </CardActions>
              </CardHead>
              <CardHeader>
                { addOn.name }
              </CardHeader>
              <CardBody>
                { addOn.description }
                { ' ' }
                { addOn.docs_link && (
                  <a href={addOn.docs_link} rel="noreferrer noopener" target="_blank">View documentation</a>
                )}
              </CardBody>
              <CardFooter>
                { this.getActions(addOn) }
              </CardFooter>
            </Card>
          ))}
        </Gallery>
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
