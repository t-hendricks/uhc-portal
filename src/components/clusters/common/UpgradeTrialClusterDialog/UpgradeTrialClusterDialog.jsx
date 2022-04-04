import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Alert, Button } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import get from 'lodash/get';
import MechTraining from '../../../../styles/images/RH_BRAND_7764_01_MECH_Training.svg';

import ExternalLink from '../../../common/ExternalLink';
import Modal from '../../../common/Modal/Modal';
import modals from '../../../common/Modal/modals';
import ErrorBox from '../../../common/ErrorBox';
import { getResourceName } from '../../../../redux/actions/machineTypesActions';
import links from '../../../../common/installLinks.mjs';
import { normalizedProducts, billingModels } from '../../../../common/subscriptionTypes';
import { availableClustersFromQuota, availableNodesFromQuota } from '../quotaSelectors';
import './UpgradeTrialClusterDialog.scss';

class UpgradeTrialClusterDialog extends Component {
  componentDidMount() {
    const {
      organization,
      getOrganizationAndQuota,
    } = this.props;

    if (!organization.pending) {
      getOrganizationAndQuota();
    }
  }

  componentDidUpdate() {
    const {
      upgradeTrialClusterResponse, resetResponse, closeModal, onClose,
    } = this.props;
    if (upgradeTrialClusterResponse.fulfilled) {
      resetResponse();
      closeModal();
      onClose();
    }
  }

  buttonLinkClick = (link) => {
    window.open(link, '_blank');
  }

  upgradeModalQuota() {
    const {
      cluster, machineTypesByID, organization: { quotaList },
    } = this.props;
    const { OSD } = normalizedProducts;
    const { STANDARD, MARKETPLACE } = billingModels;
    const quota = {
      STANDARD: false,
      MARKETPLACE: false,
    };

    // OSD Trial is always CCS
    const isBYOC = true;
    const isMultiAz = get(cluster, 'multi_az');
    const nodeMinimum = isMultiAz ? 3 : 2;

    // convert machine type instance size to resource name for quota cost
    const machineTypeID = get(cluster, 'nodes.compute_machine_type.id');
    if (!machineTypeID) {
      return quota;
    }

    const resourceName = getResourceName(machineTypesByID[machineTypeID]);
    const cloudProviderID = get(cluster, 'cloud_provider.id');

    const quotaParams = {
      product: OSD,
      cloudProviderID,
      resourceName,
      isBYOC,
      isMultiAz,
      billingModel: STANDARD,
    };

    const standardClusters = availableClustersFromQuota(quotaList, quotaParams);
    const standardNodes = availableNodesFromQuota(quotaList, quotaParams);
    quota.STANDARD = standardNodes > nodeMinimum && standardClusters > 0;

    quotaParams.billingModel = MARKETPLACE;
    const marketClusters = availableClustersFromQuota(quotaList, quotaParams);
    const marketNodes = availableNodesFromQuota(quotaList, quotaParams);
    quota.MARKETPLACE = marketNodes > nodeMinimum && marketClusters > 0;

    return quota;
  }

  primaryButton(availableQuota) {
    const { submit, clusterID } = this.props;
    const { STANDARD, MARKETPLACE } = billingModels;
    const marketplaceQuotaEnabled = availableQuota.MARKETPLACE;
    const button = {
      primaryText: 'Contact sales',
      onPrimaryClick: () => this.buttonLinkClick('https://cloud.redhat.com/products/dedicated/contact/'),
    };

    if (availableQuota.STANDARD && !availableQuota.MARKETPLACE) {
      button.primaryText = 'Upgrade using quota';
      button.primaryLink = null;
      button.onPrimaryClick = () => submit(clusterID, STANDARD);
      return button;
    }

    if (marketplaceQuotaEnabled) {
      button.primaryText = 'Upgrade using Marketplace billing';
      button.primaryLink = null;
      button.onPrimaryClick = () => submit(clusterID, MARKETPLACE);
      return button;
    }

    return button;
  }

  secondaryButton(availableQuota) {
    const { submit, clusterID } = this.props;
    const { STANDARD } = billingModels;
    const button = {
      showSecondary: false,
    };

    button.secondaryText = 'Enable Marketplace billing';
    button.showSecondary = true;
    button.onSecondaryClick = () => this.buttonLinkClick('https://marketplace.redhat.com/en-us/products/red-hat-openshift-dedicated');

    if (availableQuota.MARKETPLACE && availableQuota.STANDARD) {
      button.secondaryText = 'Upgrade using quota';
      button.onSecondaryClick = () => submit(clusterID, STANDARD);
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
      submit, upgradeTrialClusterResponse, clusterID, shouldDisplayClusterName, clusterDisplayName,
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
        data-test-id="upgrade-trial-cluster-dialog"
        modalSize={modalSize}
        {...primaryButton}
        className="upgrade-trial-cluster-dialog"
        {...secondaryButton}
        {...tertiaryButton}
        isPending={upgradeTrialClusterResponse.pending}
      >
        <p>{error}</p>
        <Form onSubmit={() => submit(clusterID)}>
          <p>

            {!noQuota && (
              <img className="upgrade-trial-logo" src={MechTraining} alt="Red Hat" />
            )}
            Convert this trial cluster to a fully supported OpenShift Dedicated cluster.
            <br />
            <br />
            <ExternalLink href={links.OCM_DOCS_UPGRADING_OSD_TRIAL}>
              Learn more
            </ExternalLink>
            {noQuota && (
              <Alert
                variant="warning"
                isInline
                title="Your organization doesn't have enough quota to upgrade this cluster."
                className="upgrade-trial-no-quota"
              >
                <Link to="/quota">
                  <Button id="subscriptions" variant="link">
                    View your available quota
                  </Button>
                </Link>
              </Alert>
            )}
          </p>
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
};

UpgradeTrialClusterDialog.defaultProps = {
  upgradeTrialClusterResponse: {},
};

UpgradeTrialClusterDialog.modalName = modals.UPGRADE_TRIAL_CLUSTER;

export default UpgradeTrialClusterDialog;
