import React from 'react';
import PropTypes from 'prop-types';

import FlatRadioButton from '../../../../common/FlatRadioButton';
import { billingModelConstants } from '../../CreateOSDClusterHelper';

class BillingModelRadioButtons extends React.Component {
  render() {
    const {
      hasBYOCquota, hasStandardQuota, input: { onChange }, byocSelected,
    } = this.props;

    const {
      standard,
      standardText,
      customerCloudSubscription,
      customerCloudSubscriptionText,
      noQuotaTooltip,
    } = billingModelConstants;

    return (
      <>
        <div id="billing-model" className="flat-radio-buttons-flex-container">
          <FlatRadioButton
            id={standard.toLowerCase()}
            value="false"
            isSelected={!byocSelected}
            titleText={standard}
            secondaryText={standardText}
            isDisabled={!hasStandardQuota}
            onChange={onChange}
            tooltip={!hasStandardQuota && noQuotaTooltip}
          />
          <FlatRadioButton
            id={customerCloudSubscription.toLowerCase()}
            value="true"
            isSelected={hasBYOCquota && byocSelected}
            titleText={customerCloudSubscription}
            secondaryText={customerCloudSubscriptionText}
            onChange={onChange}
            isDisabled={!hasBYOCquota}
            tooltip={!hasBYOCquota && noQuotaTooltip}
          />
        </div>
      </>
    );
  }
}

BillingModelRadioButtons.defaultProps = {
  byocSelected: false,
};

BillingModelRadioButtons.propTypes = {
  hasBYOCquota: PropTypes.bool.isRequired,
  hasStandardQuota: PropTypes.bool.isRequired,
  input: PropTypes.shape({ onChange: PropTypes.func.isRequired }).isRequired,
  byocSelected: PropTypes.bool,
};

export default BillingModelRadioButtons;
