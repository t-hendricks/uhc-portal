import PropTypes from 'prop-types';
import React from 'react';
import {
  GridItem, Title, Divider, FormGroup,
} from '@patternfly/react-core';
import { Field } from 'redux-form';
import get from 'lodash/get';

import CustomerCloudSubscriptionModal from './FormSections/BillingModelSection/CustomerCloudSubscriptionModal';
import BillingModelSection from './FormSections/BillingModelSection';
import BasicFieldsSection from './FormSections/BasicFieldsSection';
import AWSAccountDetailsSection from './FormSections/AWSAccountDetailsSection';
import NetworkingSection from './FormSections/NetworkingSection/NetworkingSection';
import ScaleSection from './FormSections/ScaleSection/ScaleSection';
import CustomerManagedEncryption from './FormSections/EncryptionSection/CustomerManagedKeyEncryption';
import { constants } from './CreateOSDFormConstants';

import UpgradeSettingsFields from '../../common/Upgrades/UpgradeSettingsFields';
import { normalizedProducts, billingModels } from '../../../../common/subscriptionTypes';
import { required, validateGCPServiceAccount } from '../../../../common/validators';

import ReduxFileUpload from '../../../common/ReduxFormComponents/ReduxFileUpload';
import ReduxCheckbox from '../../../common/ReduxFormComponents/ReduxCheckbox';
import ExternalLink from '../../../common/ExternalLink';
import UserWorkloadMonitoringSection from '../../common/UserWorkloadMonitoringSection';

import './CreateOSDForm.scss';

class CreateOSDForm extends React.Component {
  state = {
    byocSelected: false,
    isMultiAz: false,
    machineType: '',
    mode: 'basic',
  };

  toggleBYOCFields = (_, value) => {
    const { openModal, change } = this.props;
    const { isMultiAz } = this.state;

    if (value === 'true') {
      openModal('customer-cloud-subscription');
    } else {
      change('nodes_compute', isMultiAz ? '9' : '4');
      this.setState({ byocSelected: false });
    }
  };

  closeBYOCModal = () => {
    const { closeModal, change } = this.props;
    const { isMultiAz } = this.state;
    const computeNodes = isMultiAz ? '3' : '2';

    this.setState({ byocSelected: true });
    change('nodes_compute', computeNodes);
    closeModal();
  }

  handleMultiAZChange = (value) => {
    const isMultiAz = value === 'true';
    this.setState({ isMultiAz });
  };

  handleMachineTypesChange = (_, value) => {
    this.setState({ machineType: value });
  };

  toggleNetwork = (_, value) => {
    const { change } = this.props;
    if (value === 'basic') {
      change('network_machine_cidr', '');
      change('network_service_cidr', '');
      change('network_pod_cidr', '');
    }
    this.setState({ mode: value });
  };

  toggleSubscriptionBilling = (_, value) => {
    const { openModal } = this.props;
    let { billingModel } = this.props;
    const { byocSelected } = this.state;
    billingModel = !value ? billingModel : value.split('-')[0];

    // marketplace quota is currently CCS only
    if ((billingModel === billingModels.MARKETPLACE || value === 'standard-trial') && !byocSelected) {
      openModal('customer-cloud-subscription');
    }
  };

  isByocForm = () => {
    const {
      clustersQuota,
      cloudProviderID,
      getMarketplaceQuota,
      billingModel,
    } = this.props;

    const {
      byocSelected,
    } = this.state;

    const { MARKETPLACE } = billingModels;
    let hasBYOCQuota = !!get(clustersQuota, `${cloudProviderID}.byoc.totalAvailable`);
    let hasRhInfraQuota = !!get(clustersQuota, `${cloudProviderID}.rhInfra.totalAvailable`);

    if (billingModel === MARKETPLACE) {
      hasBYOCQuota = getMarketplaceQuota('byoc', cloudProviderID);
      hasRhInfraQuota = getMarketplaceQuota('rhInfra', cloudProviderID);
    }

    return hasBYOCQuota && (!hasRhInfraQuota || byocSelected);
  }

