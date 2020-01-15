import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import {
  FormGroup,
  GridItem,
} from '@patternfly/react-core';

import CustomerCloudSubscriptionModal from './BillingModel/CustomerCloudSubscriptionModal';
import BillingModelField from './BillingModel/BillingModelField';
import BasicFields from './BasicFields';
import AWSAccountDetailsFields from './AWSAccountDetailsFields';
import AdvancedSettingsForm from './AdvancedSettingsForm';

import RadioButtons from '../../../common/ReduxFormComponents/RadioButtons';

class CreateOSDClusterForm extends React.Component {
  state = {
    mode: 'basic',
    byocSelected: false,
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

  render() {
    const {
      pending,
      change,
      openModal,
      isBYOCModalOpen,
      quota,
    } = this.props;
    const hasBYOCQuota = quota.byoc.hasQuota;
    const hasStandardQuota = quota.rhInfra.hasQuota;

    const { mode, byocSelected } = this.state;

    const toggleNetwork = (_, value) => {
      this.setState({ mode: value });
    };

    const isBYOCForm = hasBYOCQuota && (!hasStandardQuota || byocSelected);
    const infraType = isBYOCForm ? 'byoc' : 'rhInfra';

    return (
      <>
        {/* Billing Model */}
        <GridItem span={12}>
          <h3 className="osd-page-header">Billing Model</h3>
        </GridItem>
        <BillingModelField
          openModal={openModal}
          toggleBYOCFields={this.toggleBYOCFields}
          hasBYOCquota={hasBYOCQuota}
          hasStandardQuota={hasStandardQuota}
          byocSelected={isBYOCForm}
        />

        {/* BYOC modal */}
        {isBYOCModalOpen && <CustomerCloudSubscriptionModal closeModal={this.closeBYOCModal} />}

        {/* AWS account details */}
        { isBYOCForm && (
          <>
            <GridItem span={12}>
              <h3 className="osd-page-header">AWS account details</h3>
            </GridItem>
            <AWSAccountDetailsFields pending={pending} />
          </>
        )}

        {/* Basic field - Cluster Details */}
        <GridItem span={12}>
          <h3 className="osd-page-header">Cluster Details</h3>
        </GridItem>
        <BasicFields
          pending={pending}
          showDNSBaseDomain={false}
          change={change}
          isBYOC={isBYOCForm}
          hasSingleAzQuota={quota[infraType].singleAz}
          hasMultiAzQuota={quota[infraType].multiAz}
        />

        {/* Networking section */}
        <GridItem span={12} />
        <GridItem span={4}>
          <h3>Networking</h3>
          <FormGroup
            label="Network configuration"
            isRequired
            fieldId="network-configuration-toggle"
          >
            <Field
              component={RadioButtons}
              className="network-configuration-radios"
              name="network-configuration-toggle"
              disabled={pending}
              onChange={toggleNetwork}
              options={[{
                value: 'basic',
                ariaLabel: 'Advanced',
                label: (
                  <>
                    Basic
                    <div className="radio-helptext">Creates a new VPC for your cluster using default values</div>
                  </>),
              },
              {
                value: 'advanced',
                ariaLabel: 'Advanced',
                label: (
                  <>
                    Advanced
                    <div className="radio-helptext">Allow clusters to use a new VPC with customizable addresses</div>
                  </>
                ),
              }]}
              defaultValue="basic"
            />
          </FormGroup>
        </GridItem>
        <GridItem span={8} />
        { mode === 'advanced' && <AdvancedSettingsForm pending={pending} /> }
      </>
    );
  }
}

CreateOSDClusterForm.defaultProps = {
  pending: false,
  isBYOCModalOpen: false,
};

CreateOSDClusterForm.propTypes = {
  pending: PropTypes.bool,
  isBYOCModalOpen: PropTypes.bool,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  quota: PropTypes.shape({
    byoc: PropTypes.shape({
      hasQuota: PropTypes.bool.isRequired,
      multiAz: PropTypes.bool.isRequired,
      singleAz: PropTypes.bool.isRequired,
    }).isRequired,
    rhInfra: PropTypes.shape({
      hasQuota: PropTypes.bool.isRequired,
      multiAz: PropTypes.bool.isRequired,
      singleAz: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CreateOSDClusterForm;
