import React, { FormEvent } from 'react';
import { Form, FormGroup, FormSection, Grid, GridItem, Switch, Text } from '@patternfly/react-core';

import { ClusterAutoscaler } from '~/types/clusters_mgmt.v1';
import installLinks from '~/common/installLinks.mjs';
import { getDefaultClusterAutoScaling } from '~/components/clusters/CreateOSDPage/clusterAutoScalingValues';
import ErrorBox from '~/components/common/ErrorBox';
import { ErrorState } from '~/types/types';
import { Field } from 'redux-form';
import {
  AutoscalerGpuHelpText,
  AutoscalerGpuPopover,
} from '~/components/clusters/common/EditClusterAutoScalingDialog/AutoscalerGpuTooltip';
import { clusterAutoScalingValidators, validateListOfLabels } from '~/common/validators';
import {
  AutoscalerIgnoredLabelsHelpText,
  AutoscalerIgnoredLabelsPopover,
} from '~/components/clusters/common/EditClusterAutoScalingDialog/AutoscalerIgnoredLabelsTooltip';
import MachinePoolsAutoScalingWarning from '../../ClusterDetails/components/MachinePools/MachinePoolAutoscalingWarning';
import Modal from '../../../common/Modal/Modal';
import modals from '../../../common/Modal/modals';
import ExternalLink from '../../../common/ExternalLink';

import { balancerFields, resourceLimitsFields, scaleDownFields } from './fieldDefinitions';
import { fieldItemMapper } from './fieldItemMapper';
import ReduxVerticalFormGroup from '../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

import './EditClusterAutoScalingDialog.scss';

type AutoscaleAction = 'update' | 'enable' | 'disable';

export interface EditClusterAutoScalingDialogProps {
  isOpen: boolean;
  isWizard: boolean;
  pristine: boolean;
  closeModal: () => void;
  change: (fieldName: string, values: any) => void;
  onSubmitAutoScaling: (action: AutoscaleAction) => void;
  autoScalingValues: ClusterAutoscaler & { isSelected: boolean };
  autoScalingErrors: ClusterAutoscaler | {};
  hasAutoscalingMachinePools: boolean;
  editAction?: ErrorState;
}

/**
  This component is used in two different cases:
  1. In Day1 flow of ROSA classic clusters
   - Users enable the cluster autoscaler settings, and can open the modal by clicking the button for it
   - They can change the settings, and the data is stored in the form fields to be used in cluster submit time

  2. In Day2 flow or ROSA classic / OSD clusters
   - Users can open the modal by clicking the button for it in the "MachinePools" tab
   - They can apply changes to the existing cluster autoscaler. The submit actions perform async updates to it.
 */
