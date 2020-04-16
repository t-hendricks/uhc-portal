import PropTypes from 'prop-types';
import React from 'react';
import { GridItem } from '@patternfly/react-core';
import get from 'lodash/get';

import CustomerCloudSubscriptionModal from './FormSections/BillingModelSection/CustomerCloudSubscriptionModal';
import BillingModelSection from './FormSections/BillingModelSection/BillingModelSection';
import BasicFieldsSection from './FormSections/BasicFieldsSection';
import AWSAccountDetailsSection from './FormSections/AWSAccountDetailsSection';
import NetworkingSection from './FormSections/NetworkingSection';
import ScaleSection from './FormSections/ScaleSection/ScaleSection';

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
    const { closeModal } = this.props;
    this.setState({ byocSelected: true });
    closeModal();
  }

  handleMultiAZChange = (_, value) => {
    const { change } = this.props;
    const isMultiAz = value === 'true';
    this.setState({ isMultiAz });
    change('nodes_compute', isMultiAz ? '9' : '4');
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

  render() {
    const {
      pending,
      change,
      openModal,
      isBYOCModalOpen,
      clustersQuota,
      cloudProviderID,
    } = this.props;

    const {
      byocSelected,
      isMultiAz,
      machineType,
      mode,
    } = this.state;

    const isAws = cloudProviderID === 'aws';

    const hasBYOCQuota = !!get(clustersQuota, 'aws.byoc.totalAvailable');
    const hasAwsRhInfraQuota = !!get(clustersQuota, 'aws.rhInfra.totalAvailable');

    const isBYOCForm = isAws && hasBYOCQuota && (!hasAwsRhInfraQuota || byocSelected);
    const infraType = isBYOCForm ? 'byoc' : 'rhInfra';

    return (
      <>
        {/* Billing Model */}
        {isAws && (
          <>
            <GridItem span={12}>
              <h3 className="osd-page-header">Billing Model</h3>
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
        {isAws && isBYOCModalOpen && (
          <CustomerCloudSubscriptionModal closeModal={this.closeBYOCModal} />
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

        {/* Basic fields - Cluster Details section */}
        <GridItem span={12}>
          <h3 className="osd-page-header">Cluster Details</h3>
        </GridItem>
        <BasicFieldsSection
          pending={pending}
          showDNSBaseDomain={false}
          change={change}
          isBYOC={isBYOCForm}
          cloudProviderID={cloudProviderID}
          quota={clustersQuota[cloudProviderID][infraType]}
          handleMultiAZChange={this.handleMultiAZChange}
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
        />}
      </>
    );
  }
}

CreateOSDForm.defaultProps = {
  pending: false,
  isBYOCModalOpen: false,
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
};

export default CreateOSDForm;