  render() {
    const {
      pending,
      change,
      openModal,
      isBYOCModalOpen,
      cloudProviderID,
      privateClusterSelected,
      product,
      isAutomaticUpgrade,
      selectedRegion,
      installToVPCSelected,
      canAutoScale,
      autoscalingEnabled,
      autoScaleMinNodesValue,
      autoScaleMaxNodesValue,
      customerManagedEncryptionSelected,
    } = this.props;
    let { billingModel } = this.props;

    const {
      isMultiAz,
      machineType,
      mode,
    } = this.state;

    const isAws = cloudProviderID === 'aws';
    const isGCP = cloudProviderID === 'gcp';

    // OSDTrial implies standard billing (not marketplace)
    if (product === normalizedProducts.OSDTrial) {
      [billingModel] = billingModel.split('-');
    }

    const isBYOCForm = this.isByocForm();
    const showAvailability = product === normalizedProducts.OSD
      || product === normalizedProducts.OSDTrial;

    return (
      <>
        {/* Billing Model */}
        <GridItem span={12}>
          <Title headingLevel="h3">Billing model</Title>
        </GridItem>
        <BillingModelSection
          openModal={openModal}
          toggleBYOCFields={this.toggleBYOCFields}
          toggleSubscriptionBilling={this.toggleSubscriptionBilling}
          byocSelected={isBYOCForm}
          pending={pending}
          product={product}
          billingModel={billingModel}
          cloudProviderID={cloudProviderID}
          change={change}
        />

        {/* BYOC modal */}
        { isBYOCModalOpen && (
          <CustomerCloudSubscriptionModal
            closeModal={this.closeBYOCModal}
            cloudProviderID={cloudProviderID}
          />
        )}

        {/* AWS account details */}
        { isAws && isBYOCForm && (
          <>
            <GridItem span={12}>
              <Title headingLevel="h3">AWS account details</Title>
            </GridItem>
            <GridItem sm={12} md={5} lg={4}>
              Before creating the cluster, review all the prerequisites in
              {' '}
              <ExternalLink href="https://www.openshift.com/dedicated/ccs">the documentation.</ExternalLink>
              {' '}
            </GridItem>
            <GridItem md={7} lg={8} />
            <AWSAccountDetailsSection pending={pending} />
          </>
        )}

        {
          isGCP && isBYOCForm && (
            <>
              <GridItem span={12}>
                <Title headingLevel="h3">GCP service account</Title>
              </GridItem>
              <GridItem span={12}>
                <p>
                  In order to create a Customer Cloud Subscription cluster, you must have a Service
                  Account in GCP named
                  {' '}
                  <code>osd-ccs-admin</code>
                  {' '}
                  that meets
                  {' '}
                  <ExternalLink href="https://www.openshift.com/dedicated/ccs">these requirements.</ExternalLink>
                  {' '}
                  Create a key for that service account, export to a file named
                  {' '}
                  <code>osServiceAccount.json</code>
                  {' '}
                  and add it here.
                </p>
              </GridItem>
              <GridItem>
                <Field
                  component={ReduxFileUpload}
                  validate={[required, validateGCPServiceAccount]}
                  name="gcp_service_account"
                  disabled={pending}
                  isRequired
                  label="Service account JSON"
                  helpText="Upload a JSON file or type to add"
                  className="pf-c-form-control"
                />
              </GridItem>
            </>
          )
        }

        {/* Basic fields - Cluster Details section */}
        <GridItem span={12}>
          <Title headingLevel="h3">Cluster details</Title>
        </GridItem>
        <BasicFieldsSection
          pending={pending}
          showDNSBaseDomain={false}
          showAvailability={showAvailability}
          change={change}
          product={product}
          billingModel={billingModel}
          isBYOC={isBYOCForm}
          cloudProviderID={cloudProviderID}
          handleCloudRegionChange={this.handleCloudRegionChange}
          handleMultiAZChangeForOldForm={this.handleMultiAZChange}
          isMultiAz={isMultiAz}
        />

        {/* Scale section */}
        <GridItem span={12}>
          <Title headingLevel="h3">Scale</Title>
          <p>
            The number and instance type of worker nodes in your cluster. After cluster creation
            you will be able to change the number of worker nodes in your cluster, but you will
            not be able to change the worker node instance type.
          </p>
        </GridItem>
        <ScaleSection
          pending={pending}
          isBYOC={isBYOCForm}
          isMultiAz={isMultiAz}
          machineType={machineType}
          handleMachineTypesChange={this.handleMachineTypesChange}
          cloudProviderID={cloudProviderID}
          product={product}
          canAutoScale={canAutoScale}
          autoscalingEnabled={autoscalingEnabled}
          change={change}
          autoScaleMinNodesValue={autoScaleMinNodesValue}
          autoScaleMaxNodesValue={autoScaleMaxNodesValue}
          billingModel={billingModel}
        />
        {/* Networking section */}
        <NetworkingSection
          mode={mode}
          toggleNetwork={this.toggleNetwork}
          showClusterPrivacy={isAws || (isGCP && isBYOCForm)}
          privateClusterSelected={privateClusterSelected}
          cloudProviderID={cloudProviderID}
          isMultiAz={isMultiAz}
          selectedRegion={selectedRegion}
          isCCS={isBYOCForm}
          installToVPCSelected={installToVPCSelected}
        />
        {/* Encryption */}
        <GridItem span={12}>
          <Title headingLevel="h3">Encryption</Title>
        </GridItem>
        <FormGroup
          fieldId="etcd_encryption"
          id="etcdEncryption"
        >
          <Field
            component={ReduxCheckbox}
            name="etcd_encryption"
            label="Enable etcd encryption"
            extendedHelpText={(
              <>
                {constants.enableEtcdHint}
                {' '}
                <ExternalLink href="https://docs.openshift.com/container-platform/latest/security/encrypting-etcd.html">Learn more about etcd</ExternalLink>
              </>
              )}
          />
          <div className="ocm-c--reduxcheckbox-description">Provide an additional layer of data security to your cluster.</div>
        </FormGroup>
        {isBYOCForm && (
          <CustomerManagedEncryption
            customerManagedEncryptionSelected={customerManagedEncryptionSelected}
            selectedRegion={selectedRegion}
            cloudProviderID={cloudProviderID}
          />
        )}
        <GridItem span={12}>
          <Divider />
        </GridItem>
        <GridItem>
          <Title headingLevel="h3">Cluster settings</Title>
        </GridItem>

        <UserWorkloadMonitoringSection parent="create" disableUVM={false} />
        <Title headingLevel="h3" className="clusterupdatespace">Cluster updates</Title>
        <UpgradeSettingsFields
          isAutomatic={isAutomaticUpgrade}
          isDisabled={pending}
        />
      </>
    );
  }
}

