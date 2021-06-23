import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Card,
  CardTitle,
  CardBody,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  List,
  ListItem,
  Spinner,
  Popover,
  Title,
} from '@patternfly/react-core';

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  PendingIcon,
} from '@patternfly/react-icons';

// eslint-disable-next-line camelcase
import { global_success_color_100 } from '@patternfly/react-tokens';
import AddOnsConstants from '../../ClusterDetails/components/AddOns/AddOnsConstants';

import './UninstallProgress.scss';

class UninstallProgress extends React.Component {
  state = {
    showPopover: false,
  };

  componentDidMount() {
    const {
      cluster,
      clusterAddOns,
      getClusterAddOns,
    } = this.props;
    if (clusterAddOns.clusterID !== cluster.id || (!clusterAddOns.pending)) {
      getClusterAddOns(cluster.id);
    }
  }

  popOverShouldClose = () => {
    this.setState({ showPopover: false });
  };

  popOverShouldOpen = () => {
    this.setState({ showPopover: true });
  };

  navToAddOns = () => {
    this.setState({ showPopover: false });
    window.location.hash = '#addOns';
  };

  render() {
    const {
      clusterAddOns,
      addOns,
      children,
    } = this.props;

    const {
      showPopover,
    } = this.state;

    // check if a cluster has addons with external resources
    const getBlockingAddons = () => {
      const addOnsWithExternalResources = [];
      clusterAddOns.items.forEach((clusterAddOn) => {
        addOns.items.forEach((addOn) => {
          if (addOn.id === clusterAddOn.id && addOn.has_external_resources) {
            addOnsWithExternalResources.push(clusterAddOn);
          }
        });
      });
      return addOnsWithExternalResources;
    };

    // get a list of addons that will block an uninstall
    const blockingAddons = getBlockingAddons();

    // check if addon are currently deleting
    const anyAddonsDeleting = blockingAddons.some(
      addOn => addOn.state === AddOnsConstants.INSTALLATION_STATE.DELETING,
    );

    // check if any addons are not deleted
    const anyAddonsNotDeleted = blockingAddons.some(
      addOn => addOn.state !== AddOnsConstants.INSTALLATION_STATE.DELETED,
    );

    // check if any blocking addons are in error state
    const anyAddonsError = blockingAddons.some(
      addOn => addOn.state === AddOnsConstants.INSTALLATION_STATE.FAILED,
    );

    const getFailedAddons = () => {
      const failedAddons = [];
      if (anyAddonsError) {
        clusterAddOns.items.forEach((clusterAddOn) => {
          if (clusterAddOn.state === AddOnsConstants.INSTALLATION_STATE.FAILED) {
            failedAddons.push(clusterAddOn);
          }
        });
      }
      return failedAddons;
    };

    const failedAddons = getFailedAddons();

    const singlePopOver = () => (
      <Popover
        isVisible={showPopover}
        shouldClose={() => this.popOverShouldClose()}
        shouldOpen={() => this.popOverShouldOpen()}
        headerContent={<div>Add-on uninstallation status</div>}
        bodyContent={(
          <div>
            <Button
              isInline
              variant="link"
              onClick={() => this.navToAddOns()}
            >
              {failedAddons[0].id}
            </Button>
            {' '}
            add-on failed to uninstall
          </div>
                                    )}
      >
        <Button isInline variant="link">Failed</Button>
      </Popover>
    );

    const multiplePopOver = () => (
      <Popover
        isVisible={showPopover}
        shouldClose={() => this.popOverShouldClose()}
        shouldOpen={() => this.popOverShouldOpen()}
        headerContent={<div>Add-on uninstallation status</div>}
        bodyContent={(
          <div>
            The following add-ons failed to uninstall:
            <List
              className="uninstall-progress-list--error-list"
            >
              {failedAddons.map(addOn => (
                <ListItem>
                  <Button
                    isInline
                    variant="link"
                    onClick={() => this.navToAddOns()}
                  >
                    {addOn.id}
                  </Button>
                </ListItem>
              ))}
            </List>
          </div>
                )}
      >
        <Button isInline variant="link">Failed</Button>
      </Popover>
    );

    const error = () => {
      if (failedAddons.length === 0) {
        return {
          icon: <ExclamationCircleIcon className="uninstall-progress-list--icon-error" />,
          text: 'Failed',
        };
      }
      if (failedAddons.length === 1) {
        return {
          icon: <ExclamationCircleIcon className="uninstall-progress-list--icon-error" />,
          text: singlePopOver(),
        };
      }

      return {
        icon: <ExclamationCircleIcon className="uninstall-progress-list--icon-error" />,
        text: multiplePopOver(),
      };
    };

    // get current progress data
    const getProgressData = () => {
      const pending = { icon: <PendingIcon className="uninstall-progress-list--icon-space-right" />, text: 'Pending' };
      const completed = { icon: <CheckCircleIcon className="uninstall-progress-list--icon-space-right" color={global_success_color_100.value} />, text: 'Completed' };
      const inProgress = { icon: <Spinner className="uninstall-progress-list--icon-space-right" size="sm" />, text: 'Uninstalling' };

      const hasAddOns = ((blockingAddons.length !== 0) && (clusterAddOns.items.length !== 0));
      if (!hasAddOns || !anyAddonsNotDeleted) {
        return {
          addOnCleanUp: completed,
          clusterUninstall: inProgress,
        };
      }

      if (anyAddonsDeleting) {
        return {
          addOnCleanUp: inProgress,
          clusterUninstall: pending,
        };
      }

      if (anyAddonsError) {
        return {
          addOnCleanUp: error(),
          clusterUninstall: pending,
        };
      }

      return {
        addOnCleanUp: pending,
        clusterUninstall: pending,
      };
    };

    // get progress data
    const progressData = getProgressData();

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size="lg" className="card-title logview-title">
            Cluster Uninstallation
          </Title>
        </CardTitle>
        <CardBody>
          {children && children[0]}
          <DescriptionList className="uninstall-progress-list--description-list">
            <DescriptionListGroup>
              <DescriptionListTerm>Add-on uninstallation</DescriptionListTerm>
              <DescriptionListDescription>
                {progressData.addOnCleanUp.icon}
                {progressData.addOnCleanUp.text}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Cluster uninstallation</DescriptionListTerm>
              <DescriptionListDescription>
                {progressData.clusterUninstall.icon}
                {progressData.clusterUninstall.text}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
          {children && children[1]}
        </CardBody>
      </Card>
    );
  }
}

UninstallProgress.propTypes = {
  cluster: PropTypes.object.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
  getClusterAddOns: PropTypes.func.isRequired,
  clusterAddOns: PropTypes.object,
  addOns: PropTypes.object,
};

export default UninstallProgress;
