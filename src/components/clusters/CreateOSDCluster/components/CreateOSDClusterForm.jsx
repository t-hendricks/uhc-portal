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
      hasBYOCQuota,
      hasStandardQuota,
    } = this.props;

    const { mode, byocSelected } = this.state;

    const toggleNetwork = (_, value) => {
      this.setState({ mode: value });
    };

    const isBYOCForm = hasBYOCQuota && (!hasStandardQuota || byocSelected);

    return (
      <React.Fragment>
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
          </>)
        }

        {/* Basic field - Cluster Details */}
        <GridItem span={12}>
          <h3 className="osd-page-header">Cluster Details</h3>
        </GridItem>
        <BasicFields
          pending={pending}
          showDNSBaseDomain={false}
          change={change}
          isBYOC={isBYOCForm}
        />

        {/* Networking section */}
        <GridItem span={12}>
          <h3>Networking</h3>
          <p>
            You can enable internal/external access to your cluster and choose between two
            networking options: “Basic” or “Advanced”.
          </p>
          <ul>
            <li>
              “Basic” networking creates a new VPC for your cluster using default values.
            </li>
            <li>
              “Advanced” networking allows clusters to use a new VPC with customizable addresses.
            </li>
          </ul>
        </GridItem>
        <GridItem span={4}>
          <FormGroup
            label="Network configuration"
            isRequired
            fieldId="network-configuration-toggle"
          >
            <Field
              component={RadioButtons}
              name="network-configuration-toggle"
              disabled={pending}
              onChange={toggleNetwork}
              options={[{ value: 'basic', label: 'Basic' }, { value: 'advanced', label: 'Advanced' }]}
              defaultValue="basic"
            />
          </FormGroup>
        </GridItem>
        <GridItem span={8} />
        { mode === 'advanced' && <AdvancedSettingsForm pending={pending} /> }
      </React.Fragment>
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
  hasBYOCQuota: PropTypes.bool.isRequired,
  hasStandardQuota: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
};

export default CreateOSDClusterForm;