CreateOSDForm.defaultProps = {
  pending: false,
  isBYOCModalOpen: false,
  autoScaleMinNodesValue: '0',
  autoScaleMaxNodesValue: '0',
  billingModel: billingModels.STANDARD,
};

CreateOSDForm.propTypes = {
  pending: PropTypes.bool,
  isBYOCModalOpen: PropTypes.bool,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  clustersQuota: PropTypes.shape({
    hasProductQuota: PropTypes.bool.isRequired,
    hasMarketplaceProductQuota: PropTypes.bool,
    hasOSDTrialQuota: PropTypes.bool,
    aws: PropTypes.shape({
      byoc: PropTypes.shape({
        singleAz: PropTypes.object.isRequired,
        multiAz: PropTypes.object.isRequired,
        totalAvailable: PropTypes.number.isRequired,
      }).isRequired,
      rhInfra: PropTypes.shape({
        singleAz: PropTypes.object.isRequired,
        multiAz: PropTypes.object.isRequired,
        totalAvailable: PropTypes.number.isRequired,
      }).isRequired,
    }),
    gcp: PropTypes.shape({
      rhInfra: PropTypes.shape({
        singleAz: PropTypes.object.isRequired,
        multiAz: PropTypes.object.isRequired,
        totalAvailable: PropTypes.number.isRequired,
      }).isRequired,
    }),
    marketplace: PropTypes.object,
  }),
  billingModel: PropTypes.string,
  cloudProviderID: PropTypes.string.isRequired,
  privateClusterSelected: PropTypes.bool.isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
  isAutomaticUpgrade: PropTypes.bool,
  customerManagedEncryptionSelected: PropTypes.bool,
  selectedRegion: PropTypes.string,
  installToVPCSelected: PropTypes.bool,
  canAutoScale: PropTypes.bool.isRequired,
  autoscalingEnabled: PropTypes.bool.isRequired,
  autoScaleMinNodesValue: PropTypes.string,
  autoScaleMaxNodesValue: PropTypes.string,
  getMarketplaceQuota: PropTypes.func.isRequired,
};

export default CreateOSDForm;
