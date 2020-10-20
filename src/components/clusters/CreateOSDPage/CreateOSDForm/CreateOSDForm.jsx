import PropTypes from 'prop-types';
import React from 'react';
import { GridItem } from '@patternfly/react-core';
import { Field } from 'redux-form';
import get from 'lodash/get';

import CustomerCloudSubscriptionModal from './FormSections/BillingModelSection/CustomerCloudSubscriptionModal';
import BillingModelSection from './FormSections/BillingModelSection/BillingModelSection';
import BasicFieldsSection from './FormSections/BasicFieldsSection';
import AWSAccountDetailsSection from './FormSections/AWSAccountDetailsSection';
import NetworkingSection from './FormSections/NetworkingSection';
import ScaleSection from './FormSections/ScaleSection/ScaleSection';
import ReduxFileUpload from '../../../common/ReduxFormComponents/ReduxFileUpload';
import ExternalLink from '../../../common/ExternalLink';
import { required } from '../../../../common/validators';

class CreateOSDForm extends React.Component {
  state = {
    byocSelected: false,
    isMultiAz: false,
    machineType: '',
    mode: 'basic',
  };

  toggleBYOCFields = (_, value) => {
    const { openModal } = this.props;
    if (value === 'true') {
      openModal('customer-cloud-subscription');
    } else {
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

  handleMultiAZChange = (_, value) => {
    const { change } = this.props;
    const isMultiAz = value === 'true';
    let computeNodes = isMultiAz ? '9' : '4';

    if (this.isByocForm()) {
      computeNodes = isMultiAz ? '3' : '2';
    }
    this.setState({ isMultiAz });
    change('nodes_compute', computeNodes);
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

  isByocForm = () => {
    const {
      clustersQuota,
    } = this.props;

    const {
      byocSelected,
    } = this.state;

    const hasBYOCQuota = !!get(clustersQuota, 'aws.byoc.totalAvailable');
    const hasAwsRhInfraQuota = !!get(clustersQuota, 'aws.rhInfra.totalAvailable');

    return hasBYOCQuota && (!hasAwsRhInfraQuota || byocSelected);
  }

  render() {
    const {
      pending,
      change,
      openModal,
      isBYOCModalOpen,
      clustersQuota,
      cloudProviderID,
      privateClusterSelected,
      product,
      gcpCCSEnabled,
    } = this.props;

    const {
      isMultiAz,
      machineType,
      mode,
    } = this.state;

    const isAws = cloudProviderID === 'aws';
    const isGCP = cloudProviderID === 'gcp';

    const hasBYOCQuota = !!get(clustersQuota, 'aws.byoc.totalAvailable');
    const hasAwsRhInfraQuota = !!get(clustersQuota, 'aws.rhInfra.totalAvailable');

    const isBYOCForm = this.isByocForm();
    const infraType = isBYOCForm ? 'byoc' : 'rhInfra';

    return (
      <>
        {/* Billing Model */}
        {(isAws || (isGCP && gcpCCSEnabled)) && (
          <>
            <GridItem span={12}>
              <h3 className="osd-page-header">Billing model</h3>
            </GridItem>
            <BillingModelSection
              openModal={openModal}
              toggleBYOCFields={this.toggleBYOCFields}
              hasBYOCquota={hasBYOCQuota}
              hasStandardQuota={hasAwsRhInfraQuota}
              byocSelected={isBYOCForm}
            />
          </>
        )}
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
              <h3 className="osd-page-header">AWS account details</h3>
            </GridItem>
            <AWSAccountDetailsSection pending={pending} />
          </>
        )}

        {
          isGCP && isBYOCForm && (
            <>
              <GridItem span={12}>
                <h3 className="osd-page-header">GCP service account</h3>
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
                  <ExternalLink href="tbd">these requirements.</ExternalLink>
                  {' '}
                Create a key for that service account, export to a file named
                  {' '}
                  <code>osServiceAccount.json</code>
                  {' '}
                and add it here.
                </p>
              </GridItem>
              <GridItem span={4}>
                <Field
                  component={ReduxFileUpload}
                  validate={required}
                  name="gcp_service_account"
                  type="file"
                  disabled={pending}
                  isRequired
                  label="Service account JSON"
                />
              </GridItem>
            </>
          )
        }

        {/* Basic fields - Cluster Details section */}
        <GridItem span={12}>
          <h3 className="osd-page-header">Cluster details</h3>
        </GridItem>
        <BasicFieldsSection
          pending={pending}
          showDNSBaseDomain={false}
          showAvailability={product === 'osd'}
          change={change}
          isBYOC={isBYOCForm}
          cloudProviderID={cloudProviderID}
          quota={clustersQuota[cloudProviderID][infraType]}
          handleMultiAZChange={this.handleMultiAZChange}
          isMultiAz={isMultiAz}
        />

        {/* Scale section */}
        <GridItem span={12}>
          <h3>Scale</h3>
          <p>
            The number and instance type of compute nodes in your cluster. After cluster creation
            you will be able to change the number of compute nodes in your cluster, but you will
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
        />

        {/* Networking section */}
        {<NetworkingSection
          mode={mode}
          toggleNetwork={this.toggleNetwork}
          showClusterPrivacy={isAws}
          privateClusterSelected={privateClusterSelected}
          cloudProviderID={cloudProviderID}
          isMultiAz={isMultiAz}
        />}
      </>
    );
  }
}

CreateOSDForm.defaultProps = {
  pending: false,
  isBYOCModalOpen: false,
  gcpCCSEnabled: false,
};

CreateOSDForm.propTypes = {
  pending: PropTypes.bool,
  isBYOCModalOpen: PropTypes.bool,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  clustersQuota: PropTypes.shape({
    hasOsdQuota: PropTypes.bool.isRequired,
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
  }),
  cloudProviderID: PropTypes.string.isRequired,
  privateClusterSelected: PropTypes.bool.isRequired,
  product: PropTypes.string.isRequired,
  gcpCCSEnabled: PropTypes.bool,
};

export default CreateOSDForm;
