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
    // Silently reset some user choices that are now meaningless.
    change('region', providerValue === 'aws' ? osdInitialValues.AWS_DEFAULT_REGION : osdInitialValues.GCP_DEFAULT_REGION);
    // Allow MachineTypeSelection to pick a new default.
    change('machine_type_force_choice', false);
    change('machine_type', '');
    change('acknowledge_prerequisites', false);
    onChange(providerValue);
  };

  const gcpTile = (
    <Tile
      className={`${getCardClass(hasGcpQuota, value === 'gcp')} pf-u-mb-0`}
      onClick={() => hasGcpQuota && handleChange('gcp')}
      data-test-id="gcp-provider-card"
      title="Run on Google Cloud Platform"
      icon={<GCPLogo />}
      isDisplayLarge
      isStacked
      isSelected={value === 'gcp'}
    />
  );

  const awsTile = (
    <Tile
      className={`${getCardClass(hasAwsQuota, value === 'aws')} pf-u-mb-0`}
      onClick={() => hasAwsQuota && handleChange('aws')}
      data-test-id="aws-provider-card"
      title="Run on Amazon Web Services"
      icon={<AWSLogo />}
      isDisplayLarge
      isStacked
      isSelected={value === 'aws'}
    />
  );

  return (
    <div>
      {hasAwsQuota ? awsTile : (
        <Tooltip content={noQuotaTooltip}>
          {awsTile}
        </Tooltip>
      )}
      {hasGcpQuota ? gcpTile : (
        <Tooltip content={noQuotaTooltip}>
          {gcpTile}
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
