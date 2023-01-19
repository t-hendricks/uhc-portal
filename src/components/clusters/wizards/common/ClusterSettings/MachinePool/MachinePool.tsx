import React from 'react';
import { useDispatch } from 'react-redux';
import { Field } from 'formik';

import { Form, Grid, GridItem, Title, Text, ExpandableSection, Flex } from '@patternfly/react-core';

import { required } from '~/common/validators';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { getMachineTypes } from '~/redux/actions/machineTypesActions';
import { canAutoScaleOnCreateSelector } from '~/components/clusters/ClusterDetails/components/MachinePools/MachinePoolsSelectors';
import MachineTypeSelection from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/ScaleSection/MachineTypeSelection';
import { FieldId } from '~/components/clusters/wizards/common/constants';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { AutoScale } from './AutoScale';
import ExternalLink from '~/components/common/ExternalLink';
import { constants } from '~/components/clusters/CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import links from '~/common/installLinks.mjs';
import NodeCountInput from '~/components/clusters/common/NodeCountInput';
import { NodeLabelsFieldArray } from './NodeLabelsFieldArray';

interface MachinePoolProps {
  billingModel?: string;
}

export const MachinePool = ({ billingModel }: MachinePoolProps) => {
  const dispatch = useDispatch();
  const {
    values: {
      [FieldId.Product]: product,
      [FieldId.CloudProvider]: cloudProvider,
      [FieldId.MachineType]: machineType,
      [FieldId.AutoscalingEnabled]: autoscalingEnabled,
      [FieldId.MinReplicas]: minReplicas,
      [FieldId.MaxReplicas]: maxReplicas,
      [FieldId.MultiAz]: multiAz,
      [FieldId.Byoc]: byoc,
    },
    errors,
    getFieldProps,
    setFieldValue,
    getFieldMeta,
  } = useFormState();
  const isMultiAz = multiAz === 'true';
  const isByoc = byoc === 'true';
  const canAutoScale = useGlobalState((state) => canAutoScaleOnCreateSelector(state, product));
  const [isNodeLabelsExpanded, setIsNodeLabelsExpanded] = React.useState(false);

  const nodeLabelsExpandableSection = (
    <ExpandableSection
      toggleText="Add node labels"
      className="pf-u-mt-md"
      onToggle={(isExpanded) => setIsNodeLabelsExpanded(isExpanded)}
      isExpanded={isNodeLabelsExpanded}
    >
      <Title headingLevel="h3" className="pf-u-mb-md">
        Node labels
      </Title>

      <NodeLabelsFieldArray />
    </ExpandableSection>
  );

  // Expand Node labels section when errors exist
  React.useEffect(() => {
    if (errors[FieldId.NodeLabels]) {
      setIsNodeLabelsExpanded(true);
    }
  }, [errors[FieldId.NodeLabels]]);

  React.useEffect(() => {
    dispatch(getMachineTypes());
  }, [dispatch]);

  return (
    <Form>
      <GridItem>
        <Title headingLevel="h3">Default machine pool</Title>
        <Text component="p" className="pf-u-mt-sm">
          Select a compute node instance type and count for your default machine pool. After cluster
          creation, your selected default machine pool instance type is permanent.
        </Text>
      </GridItem>

      <Grid hasGutter md={6}>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
          <GridItem>
            <Field
              component={MachineTypeSelection}
              name={FieldId.MachineType}
              validate={required}
              isMultiAz={isMultiAz}
              isBYOC={isByoc}
              cloudProviderID={cloudProvider}
              product={product}
              isMachinePool={false}
              billingModel={billingModel}
              inModal={false}
              machine_type={{
                input: {
                  ...getFieldProps(FieldId.MachineType),
                  onChange: (value: string) => setFieldValue(FieldId.MachineType, value),
                },
                meta: getFieldMeta(FieldId.MachineType),
              }}
              machine_type_force_choice={{
                input: {
                  ...getFieldProps(FieldId.MachineTypeForceChoice),
                  onChange: (value: string) => setFieldValue(FieldId.MachineTypeForceChoice, value),
                },
              }}
            />
          </GridItem>

          {canAutoScale && (
            <>
              <GridItem>
                <AutoScale
                  autoscalingEnabled={autoscalingEnabled}
                  isMultiAz={isMultiAz}
                  autoScaleMinNodesValue={minReplicas}
                  autoScaleMaxNodesValue={maxReplicas}
                  product={product}
                  isBYOC={isByoc}
                  isDefaultMachinePool
                />
              </GridItem>
              {autoscalingEnabled && nodeLabelsExpandableSection}
            </>
          )}

          {!autoscalingEnabled && (
            <>
              <GridItem>
                <Field
                  component={NodeCountInput}
                  name={FieldId.NodesCompute}
                  label={isMultiAz ? 'Compute node count (per zone)' : 'Compute node count'}
                  isMultiAz={isMultiAz}
                  isByoc={isByoc}
                  machineType={machineType}
                  extendedHelpText={
                    <>
                      {constants.computeNodeCountHint}{' '}
                      <ExternalLink href={links.OSD_SERVICE_DEFINITION_COMPUTE}>
                        Learn more about compute node count
                      </ExternalLink>
                    </>
                  }
                  cloudProviderID={cloudProvider}
                  product={product}
                  isMachinePool
                  billingModel={billingModel}
                  input={{
                    ...getFieldProps(FieldId.NodesCompute),
                    onChange: (value: string) => setFieldValue(FieldId.NodesCompute, value),
                  }}
                />
              </GridItem>
              {nodeLabelsExpandableSection}
            </>
          )}
        </Flex>
      </Grid>
    </Form>
  );
};
