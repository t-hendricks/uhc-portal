import React from 'react';
import PropTypes from 'prop-types';
import { Field, Fields, FieldArray } from 'redux-form';
import {
  FormGroup,
  GridItem,
  ExpandableSection,
  Title,
  Text,
  TextVariants,
} from '@patternfly/react-core';

import { canSelectImds } from '~/components/clusters/wizards/rosa/constants';
import MachineTypeSelection from './MachineTypeSelection';
import ImdsSection from './ImdsSection';

import { ReduxFormKeyValueList, ReduxFormTaints } from '../../../../../common/ReduxFormComponents';
import PersistentStorageDropdown from '../../../../common/PersistentStorageDropdown';
import LoadBalancersDropdown from '../../../../common/LoadBalancersDropdown';
import NodeCountInput from '../../../../common/NodeCountInput';
import links from '../../../../../../common/installLinks.mjs';
import { normalizedProducts, billingModels } from '../../../../../../common/subscriptionTypes';
import { constants } from '../../CreateOSDFormConstants';

import PopoverHint from '../../../../../common/PopoverHint';
import { required } from '../../../../../../common/validators';
import ExternalLink from '../../../../../common/ExternalLink';
import AutoScaleSection from './AutoScaleSection/AutoScaleSection';
import WorkerNodeVolumeSizeSection from './WorkerNodeVolumeSizeSection/WorkerNodeVolumeSizeSection';
import { computeNodeHintText } from './AutoScaleSection/AutoScaleHelper';

