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
import clusterStates, { isHibernating } from '../../../../common/clusterStates';
import './AddOnsCard.scss';

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
      case AddOnsConstants.INSTALLATION_STATE.DELETED:
      case AddOnsConstants.INSTALLATION_STATE.DELETING:
        return (
          <Label variant="outline" icon={<InProgressIcon />}>
            Uninstalling
          </Label>
        );
      case AddOnsConstants.INSTALLATION_STATE.FAILED:
        return (
          <Label variant="outline" color="red" icon={<ExclamationCircleIcon />}>
            Add-on failed
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
      const clusterHibernating = isHibernating(cluster.state);
      if (!hasQuota || !cluster.canEdit || clusterHibernating) {
        let tooltipContent;
        if (clusterHibernating) {
          tooltipContent = 'This operation is not available while cluster is hibernating';
        } else if (!cluster.canEdit) {
          tooltipContent = 'You do not have permission to install add ons. Only cluster owners and organization administrators can install add ons.';
        } else {
          tooltipContent = noQuotaTooltip;
        }


        return (
          <Tooltip
            content={tooltipContent}
          >
            <div className="pf-u-display-inline-block">
              <Button isDisabled ouiaId={`install-addon-${addOn.id}`}>
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
          ouiaId={`install-addon-${addOn.id}`}
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
        key="parameters"
        ouiaId={`configure-addon-${addOn.id}`}
        component="button"
        isDisabled={
          !hasParameters(addOn)
          || !cluster.canEdit
          || installedAddOn.state !== AddOnsConstants.INSTALLATION_STATE.READY
        }
        onClick={() => configureAddOn(installedAddOn)}
      >
        Configure
      </DropdownItem>,
      <DropdownItem
        key="delete"
        ouiaId={`uninstall-addon-${addOn.id}`}
        component="button"
        isDisabled={
          !cluster.canEdit
          || installedAddOn.state === AddOnsConstants.INSTALLATION_STATE.DELETING
        }
        onClick={() => openModal('add-ons-delete-modal', {
          addOnName: addOn.name,
          addOnID: addOn.id,
          clusterID: cluster.id,
        })}
      >
        Uninstall add-on
      </DropdownItem>,
    ];

    if (!cluster.canEdit) {
      return (
        <Tooltip
          content="You do not have permission to make changes to this add-on. Only cluster owners and organization administrators can make these changes."
          position="bottom"
        >
          <Dropdown
            toggle={<KebabToggle isDisabled />}
            isPlain
            position="right"
          />
        </Tooltip>
      );
    }
    return (
      <Dropdown
        onSelect={this.onSelect}
        toggle={<KebabToggle onToggle={this.onToggle} />}
        isOpen={isActionsOpen}
        isPlain
        dropdownItems={dropdownItems}
        position="right"
        ouiaId={`configure-${addOn.id}`}
      />
    );
  }

  render() {
    const { addOn } = this.props;
    return (
      <Card key={addOn.id} ouiaId={`card-addon-${addOn.id}`} className="ocm-c-addons__card">
        <CardHeader className="ocm-c-addons__card--header">
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
        <CardBody isFilled={false} className="ocm-c-addons__card--body">
          { this.getInstallState() }
        </CardBody>
        <CardBody className="ocm-c-addons__card--body">
          { addOn.description }
          { ' ' }
          { addOn.docs_link && (
            <a href={addOn.docs_link} rel="noreferrer noopener" target="_blank">View documentation</a>
          )}
        </CardBody>
        <CardFooter className="ocm-c-addons__card--footer">
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
