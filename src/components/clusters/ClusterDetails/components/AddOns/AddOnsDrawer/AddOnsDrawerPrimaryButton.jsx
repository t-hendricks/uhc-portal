import React from 'react';
import PropTypes from 'prop-types';

import './AddOnsDrawer.scss';

import { Button } from '@patternfly/react-core';

import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { hasParameters } from '../AddOnsHelper';
import clusterStates, { isHibernating } from '../../../../common/clusterStates';
import { noQuotaTooltip } from '../../../../../../common/helpers';

import AddOnsConstants from '../AddOnsConstants';
import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';

function AddOnsPrimaryButton(props) {
  const {
    activeCard,
    activeCardRequirementsFulfilled,
    addClusterAddOn,
    addClusterAddOnResponse,
    updateClusterAddOn,
    cluster,
    hasQuota,
    installedAddOn,
    openModal,
    subscriptionModels,
  } = props;

  const subscription = subscriptionModels[activeCard.id];

  // install an add on or open params modal
  const installAddOnAction = () => {
    if (hasParameters(activeCard)) {
      openModal('add-ons-parameters-modal', {
        clusterID: cluster.id,
        addOn: activeCard,
        isUpdateForm: false,
      });
    } else {
      addClusterAddOn(cluster.id, {
        addon: {
          id: activeCard?.id,
        },
        billing: {
          billing_model: subscription.billingModel,
          ...(subscription.cloudAccount && {
            billing_marketplace_account: subscription.cloudAccount,
          }),
        },
      });
    }
  };

  const updateAddOnAction = () => {
    updateClusterAddOn(cluster.id, installedAddOn.id, {
      billing: {
        billing_model: subscription.billingModel,
        ...(subscription.cloudAccount && {
          billing_marketplace_account: subscription.cloudAccount,
        }),
      },
    });
  };

  const canNotEditReason =
    !cluster.canEdit &&
    'You do not have permission to install add ons. Only cluster owners, cluster editors, and Organization Administrators can install add ons.';
  const isReadOnly = cluster?.status?.configuration_mode === 'read_only';
  const readOnlyReason = isReadOnly && 'This operation is not available during maintenance';
  const hibernatingReason =
    isHibernating(cluster.state) && 'This operation is not available while cluster is hibernating';
  // a superset of hibernatingReason.
  const notReadyReason = cluster.state !== clusterStates.READY && 'This cluster is not ready';
  const requirementsReason = !activeCardRequirementsFulfilled && 'Prerequisites not met';
  const quotaReason = (!hasQuota || subscription?.billingModel === 'no-quota') && noQuotaTooltip;
  const billingReason =
    subscription?.billingModel === 'marketplace' && 'Select a subscription type';
  const unchangedReason =
    installedAddOn?.billing?.billing_model === subscription?.billingModel && 'No changes';

  // eslint-disable-next-line no-unused-vars
  const updateAddonAction = (
    <ButtonWithTooltip
      variant="primary"
      disableReason={
        readOnlyReason ||
        hibernatingReason ||
        notReadyReason ||
        canNotEditReason ||
        unchangedReason ||
        billingReason
      }
      isSmall
      onClick={updateAddOnAction}
    >
      Save changes
    </ButtonWithTooltip>
  );

  // open uninstall modal
  const uninstallAddonAction = (hasMarginLeft = true) => (
    <ButtonWithTooltip
      ouiaId={`uninstall-addon-${activeCard?.id}`}
      variant="secondary"
      isDanger
      disableReason={readOnlyReason || hibernatingReason || notReadyReason || canNotEditReason}
      isSmall
      onClick={() =>
        openModal('add-ons-delete-modal', {
          addOnName: activeCard?.name,
          addOnID: activeCard?.id,
          clusterID: cluster.id,
        })
      }
      className={hasMarginLeft && 'pf-u-ml-xs'}
    >
      Uninstall
    </ButtonWithTooltip>
  );

  // if addon not installed show install button
  if (!installedAddOn) {
    const pendingReason = addClusterAddOnResponse.pending && 'installing...';
    return (
      <ButtonWithTooltip
        disableReason={
          readOnlyReason ||
          hibernatingReason ||
          notReadyReason ||
          requirementsReason ||
          canNotEditReason ||
          quotaReason ||
          pendingReason ||
          billingReason
        }
        ouiaId={`install-addon-${activeCard?.id}`}
        variant="primary"
        aria-label="Install"
        onClick={installAddOnAction}
        isSmall
      >
        Install
      </ButtonWithTooltip>
    );
  }

  let url;
  // handle addon installation states after install
  switch (installedAddOn?.state) {
    case AddOnsConstants.INSTALLATION_STATE.PENDING:
    case AddOnsConstants.INSTALLATION_STATE.INSTALLING:
    case AddOnsConstants.INSTALLATION_STATE.UPDATING:
      return <>{uninstallAddonAction(false)}</>;
    case undefined:
      // undefined state implies that the user just started
      // the installation and there is no state available yet
      return '';
    case AddOnsConstants.INSTALLATION_STATE.FAILED:
      url = 'https://access.redhat.com/support/cases/#/case/new';
      return (
        <>
          <Button
            component="a"
            variant="secondary"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            isSmall
          >
            Contact support
          </Button>{' '}
          {uninstallAddonAction()}
        </>
      );
    case AddOnsConstants.INSTALLATION_STATE.READY:
      if (cluster?.console.url) {
        url = `${cluster.console.url}/k8s/ns/${activeCard?.target_namespace}/operators.coreos.com~v1alpha1~ClusterServiceVersion/${installedAddOn?.csv_name}`;
        return (
          <div>
            <Button
              component="a"
              variant="primary"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              isSmall
            >
              Open in Console <ExternalLinkAltIcon className="link-icon" />
            </Button>{' '}
            {/* {updateAddonAction} */}
            {uninstallAddonAction()}
          </div>
        );
      }
      return '';
    default:
      return '';
  }
}

AddOnsPrimaryButton.propTypes = {
  activeCard: PropTypes.object,
  activeCardRequirementsFulfilled: PropTypes.bool,
  addClusterAddOn: PropTypes.func.isRequired,
  addClusterAddOnResponse: PropTypes.object,
  cluster: PropTypes.object,
  hasQuota: PropTypes.bool,
  installedAddOn: PropTypes.object,
  openModal: PropTypes.func,
};

export default AddOnsPrimaryButton;