function ScaleSection({
  pending,
  isBYOC,
  isMultiAz,
  machineType,
  cloudProviderID,
  product,
  showStorageAndLoadBalancers = true,
  minNodesRequired,
  nodeIncrement,
  isMachinePool = false,
  canAutoScale = false,
  autoscalingEnabled = false,
  inModal = false,
  autoScaleMinNodesValue,
  autoScaleMaxNodesValue,
  change,
  openEditClusterAutoScalingModal,
  billingModel,
  clusterVersionRawId,
  imds,
  poolNumber,
  maxWorkerVolumeSizeGiB,
  isHypershift,
  forceTouch,
}) {
  const onChangeImds = (value) => {
    change('imds', value);
  };

  const expandableSectionTitle = isMachinePool ? 'Edit node labels and taints' : 'Add node labels';

  const labelsAndTaintsSection =
    isHypershift && !inModal ? null : (
      <ExpandableSection
        toggleTextCollapsed={expandableSectionTitle}
        toggleTextExpanded={expandableSectionTitle}
      >
        <Title headingLevel="h3">Node labels (optional)</Title>
        <p className="pf-u-mb-md">
          Configure labels that will apply to all nodes in this machine pool.
        </p>
        <FieldArray name="node_labels" forceTouch={forceTouch} component={ReduxFormKeyValueList} />
        {isMachinePool && (
          <>
            <Title headingLevel="h3" className="pf-u-mb-md pf-u-mt-lg">
              Taints
            </Title>
            <FieldArray name="taints" component={ReduxFormTaints} canAddMore />
          </>
        )}
      </ExpandableSection>
    );

  const isRosaClassicOrOsdCss = cloudProviderID === 'aws' && !isHypershift && isBYOC;
  const imdsSection = isRosaClassicOrOsdCss && imds && (
    <>
      <GridItem md={8}>
        <ImdsSection
          isDisabled={!canSelectImds(clusterVersionRawId)}
          imds={imds}
          onChangeImds={onChangeImds}
        />
      </GridItem>
      <GridItem md={4} />
    </>
  );

  const isRosa = product === normalizedProducts.ROSA;

  const isHypershiftWizard = isHypershift && !inModal;
  const isAddHypershiftModal = isHypershift && inModal;
  const nonAutoScaleNodeLabel = () => {
    const label = 'Compute node count';

    if (isHypershiftWizard) {
      return `${label} (per machine pool)`;
    }

    if (isMultiAz) {
      return `${label} (per zone)`;
    }

    return label;
  };

  const workerNodeVolumeSizeSection = isRosa && !isHypershift && (
    <>
      <GridItem md={6}>
        <WorkerNodeVolumeSizeSection maxWorkerVolumeSizeGiB={maxWorkerVolumeSizeGiB} />
      </GridItem>
      <GridItem md={6} />
    </>
  );

  return (
    <>
      {/* Instance type title (only for Hypershift) */}
      {isHypershift && (
        <>
          <GridItem>
            <Title headingLevel="h3">Machine pools settings</Title>
          </GridItem>
          <GridItem md={12}>
            <Text component={TextVariants.p}>
              These settings apply to all created machine pools. After cluster creation, you can
              alter your compute machine count at any time, but your selected default machine pool
              instance type is permanent.
            </Text>
          </GridItem>
        </>
      )}
      {/* Instance type */}
      <GridItem md={6}>
        <Fields
          component={MachineTypeSelection}
          names={['machine_type', 'machine_type_force_choice']}
          validate={{ machine_type: required }}
          disabled={pending}
          isMultiAz={isMultiAz}
          isBYOC={isBYOC}
          cloudProviderID={cloudProviderID}
          product={product}
          isMachinePool={isMachinePool}
          billingModel={billingModel}
          inModal={inModal}
        />
      </GridItem>
      <GridItem md={6} />
      {/* Cluster and default machine pool autoScaling (they use the same form prop) */}
      {canAutoScale && (
        <>
          <GridItem md={12}>
            <AutoScaleSection
              openEditClusterAutoScalingModal={
                isRosaClassicOrOsdCss ? openEditClusterAutoScalingModal : undefined
              }
              autoscalingEnabled={autoscalingEnabled}
              isMultiAz={isMultiAz}
              change={change}
              autoScaleMinNodesValue={autoScaleMinNodesValue}
              autoScaleMaxNodesValue={autoScaleMaxNodesValue}
              product={product}
              isBYOC={isBYOC}
              isDefaultMachinePool={!isMachinePool && !isHypershift}
              minNodesRequired={minNodesRequired}
              isHypershiftWizard={isHypershiftWizard}
              isHypershiftMachinePool={isAddHypershiftModal}
              numPools={nodeIncrement}
            />
          </GridItem>
        </>
      )}
      {/* Worker nodes */}
      {!autoscalingEnabled && (
        <>
          <GridItem md={6}>
            <Field
              component={NodeCountInput}
              buttonAriaLabel="Compute node count information"
              name="nodes_compute"
              label={nonAutoScaleNodeLabel()}
              isMultiAz={isMultiAz}
              isByoc={isBYOC}
              machineType={machineType}
              isDisabled={pending}
              extendedHelpText={
                <>
                  {computeNodeHintText(isHypershiftWizard, isAddHypershiftModal)}{' '}
                  <ExternalLink
                    href={
                      isRosa
                        ? links.ROSA_SERVICE_DEFINITION_COMPUTE
                        : links.OSD_SERVICE_DEFINITION_COMPUTE
                    }
                  >
                    Learn more about compute node count
                  </ExternalLink>
                </>
              }
              cloudProviderID={cloudProviderID}
              product={product}
              minNodes={minNodesRequired}
              increment={nodeIncrement}
              isMachinePool={isMachinePool}
              billingModel={billingModel}
              isHypershiftWizard={isHypershiftWizard}
              poolNumber={poolNumber}
              isHypershift={isHypershift}
            />
          </GridItem>
          <GridItem md={6} />
        </>
      )}

      {/* IMDS */}
      {imdsSection}
      {/* Worker node disk size */}
      {workerNodeVolumeSizeSection}
      {/* Labels and Taints */}
      {labelsAndTaintsSection}

      {/* Persistent Storage & Load Balancers */}
      {showStorageAndLoadBalancers && !isBYOC && (
        <>
          <GridItem md={6}>
            <FormGroup
              label="Persistent storage"
              fieldId="persistent_storage"
              labelIcon={<PopoverHint hint={constants.persistentStorageHint} />}
            >
              <Field
                name="persistent_storage"
                component={PersistentStorageDropdown}
                disabled={pending}
                currentValue={null}
                cloudProviderID={cloudProviderID}
                billingModel={billingModel}
                product={product}
                isBYOC={isBYOC}
                isMultiAZ={isMultiAz}
              />
            </FormGroup>
          </GridItem>
          <GridItem md={6} />
          <GridItem md={6}>
            <FormGroup
              label="Load balancers"
              fieldId="load_balancers"
              labelIcon={<PopoverHint hint={constants.loadBalancersHint} />}
            >
              <Field
                name="load_balancers"
                component={LoadBalancersDropdown}
                disabled={pending}
                currentValue={null}
                cloudProviderID={cloudProviderID}
                billingModel={billingModel}
                product={product}
                isBYOC={isBYOC}
                isMultiAZ={isMultiAz}
              />
            </FormGroup>
          </GridItem>
          <GridItem md={6} />
        </>
      )}
    </>
  );
}

ScaleSection.defaultProps = {
  billingModel: billingModels.STANDARD,
};

ScaleSection.propTypes = {
  pending: PropTypes.bool,
  isBYOC: PropTypes.bool.isRequired,
  isMultiAz: PropTypes.bool.isRequired,
  isHypershift: PropTypes.bool,
  inModal: PropTypes.bool,
  showStorageAndLoadBalancers: PropTypes.bool,
  machineType: PropTypes.string.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
  billingModel: PropTypes.oneOf(Object.values(billingModels)),
  minNodesRequired: PropTypes.number,
  nodeIncrement: PropTypes.number,
  isMachinePool: PropTypes.bool,
  canAutoScale: PropTypes.bool,
  autoscalingEnabled: PropTypes.bool,
  change: PropTypes.func.isRequired,
  autoScaleMinNodesValue: PropTypes.string,
  autoScaleMaxNodesValue: PropTypes.string,
  clusterVersionRawId: PropTypes.string,
  openEditClusterAutoScalingModal: PropTypes.func,
  imds: PropTypes.string,
  poolNumber: PropTypes.number,
  maxWorkerVolumeSizeGiB: PropTypes.number.isRequired,
  forceTouch: PropTypes.bool,
};

export default ScaleSection;
