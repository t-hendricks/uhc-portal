import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  Card,
  CardBody,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import { noQuotaTooltip } from '../../../../../common/helpers';
import AWSLogo from '../../../../../styles/images/AWS.png';
import GCPLogo from '../../../../../styles/images/google-cloud-logo.svg';
import './CloudProviderSelectionField.scss';

function CloudProviderSelectionField({
  hasGcpQuota,
  hasAwsQuota,
  input: { value, onChange },
}) {
  const BASE_CARD_CLASS = 'infra-card create-cluster-card';
  const getCardClass = (hasQuota, isSelected) => cx(BASE_CARD_CLASS, !hasQuota ? 'card-disabled' : '', isSelected ? 'create-cluster-card-selected' : '');

  const gcpCard = (
    <Card className={getCardClass(hasGcpQuota, value === 'gcp')} onClick={() => onChange('gcp')}>
      <CardBody>
        <img src={GCPLogo} alt="GCP" className="create-cluster-logo" />
        <Title headingLevel="h5" size="lg">Run on Google Cloud Platform</Title>
      </CardBody>
    </Card>
  );

  const awsCard = (
    <Card className={getCardClass(hasAwsQuota, value === 'aws')} onClick={() => onChange('aws')}>
      <CardBody>
        <img src={AWSLogo} alt="AWS" className="create-cluster-logo" />
        <Title headingLevel="h5" size="lg">Run on Amazon Web Services</Title>
      </CardBody>
    </Card>
  );

  return (
    <div className="flex-container">
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
