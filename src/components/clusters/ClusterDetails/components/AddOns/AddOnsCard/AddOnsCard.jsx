import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardActions,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Dropdown,
  DropdownItem,
  KebabToggle,
  Label,
  Tooltip,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
import AddOnsConstants from '../AddOnsConstants';
import { hasParameters } from '../AddOnsHelper';
import { noQuotaTooltip } from '../../../../../../common/helpers';
import clusterStates from '../../../../common/clusterStates';

class AddOnsCard extends Component {
  state = {
    isActionsOpen: false,
  };

  onToggle = isActionsOpen => this.setState({ isActionsOpen });

  onSelect = () => this.setState(state => ({ isActionsOpen: !state.isActionsOpen }));

  getInstallState() {
    const { installedAddOn } = this.props;

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
          <Label variant="outline" icon={<InProgressIcon />}>
            Installing
          </Label>
        );
      case AddOnsConstants.INSTALLATION_STATE.DELETING:
        return (
          <Label variant="outline" icon={<InProgressIcon />}>
            Deleting
          </Label>
        );
      case AddOnsConstants.INSTALLATION_STATE.FAILED:
        return (
          <Label variant="outline" color="red" icon={<ExclamationCircleIcon />}>
            Install failed
          </Label>
        );
      case AddOnsConstants.INSTALLATION_STATE.READY:
        return (
          <Label variant="outline" color="green" icon={<CheckCircleIcon />}>
            Installed
          </Label>
        );
      default:
        return (
          <Label variant="outline" icon={<UnknownIcon />}>
            Unknown
          </Label>
        );
    }
  }

  getPrimaryAction(addOn) {
    const {
      cluster,
      installedAddOn,
      addClusterAddOn,
      addClusterAddOnResponse,
      hasQuota,
      openModal,
    } = this.props;

    const installAddOn = () => {
      if (hasParameters(addOn)) {
        openModal('add-ons-parameters-modal', {
          clusterID: cluster.id,
          addOn,
          isUpdateForm: false,
        });
      } else {
        addClusterAddOn(cluster.id, {
          addon: {
            id: addOn.id,
          },
        });
      }
    };

    // Show install button if not installed
    if (!installedAddOn) {
      if (!hasQuota || !cluster.canEdit) {
        return (
          <Tooltip
            content={!cluster.canEdit
              ? 'You do not have permission to install add ons. Only cluster owners and organization administrators can install add ons.'
              : noQuotaTooltip}
          >
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
          onClick={installAddOn}
        >
          Install
        </Button>
      );
    }

    let url;
    switch (installedAddOn.state) {
      case AddOnsConstants.INSTALLATION_STATE.PENDING:
      case AddOnsConstants.INSTALLATION_STATE.INSTALLING:
      case undefined:
        // undefined state implies that the user just started
        // the installation and there is no state available yet
        return '';
      case AddOnsConstants.INSTALLATION_STATE.FAILED:
        url = 'https://access.redhat.com/support/cases/#/case/new';
        return (
          <Button
            component="a"
            variant="secondary"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact support
          </Button>
        );
      case AddOnsConstants.INSTALLATION_STATE.READY:
        url = `${cluster.console.url}/k8s/ns/${addOn.target_namespace}/operators.coreos.com~v1alpha1~ClusterServiceVersion/${addOn.operator_name}.v${installedAddOn.operator_version}`;
        return (
          <Button
            component="a"
            variant="secondary"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View in Console
          </Button>
        );
      default:
        return '';
    }
  }

  getInstalledActions(addOn) {
    const { installedAddOn, cluster, openModal } = this.props;
    if (!installedAddOn) {
      return '';
    }

    if (AddOnsConstants.INSTALLATION_STATE.READY !== installedAddOn.state) {
      return '';
    }

    const configureAddOn = (addOnInstallation) => {
      openModal('add-ons-parameters-modal', {
        clusterID: cluster.id,
        addOn,
        addOnInstallation,
        isUpdateForm: true,
      });
    };

    const { isActionsOpen } = this.state;
    const dropdownItems = [
      <DropdownItem
        key="action"
        component="button"
        isDisabled={!hasParameters(addOn)}
        onClick={() => configureAddOn(installedAddOn)}
      >
        Configure
      </DropdownItem>,
    ];

    return (
      <Dropdown
        onSelect={this.onSelect}
        toggle={<KebabToggle onToggle={this.onToggle} />}
        isOpen={isActionsOpen}
        isPlain
        dropdownItems={dropdownItems}
        position="right"
      />
    );
  }

  render() {
    const { addOn } = this.props;
    return (
      <Card key={addOn.id}>
        <CardHeader className="addon-card-head">
          { addOn.icon && (
            <img alt={addOn.name} src={`data:image/png;base64,${addOn.icon}`} />
          )}
          <CardActions>
            { this.getInstalledActions(addOn) }
          </CardActions>
        </CardHeader>
        <CardTitle>
          { addOn.name }
        </CardTitle>
        <CardBody isFilled={false}>
          { this.getInstallState() }
        </CardBody>
        <CardBody>
          { addOn.description }
          { ' ' }
          { addOn.docs_link && (
            <a href={addOn.docs_link} rel="noreferrer noopener" target="_blank">View documentation</a>
          )}
        </CardBody>
        <CardFooter>
          { this.getPrimaryAction(addOn) }
        </CardFooter>
      </Card>
    );
  }
}

AddOnsCard.propTypes = {
  addOn: PropTypes.object.isRequired,
  cluster: PropTypes.object.isRequired,
  installedAddOn: PropTypes.object,
  hasQuota: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  addClusterAddOn: PropTypes.func.isRequired,
  addClusterAddOnResponse: PropTypes.object.isRequired,
};

export default AddOnsCard;
