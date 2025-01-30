import React, { Component } from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';

import { Alert, Button, Form } from '@patternfly/react-core';

import { Link } from '~/common/routing';
import { SubscriptionCommonFieldsCluster_billing_model as SubscriptionCommonFieldsClusterBillingModel } from '~/types/accounts_mgmt.v1';

import links from '../../../../../common/installLinks.mjs';
import { normalizedProducts } from '../../../../../common/subscriptionTypes';
import MechTraining from '../../../../../styles/images/RH_BRAND_7764_01_MECH_Training.svg';
import ErrorBox from '../../../../common/ErrorBox';
import ExternalLink from '../../../../common/ExternalLink';
import Modal from '../../../../common/Modal/Modal';
import modals from '../../../../common/Modal/modals';
import { QuotaTypes } from '../../quotaModel';
import { availableQuota } from '../../quotaSelectors';

import './UpgradeTrialClusterDialog.scss';

class UpgradeTrialClusterDialog extends Component {
  componentDidMount() {
    const { organization, getOrganizationAndQuota } = this.props;

    if (!organization.pending) {
      getOrganizationAndQuota();
    }
  }

  componentDidUpdate() {
    const { upgradeTrialClusterResponse, resetResponse, closeModal, onClose } = this.props;
    if (upgradeTrialClusterResponse.fulfilled) {
      resetResponse();
      closeModal();
      onClose();
    }
  }

  static buttonLinkClick = (link) => {
    window.open(link, '_blank');
  };

  upgradeModalQuota() {
    const {
      cluster,
      machineTypesByID,
      organization: { quotaList },
      machinePools,
    } = this.props;
    const { OSD } = normalizedProducts;

    // OSD Trial is always CCS
    const isBYOC = true;
    const isMultiAz = get(cluster, 'multi_az');

    const cloudProviderID = get(cluster, 'cloud_provider.id');

    const machinePoolTypes = machinePools.reduce((acc, mp) => {
      const instanceTypeID = mp.instance_type;
      const resourceName = machineTypesByID[instanceTypeID].generic_name;

      const numOfMachines = mp.autoscaling ? mp.autoscaling.max_replicas : mp.replicas;

      if (acc[resourceName]) {
        acc[resourceName] += numOfMachines;
      } else {
        acc[resourceName] = numOfMachines;
      }
      return acc;
    }, {});

    const quota = { MARKETPLACE: true, STANDARD: true };

    Object.keys(machinePoolTypes).forEach((key) => {
      const quotaParams = {
        product: OSD,
        cloudProviderID,
        resourceName: key,
        isBYOC,
        isMultiAz,
      };

      const standardClusters = availableQuota(quotaList, {
        ...quotaParams,
        billingModel: SubscriptionCommonFieldsClusterBillingModel.standard,
        resourceType: QuotaTypes.CLUSTER,
      });
      const standardNodes = availableQuota(quotaList, {
        ...quotaParams,
        billingModel: SubscriptionCommonFieldsClusterBillingModel.standard,
        resourceType: QuotaTypes.NODE,
      });

      quota.STANDARD =
        quota.STANDARD && standardNodes >= machinePoolTypes[key] && standardClusters > 0;

      const marketClusters = availableQuota(quotaList, {
        ...quotaParams,
        billingModel: SubscriptionCommonFieldsClusterBillingModel.marketplace,
        resourceType: QuotaTypes.CLUSTER,
      });
      const marketNodes = availableQuota(quotaList, {
        ...quotaParams,
        billingModel: SubscriptionCommonFieldsClusterBillingModel.marketplace,
        resourceType: QuotaTypes.NODE,
      });

      quota.MARKETPLACE =
        quota.MARKETPLACE && marketNodes >= machinePoolTypes[key] && marketClusters > 0;
    });

    return quota;
  }

  primaryButton(availableQuota) {
    const { submit, clusterID } = this.props;
    const marketplaceQuotaEnabled = availableQuota.MARKETPLACE;
    const button = {
      primaryText: 'Contact sales',
      onPrimaryClick: () =>
        UpgradeTrialClusterDialog.buttonLinkClick(
          'https://cloud.redhat.com/products/dedicated/contact/',
        ),
    };

    if (availableQuota.STANDARD && !availableQuota.MARKETPLACE) {
      button.primaryText = 'Upgrade using quota';
      button.primaryLink = null;
      button.onPrimaryClick = () =>
        submit(clusterID, SubscriptionCommonFieldsClusterBillingModel.standard);
      return button;
    }

    if (marketplaceQuotaEnabled) {
      button.primaryText = 'Upgrade using Marketplace billing';
      button.primaryLink = null;
      button.onPrimaryClick = () =>
        submit(clusterID, SubscriptionCommonFieldsClusterBillingModel.marketplace);
      return button;
    }

    return button;
  }

