import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Tile, Tooltip } from '@patternfly/react-core';
import { noQuotaTooltip } from '../../../../../common/helpers';
import AWSLogo from '../../../../../styles/images/AWSLogo';
import GCPLogo from '../../../../../styles/images/GCPLogo';
import './CloudProviderSelectionField.scss';

function CloudProviderSelectionField({
  hasGcpQuota,
  hasAwsQuota,
  input: { value, onChange },
}) {
  const BASE_CARD_CLASS = 'ocm-tile-create-cluster';
  const getCardClass = hasQuota => cx(BASE_CARD_CLASS, !hasQuota ? 'card-disabled' : '');

  const gcpCard = (
    <Tile
      className={getCardClass(hasGcpQuota, value === 'gcp')}
      onClick={() => hasGcpQuota && onChange('gcp')}
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
      onClick={() => hasAwsQuota && onChange('aws')}
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
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string,
  }).isRequired,
};

export default CloudProviderSelectionField;
