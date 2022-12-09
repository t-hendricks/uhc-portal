import React from 'react';
import classNames from 'classnames';

import { Tile, Tooltip } from '@patternfly/react-core';

import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { useFormState } from '~/components/osd/hooks';
import * as osdInitialValues from '~/components/clusters/CreateOSDPage/createOSDInitialValues';
import { noQuotaTooltip } from '~/common/helpers';
import AWSLogo from '~/styles/images/AWSLogo';
import GCPLogo from '~/styles/images/GCPLogo';
import { FieldId } from '../../../constants';
import { quotaParams, hasAvailableQuota } from '../../../utils';
import { CloudProviderType } from '../types';

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
  const quotaList = useGlobalState((state) => state.userProfile.organization.quotaList);
  const hasGcpResources = hasAvailableQuota(quotaList, {
    ...quotaParams.gcpResources,
    product,
    billingModel,
    isBYOC,
  });
  const hasAwsResources = hasAvailableQuota(quotaList, {
    ...quotaParams.awsResources,
    product,
    billingModel,
    isBYOC,
  });

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
    setFieldValue(FieldId.CloudProvider, value);
  };

  const gcpTile = (
    <Tile
      className={classNames('ocm-tile-create-cluster', !hasGcpResources && 'tile-disabled')}
      onClick={() => hasGcpResources && handleChange(CloudProviderType.Gcp)}
      data-test-id="gcp-provider-card"
      title="Run on Google Cloud Platform"
      icon={<GCPLogo />}
      isDisplayLarge
      isStacked
      isSelected={cloudProvider === CloudProviderType.Gcp}
    />
  );

  const awsTile = (
    <Tile
      className={classNames('ocm-tile-create-cluster', !hasAwsResources && 'tile-disabled')}
      onClick={() => hasAwsResources && handleChange(CloudProviderType.Aws)}
      data-test-id="aws-provider-card"
      title="Run on Amazon Web Services"
      icon={<AWSLogo />}
      isDisplayLarge
      isStacked
      isSelected={cloudProvider === CloudProviderType.Aws}
    />
  );

  return (
    <div>
      {hasAwsResources ? awsTile : <Tooltip content={noQuotaTooltip}>{awsTile}</Tooltip>}
      {hasGcpResources ? gcpTile : <Tooltip content={noQuotaTooltip}>{gcpTile}</Tooltip>}
    </div>
  );
};
