import React, { FormEvent, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Field } from 'redux-form';

import { Form, FormGroup, FormSection, Grid, GridItem, Switch, Text } from '@patternfly/react-core';

import installLinks from '~/common/installLinks.mjs';
import {
  clusterAutoScalingValidators,
  validateListOfBalancingLabels,
  validateMaxNodes,
} from '~/common/validators';
import { getDefaultClusterAutoScaling } from '~/components/clusters/common/clusterAutoScalingValues';
import {
  AutoscalerGpuHelpText,
  AutoscalerGpuPopover,
} from '~/components/clusters/common/EditClusterAutoScalingDialog/AutoscalerGpuTooltip';
import {
  AutoscalerIgnoredLabelsHelpText,
  AutoscalerIgnoredLabelsPopover,
} from '~/components/clusters/common/EditClusterAutoScalingDialog/AutoscalerIgnoredLabelsTooltip';
import ErrorBox from '~/components/common/ErrorBox';
import { clusterAutoscalerActions } from '~/redux/actions/clusterAutoscalerActions';
import { ClusterAutoscaler } from '~/types/clusters_mgmt.v1';
import { ErrorState } from '~/types/types';

import ExternalLink from '../../../common/ExternalLink';
import Modal from '../../../common/Modal/Modal';
import modals from '../../../common/Modal/modals';
import ReduxVerticalFormGroup from '../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import MachinePoolsAutoScalingWarning from '../../ClusterDetails/components/MachinePools/MachinePoolAutoscalingWarning';

import { balancerFields, resourceLimitsFields, scaleDownFields } from './fieldDefinitions';
import { fieldItemMapper, numberParser } from './fieldItemMapper';
import { MaxNodesTotalPopoverText } from './MaxNodesTotalTooltip';

import './EditClusterAutoScalingDialog.scss';

type AutoscaleAction = 'update' | 'enable' | 'disable';

export interface EditClusterAutoScalingDialogProps {
  isOpen: boolean;
  isRosa: boolean;
  isWizard: boolean;
  pristine: boolean;
  closeModal: () => void;
  change: (fieldName: string, values: any) => void;
  onSubmitAutoScaling: (action: AutoscaleAction) => void;
  autoScalingValues: ClusterAutoscaler & { isSelected: boolean };
  autoScalingErrors: ClusterAutoscaler | {};
  hasAutoscalingMachinePools: boolean;
  editAction?: ErrorState;
  clusterId: string;
  maxNodesTotalDefault: number;
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
  isRosa,
  isWizard,
  closeModal,
  change,
  pristine,
  onSubmitAutoScaling,
  autoScalingValues,
  autoScalingErrors,
  hasAutoscalingMachinePools,
  editAction,
  clusterId,
  maxNodesTotalDefault,
}: EditClusterAutoScalingDialogProps) {
  const hasAutoScalingErrors = autoScalingErrors && Object.keys(autoScalingErrors).length > 0;
  const isScaleDownDisabled = autoScalingValues.scale_down?.enabled === false;
  const isSaving = !isWizard && editAction?.pending;
  const isScalingSelected = isWizard || autoScalingValues.isSelected;
  const isFormDisabled = !isScalingSelected || isSaving;

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(clusterAutoscalerActions.getClusterAutoscaler(clusterId));
  }, [clusterId, dispatch]);

  let primaryButtonProps = {
    text: 'Close',
    isClose: true,
    isDisabled: isWizard && hasAutoScalingErrors,
  };
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
    const defaultAutoscaler = getDefaultClusterAutoScaling(maxNodesTotalDefault);
    change('cluster_autoscaling', {
      ...defaultAutoscaler,
      isSelected: autoScalingValues.isSelected,
    });
  };

  const validateMaxNodesTotal = useCallback(
    (value: string) => validateMaxNodes(value, maxNodesTotalDefault),
    [maxNodesTotalDefault],
  );

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
          <ExternalLink
            href={
              isRosa ? installLinks.ROSA_CLUSTER_AUTOSCALING : installLinks.OSD_CLUSTER_AUTOSCALING
            }
          >
            cluster autoscaling
          </ExternalLink>{' '}
          or
          <ExternalLink href={installLinks.APPLYING_AUTOSCALING_API_DETAIL}> APIs</ExternalLink>.
        </Text>

        {!isWizard && (
          <div className="pf-v5-u-mt-md">
            <Switch
              className="pf-v5-u-ml-0 pf-v5-u-mb-md"
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
                isEnabledOnCurrentPool={false}
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
                  {/* @ts-ignore */}
                  <Field
                    component={ReduxVerticalFormGroup}
                    name="cluster_autoscaling.balancing_ignored_labels"
                    type="text"
                    disabled={isFormDisabled}
                    helpText={AutoscalerIgnoredLabelsHelpText}
                    validate={validateListOfBalancingLabels}
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
              <GridItem span={6} key="resource_limits.max_nodes_total">
                {/* @ts-ignore */}
                <Field
                  component={ReduxVerticalFormGroup}
                  name="cluster_autoscaling.resource_limits.max_nodes_total"
                  label="max-nodes-total"
                  type="number"
                  parse={numberParser(maxNodesTotalDefault as number)}
                  validate={validateMaxNodesTotal}
                  extendedHelpText={MaxNodesTotalPopoverText}
                  isRequired
                  props={{
                    disabled: isFormDisabled,
                  }}
                  helpText={
                    <span className="custom-help-text">Default value: {maxNodesTotalDefault}</span>
                  }
                />
              </GridItem>
              <GridItem span={6}>
                <FormGroup
                  fieldId="cluster_autoscaling.resource_limits.gpus"
                  label="GPUs"
                  labelIcon={<AutoscalerGpuPopover />}
                  isStack
                >
                  {/* @ts-ignore */}
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
