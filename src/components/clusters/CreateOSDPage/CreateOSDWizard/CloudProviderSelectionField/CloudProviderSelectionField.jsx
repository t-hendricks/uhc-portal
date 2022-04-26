import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Tile, Tooltip } from '@patternfly/react-core';
import { noQuotaTooltip } from '../../../../../common/helpers';
import AWSLogo from '../../../../../styles/images/AWSLogo';
import GCPLogo from '../../../../../styles/images/GCPLogo';
import * as osdInitialValues from '../../createOSDInitialValues';

import './CloudProviderSelectionField.scss';

function CloudProviderSelectionField({
  hasGcpQuota,
  hasAwsQuota,
  change,
  input: { value, onChange },
}) {
  const BASE_CARD_CLASS = 'ocm-tile-create-cluster';
  const getCardClass = hasQuota => cx(BASE_CARD_CLASS, !hasQuota ? 'card-disabled' : '');

  const handleChange = (providerValue) => {
    change('region', providerValue === 'aws' ? osdInitialValues.AWS_DEFAULT_REGION : osdInitialValues.GCP_DEFAULT_REGION);
    change('machine_type', '');
    change('acknowledge_prerequisites', false);
    onChange(providerValue);
  };

  const gcpCard = (
    <Tile
      className={getCardClass(hasGcpQuota, value === 'gcp')}
      onClick={() => hasGcpQuota && handleChange('gcp')}
      data-test-id="gcp-provider-card"
      title="Run on Google Cloud Platform"
      icon={<GCPLogo />}
      isDisplayLarge
      isStacked
    />
  );

  const awsCard = (
    <Tile
      className={getCardClass(hasAwsQuota, value === 'aws')}
      onClick={() => hasAwsQuota && handleChange('aws')}
      data-test-id="aws-provider-card"
      title="Run on Amazon Web Services"
      icon={<AWSLogo />}
      isDisplayLarge
      isStacked
    />
  );

  return (
    <div>
      {hasAwsQuota ? awsCard : (
        <Tooltip content={noQuotaTooltip}>
          {awsCard}
        </Tooltip>
      )}
      {hasGcpQuota ? gcpCard : (
        <Tooltip content={noQuotaTooltip}>
          {gcpCard}
        </Tooltip>
      )}
    </div>
  );
}

CloudProviderSelectionField.propTypes = {
  hasGcpQuota: PropTypes.bool.isRequired,
  hasAwsQuota: PropTypes.bool.isRequired,
  change: PropTypes.func.isRequired,
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string,
  }).isRequired,
};

export default CloudProviderSelectionField;
