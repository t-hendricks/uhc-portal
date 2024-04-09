import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, Fields } from 'redux-form';

import { ExpandableSection, GridItem, Text, TextVariants, Title } from '@patternfly/react-core';

import links from '~/common/installLinks.mjs';
import { billingModels, normalizedProducts } from '~/common/subscriptionTypes';
import { required } from '~/common/validators';
import NodeCountInput from '~/components/clusters/common/NodeCountInput';
import { canSelectImds } from '~/components/clusters/wizards/rosa/constants';
import ExternalLink from '~/components/common/ExternalLink';
import { ReduxFormKeyValueList } from '~/components/common/ReduxFormComponents';

import { computeNodeHintText } from './AutoScaleSection/AutoScaleHelper';
import AutoScaleSection from './AutoScaleSection/AutoScaleSection';
import WorkerNodeVolumeSizeSection from './WorkerNodeVolumeSizeSection/WorkerNodeVolumeSizeSection';
import ImdsSection from './ImdsSection';
import MachineTypeSelection from './MachineTypeSelection';

function ScaleSection({
  isBYOC,
  isMultiAz,
  machineType,
  cloudProviderID,
  product,
  minNodesRequired,
  nodeIncrement,
  canAutoScale = false,
  autoscalingEnabled = false,
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
  hasNodeLabels = false,
}) {
  const [isNodeLabelsExpanded, setIsNodeLabelsExpanded] = useState(false);

  useEffect(() => {
    if (hasNodeLabels) setIsNodeLabelsExpanded(true);
  }, [hasNodeLabels]);

  const onChangeImds = (value) => {
    change('imds', value);
  };

  const labelsSection = isHypershift ? null : (
    <ExpandableSection
      toggleText="Add node labels"
      isExpanded={isNodeLabelsExpanded}
      onToggle={(_event, val) => setIsNodeLabelsExpanded(val)}
    >
      <Title headingLevel="h3">Node labels (optional)</Title>
      <p className="pf-v5-u-mb-md">
        Configure labels that will apply to all nodes in this machine pool.
      </p>
      <FieldArray name="node_labels" component={ReduxFormKeyValueList} />
    </ExpandableSection>
  );

  const isRosaClassicOrOsdCcs = cloudProviderID === 'aws' && !isHypershift && isBYOC;
  const imdsSection = isRosaClassicOrOsdCcs && imds && (
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
  const nonAutoScaleNodeLabel = () => {
    const label = 'Compute node count';

    if (isHypershift) {
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
          isMultiAz={isMultiAz}
          isBYOC={isBYOC}
          cloudProviderID={cloudProviderID}
          product={product}
          billingModel={billingModel}
        />
      </GridItem>
      <GridItem md={6} />
      {/* Cluster and default machine pool autoScaling (they use the same form prop) */}
      {canAutoScale && (
        <GridItem md={12}>
          <AutoScaleSection
            openEditClusterAutoScalingModal={
              isRosaClassicOrOsdCcs ? openEditClusterAutoScalingModal : undefined
            }
            autoscalingEnabled={autoscalingEnabled}
            isMultiAz={isMultiAz}
            change={change}
            autoScaleMinNodesValue={autoScaleMinNodesValue}
            autoScaleMaxNodesValue={autoScaleMaxNodesValue}
            product={product}
            isBYOC={isBYOC}
            isDefaultMachinePool={!isHypershift}
            minNodesRequired={minNodesRequired}
            isHypershiftWizard={isHypershift}
            numPools={nodeIncrement}
          />
        </GridItem>
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
              extendedHelpText={
                <>
                  {computeNodeHintText(isHypershift, false)}{' '}
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
              billingModel={billingModel}
              isHypershiftWizard={isHypershift}
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
      {/* Labels */}
      {labelsSection}
    </>
  );
}

ScaleSection.defaultProps = {
  billingModel: billingModels.STANDARD,
};

ScaleSection.propTypes = {
  isBYOC: PropTypes.bool.isRequired,
  isMultiAz: PropTypes.bool.isRequired,
  isHypershift: PropTypes.bool,
  machineType: PropTypes.string.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
  billingModel: PropTypes.oneOf(Object.values(billingModels)),
  minNodesRequired: PropTypes.number,
  nodeIncrement: PropTypes.number,
  canAutoScale: PropTypes.bool,
  hasNodeLabels: PropTypes.bool,
  autoscalingEnabled: PropTypes.bool,
  change: PropTypes.func.isRequired,
  autoScaleMinNodesValue: PropTypes.string,
  autoScaleMaxNodesValue: PropTypes.string,
  clusterVersionRawId: PropTypes.string,
  openEditClusterAutoScalingModal: PropTypes.func,
  imds: PropTypes.string,
  poolNumber: PropTypes.number,
  maxWorkerVolumeSizeGiB: PropTypes.number.isRequired,
};

export default ScaleSection;
