import React from 'react';
import classNames from 'classnames';

import { Tile, Tooltip } from '@patternfly/react-core';

import { noQuotaTooltip } from '~/common/helpers';
import { billingModels } from '~/common/subscriptionTypes';
import { CloudProviderType } from '~/components/clusters/wizards/common/constants';
import * as osdInitialValues from '~/components/clusters/wizards/common/createOSDInitialValues';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { useGetBillingQuotas } from '~/components/clusters/wizards/osd/BillingModel/useGetBillingQuotas';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import AWSLogo from '~/styles/images/AWSLogo';
import GCPLogo from '~/styles/images/GCPLogo';

import './cloudProviderTileField.scss';

export const CloudProviderTileField = () => {
  const {
    values: {
      [FieldId.CloudProvider]: cloudProvider,
      [FieldId.Product]: product,
      [FieldId.BillingModel]: billingModel,
      [FieldId.Byoc]: isBYOC,
    },
    setFieldValue,
  } = useFormState();
  const quotas = useGetBillingQuotas({
    product,
    billingModel,
    isBYOC,
  });
  const hasGcpResources = quotas.gcpResources;
  const hasAwsResources =
    billingModel === billingModels.MARKETPLACE_GCP ? false : quotas.awsResources;
  const notAvailableTooltip =
    billingModel === billingModels.MARKETPLACE_GCP
      ? 'OpenShift Dedicated purchased through the Google Cloud marketplace can only be provisioned on GCP.'
      : noQuotaTooltip;

  const handleChange = (value: string) => {
    // Silently reset some user choices that are now meaningless.
    setFieldValue(
      FieldId.Region,
      value === CloudProviderType.Aws
        ? osdInitialValues.AWS_DEFAULT_REGION
        : osdInitialValues.GCP_DEFAULT_REGION,
    );

    // Allow MachineTypeSelection to pick a new default.
    setFieldValue(FieldId.MachineTypeForceChoice, false);
    setFieldValue(FieldId.MachineType, '');
    setFieldValue(FieldId.AcknowledgePrereq, false);
    setFieldValue(FieldId.FipsCryptography, false);
    setFieldValue(FieldId.CloudProvider, value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleChange(event.currentTarget.id);
    }
  };

  const gcpTile = (
    <Tile
      id={CloudProviderType.Gcp}
      className={classNames('ocm-tile-create-cluster', !hasGcpResources && 'tile-disabled')}
      onClick={() => hasGcpResources && handleChange(CloudProviderType.Gcp)}
      onKeyDown={handleKeyDown}
      isDisabled={!hasGcpResources}
      data-testid="gcp-provider-card"
      title="Run on Google Cloud Platform"
      icon={<GCPLogo />}
      isDisplayLarge
      isStacked
      isSelected={cloudProvider === CloudProviderType.Gcp}
    />
  );

  const awsTile = (
    <Tile
      id={CloudProviderType.Aws}
      className={classNames('ocm-tile-create-cluster', !hasAwsResources && 'tile-disabled')}
      onClick={() => hasAwsResources && handleChange(CloudProviderType.Aws)}
      onKeyDown={handleKeyDown}
      isDisabled={!hasAwsResources}
      data-testid="aws-provider-card"
      title="Run on Amazon Web Services"
      icon={<AWSLogo />}
      isDisplayLarge
      isStacked
      isSelected={cloudProvider === CloudProviderType.Aws}
    />
  );

  return (
    <div role="listbox" aria-label="Providers options">
      {hasAwsResources ? awsTile : <Tooltip content={notAvailableTooltip}>{awsTile}</Tooltip>}
      {hasGcpResources ? gcpTile : <Tooltip content={noQuotaTooltip}>{gcpTile}</Tooltip>}
    </div>
  );
};
