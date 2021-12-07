import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from '@patternfly/react-core';
import FlatRadioButton from '../../../../../common/FlatRadioButton';
import { noQuotaTooltip } from '../../../../../../common/helpers';
import { billingModelConstants } from '../../CreateOSDFormConstants';

import './BillingModelRadioButtons.scss';

function BillingModelRadioButtons({
  input: { onChange },
  byocSelected,
  isRhInfraQuotaDisabled,
  isBYOCQuotaDisabled,
}) {
  const {
    standard,
    standardText,
    customerCloudSubscription,
    customerCloudSubscriptionText,
  } = billingModelConstants;
  return (
    <Flex
      direction={{ default: 'column', md: 'row' }}
      shrink={{ md: 'shrink' }}
      flexWrap={{ md: 'nowrap' }}
      className="pf-u-my-md"
    >
      <FlatRadioButton
        id={standard.toLowerCase()}
        value="false"
        isSelected={!byocSelected}
        titleText={standard}
        secondaryText={standardText}
        onChange={onChange}
        disableReason={isRhInfraQuotaDisabled && noQuotaTooltip}
      />
      <FlatRadioButton
        id={customerCloudSubscription.toLowerCase()}
        value="true"
        isSelected={!isBYOCQuotaDisabled && byocSelected}
        titleText={customerCloudSubscription}
        secondaryText={customerCloudSubscriptionText}
        onChange={onChange}
        disableReason={isBYOCQuotaDisabled && noQuotaTooltip}
      />
    </Flex>
  );
}

BillingModelRadioButtons.defaultProps = {
  byocSelected: false,
};

BillingModelRadioButtons.propTypes = {
  isRhInfraQuotaDisabled: PropTypes.bool.isRequired,
  isBYOCQuotaDisabled: PropTypes.bool.isRequired,
  input: PropTypes.shape({ onChange: PropTypes.func.isRequired }).isRequired,
  byocSelected: PropTypes.bool,
};

export default BillingModelRadioButtons;
