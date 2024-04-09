import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Button, FormGroup, GridItem } from '@patternfly/react-core';

import links from '~/common/installLinks.mjs';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { constants } from '~/components/clusters/common/CreateOSDFormConstants';
import { CheckboxField } from '~/components/clusters/wizards/form/CheckboxField';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '~/components/clusters/wizards/rosa_v2/constants';
import ExternalLink from '~/components/common/ExternalLink';
import { openModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import PopoverHint from '~/components/common/PopoverHint';

import { AutoScaleEnabledInputs } from './AutoScaleEnabledInputs';
import ClusterAutoScaleSettingsDialog from './ClusterAutoScaleSettingsDialog';

export const AutoScale = () => {
  const {
    values: {
      [FieldId.Hypershift]: isHypershift,
      [FieldId.Byoc]: byoc,
      [FieldId.AutoscalingEnabled]: autoscalingEnabled,
      [FieldId.Product]: product,
      [FieldId.CloudProviderId]: cloudProviderID,
    },
  } = useFormState();

  const dispatch = useDispatch();
  const openAutoScalingModal = () => dispatch(openModal(modals.EDIT_CLUSTER_AUTOSCALING_V2));

  const isRosa = product === normalizedProducts.ROSA;
  const autoScalingUrl = isRosa ? links.ROSA_AUTOSCALING : links.APPLYING_AUTOSCALING;
  const isHypershiftSelected = isHypershift === 'true';
  const isByoc = byoc === 'true';
  const isRosaClassicOrOsdCcs = useMemo(
    () => cloudProviderID === 'aws' && !isHypershiftSelected && isByoc,
    [cloudProviderID, isByoc, isHypershiftSelected],
  );

  return (
    <GridItem id="autoscaling">
      <FormGroup
        fieldId="autoscaling"
        label="Autoscaling"
        labelIcon={
          <PopoverHint
            hint={
              <>
                {constants.autoscaleHint}{' '}
                <ExternalLink href={autoScalingUrl}>
                  Learn more about autoscaling
                  {isRosa ? ' with ROSA' : ''}
                </ExternalLink>
              </>
            }
          />
        }
      />

      <CheckboxField
        name={FieldId.AutoscalingEnabled}
        label="Enable autoscaling"
        helperText={
          isRosaClassicOrOsdCcs
            ? 'The cluster autoscaler uses declarative, Kubernetes-style arguments to adjust the size of the cluster to meet its deployment needs.'
            : 'Autoscaling automatically adds and removes compute nodes from the cluster based on resource requirements.'
        }
      />

      {isRosaClassicOrOsdCcs ? (
        <GridItem md={3}>
          <Button
            data-testid="set-cluster-autoscaling-btn"
            variant="secondary"
            className="pf-v5-u-mt-md"
            onClick={openAutoScalingModal}
            isDisabled={!autoscalingEnabled}
          >
            Edit cluster autoscaling settings
          </Button>
        </GridItem>
      ) : null}
      <ClusterAutoScaleSettingsDialog isWizard isRosa={isRosa} />
      {autoscalingEnabled ? <AutoScaleEnabledInputs /> : null}
    </GridItem>
  );
};