function EditClusterAutoScalingDialog({
  isOpen,
  isWizard,
  closeModal,
  change,
  pristine,
  onSubmitAutoScaling,
  autoScalingValues,
  autoScalingErrors,
  hasAutoscalingMachinePools,
  editAction,
}: EditClusterAutoScalingDialogProps) {
  const hasAutoScalingErrors = autoScalingErrors && Object.keys(autoScalingErrors).length > 0;
  const isScaleDownDisabled = autoScalingValues.scale_down?.enabled === false;
  const isSaving = !isWizard && editAction?.pending;
  const isScalingSelected = isWizard || autoScalingValues.isSelected;
  const isFormDisabled = !isScalingSelected || isSaving;

  let primaryButtonProps = { text: 'Close', isClose: true, isDisabled: false };
  if (isSaving) {
    primaryButtonProps = { text: 'Saving...', isClose: false, isDisabled: true };
  } else if (!isWizard && autoScalingValues.isSelected && !pristine) {
    primaryButtonProps = { text: 'Save', isClose: false, isDisabled: hasAutoScalingErrors };
  }

  const handlePrimaryClick = (e?: FormEvent<HTMLFormElement>) => {
    if (primaryButtonProps.isClose) {
      closeModal();
    } else {
      onSubmitAutoScaling('update');
    }
    if (e) {
      e.preventDefault();
    }
  };

  const toggleClusterAutoScaling = () => {
    if (isWizard) {
      change('autoscalingEnabled', false);
    } else {
      onSubmitAutoScaling(isScalingSelected ? 'disable' : 'enable');
    }
  };

  const handleReset = () => {
    const defaultAutoscaler = getDefaultClusterAutoScaling();
    change('cluster_autoscaling', {
      ...defaultAutoscaler,
      isSelected: autoScalingValues.isSelected,
    });
  };

  return (
    <Modal
      variant="large"
      isOpen={isOpen}
      title="Edit cluster autoscaling settings"
      data-testid="cluster-autoscaling-dialog"
      primaryText={primaryButtonProps.text}
      secondaryText="Revert all to defaults"
      tertiaryText="Cancel"
      onPrimaryClick={handlePrimaryClick}
      onSecondaryClick={handleReset}
      onTertiaryClick={closeModal}
      isPrimaryDisabled={primaryButtonProps.isDisabled}
      isSecondaryDisabled={!isScalingSelected || isSaving}
      showClose={!isWizard && !isSaving}
      showTertiary={!isWizard}
      onClose={closeModal}
    >
      <>
        <Text component="p">
          The cluster autoscaler adjusts the size of a cluster to meet its current deployment needs.
          Learn more about{' '}
          <ExternalLink href={installLinks.APPLYING_AUTOSCALING}>cluster autoscaling</ExternalLink>{' '}
          or
          <ExternalLink href={installLinks.APPLYING_AUTOSCALING_API_DETAIL}> APIs</ExternalLink>.
        </Text>

        {!isWizard && (
          <div className="pf-u-mt-md">
            <Switch
              className="pf-u-ml-0 pf-u-mb-md"
              label="Autoscale cluster"
              labelOff="Autoscale cluster"
              isChecked={isScalingSelected}
              hasCheckIcon
              isDisabled={isSaving}
              onChange={toggleClusterAutoScaling}
            />
            {editAction?.error ? (
              <ErrorBox message="Failed to update autoscaler" response={editAction} />
            ) : (
              <MachinePoolsAutoScalingWarning
                hasClusterAutoScaler={isScalingSelected}
                hasAutoscalingMachinePools={hasAutoscalingMachinePools}
                warningType="clusterView"
              />
            )}
          </div>
        )}

        <Form onSubmit={handlePrimaryClick} className="cluster-autoscaling-form">
          <FormSection
            title="General settings"
            className={isWizard ? '' : 'autoscaler-inner-section'}
          >
            <Grid hasGutter>
              {balancerFields.map((field) => (
                <GridItem span={6} key={field.name}>
                  {fieldItemMapper(field, isFormDisabled)}
                </GridItem>
              ))}
              <GridItem span={6}>
                <FormGroup
                  fieldId="cluster_autoscaling.balancing_ignored_labels"
                  label="balancing-ignored-labels"
                  labelIcon={<AutoscalerIgnoredLabelsPopover />}
                  isStack
                >
                  <Field
                    component={ReduxVerticalFormGroup}
                    name="cluster_autoscaling.balancing_ignored_labels"
                    type="text"
                    disabled={isFormDisabled}
                    helpText={AutoscalerIgnoredLabelsHelpText}
                    validate={validateListOfLabels}
                  />
                </FormGroup>
              </GridItem>
            </Grid>
          </FormSection>
          <FormSection
            title="Resource limits"
            className={isWizard ? '' : 'autoscaler-inner-section'}
          >
            <Grid hasGutter>
              {resourceLimitsFields.map((field) => (
                <GridItem span={6} key={field.name}>
                  {fieldItemMapper(field, isFormDisabled)}
                </GridItem>
              ))}
              <GridItem span={6}>
                <FormGroup
                  fieldId="cluster_autoscaling.resource_limits.gpus"
                  label="GPUs"
                  labelIcon={<AutoscalerGpuPopover />}
                  isStack
                >
                  <Field
                    component={ReduxVerticalFormGroup}
                    name="cluster_autoscaling.resource_limits.gpus"
                    type="text"
                    disabled={isFormDisabled}
                    helpText={AutoscalerGpuHelpText}
                    validate={clusterAutoScalingValidators.k8sGpuParameter}
                  />
                </FormGroup>
              </GridItem>
            </Grid>
          </FormSection>
          <FormSection
            title="Scale down configuration"
            className={isWizard ? '' : 'autoscaler-inner-section'}
          >
            <Grid hasGutter>
              {scaleDownFields.map((field) => {
                const isFieldDisabled =
                  isFormDisabled || (isScaleDownDisabled && field.name !== 'scale_down.enabled');
                return (
                  <GridItem span={6} key={field.name}>
                    {fieldItemMapper(field, isFieldDisabled)}
                  </GridItem>
                );
              })}
            </Grid>
          </FormSection>
        </Form>
      </>
    </Modal>
  );
}

EditClusterAutoScalingDialog.modalName = modals.EDIT_CLUSTER_AUTOSCALING_V1;

export default EditClusterAutoScalingDialog;