  secondaryButton(availableQuota) {
    const { submit, clusterID } = this.props;
    const button = {
      showSecondary: false,
    };

    button.secondaryText = 'Enable Marketplace billing';
    button.showSecondary = true;
    button.onSecondaryClick = () =>
      UpgradeTrialClusterDialog.buttonLinkClick(
        'https://marketplace.redhat.com/en-us/products/red-hat-openshift-dedicated',
      );

    if (availableQuota.MARKETPLACE && availableQuota.STANDARD) {
      button.secondaryText = 'Upgrade using quota';
      button.onSecondaryClick = () =>
        submit(clusterID, SubscriptionCommonFieldsClusterBillingModel.standard);
    }

    if (availableQuota.MARKETPLACE && !availableQuota.STANDARD) {
      button.showSecondary = false;
      button.secondaryLink = null;
    }

    return button;
  }

  tertiaryButton() {
    const { closeModal, resetResponse } = this.props;
    const cancelEdit = () => {
      resetResponse();
      closeModal();
    };
    return {
      tertiaryText: 'Cancel',
      onTertiaryClick: cancelEdit,
      showTertiary: true,
      onClose: cancelEdit,
    };
  }

  render() {
    const {
      submit,
      upgradeTrialClusterResponse,
      clusterID,
      shouldDisplayClusterName,
      clusterDisplayName,
    } = this.props;

    const error = upgradeTrialClusterResponse.error ? (
      <ErrorBox message="Error upgrading cluster" response={upgradeTrialClusterResponse} />
    ) : null;

    const availableQuota = this.upgradeModalQuota();

    const primaryButton = this.primaryButton(availableQuota);
    const secondaryButton = this.secondaryButton(availableQuota);
    const tertiaryButton = this.tertiaryButton();

    const noQuota = !(availableQuota.STANDARD || availableQuota.MARKETPLACE);
    const modalSize = noQuota ? 'small' : 'medium';

    return (
      <Modal
        title="Upgrade cluster from Trial"
        secondaryTitle={shouldDisplayClusterName ? clusterDisplayName : undefined}
        data-testid="upgrade-trial-cluster-dialog"
        modalSize={modalSize}
        isSmall={false}
        {...primaryButton}
        className="upgrade-trial-cluster-dialog"
        {...secondaryButton}
        {...tertiaryButton}
        isPending={upgradeTrialClusterResponse.pending}
      >
        {error}
        <Form onSubmit={() => submit(clusterID)}>
          <div>
            {!noQuota && <img className="upgrade-trial-logo" src={MechTraining} alt="Red Hat" />}
            Convert this trial cluster to a fully supported OpenShift Dedicated cluster.
            <br />
            <br />
            <ExternalLink href={links.OCM_DOCS_UPGRADING_OSD_TRIAL}>Learn more</ExternalLink>
            {noQuota && (
              <Alert
                variant="warning"
                isInline
                title="Your organization doesn't have enough quota to upgrade this cluster."
                className="upgrade-trial-no-quota"
                data-testid="no-quota-alert"
              >
                <Link to="/quota">
                  <Button id="subscriptions" variant="link">
                    View your available quota
                  </Button>
                </Link>
              </Alert>
            )}
          </div>
        </Form>
      </Modal>
    );
  }
}

UpgradeTrialClusterDialog.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  clusterID: PropTypes.string.isRequired,
  organization: PropTypes.object.isRequired,
  cluster: PropTypes.object.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  upgradeTrialClusterResponse: PropTypes.object,
  machineTypesByID: PropTypes.object,
  clusterDisplayName: PropTypes.string,
  shouldDisplayClusterName: PropTypes.bool,
  machinePools: PropTypes.array.isRequired,
};

UpgradeTrialClusterDialog.defaultProps = {
  upgradeTrialClusterResponse: {},
};

UpgradeTrialClusterDialog.modalName = modals.UPGRADE_TRIAL_CLUSTER;

export default UpgradeTrialClusterDialog;
