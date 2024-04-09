import React, { useCallback, useMemo } from 'react';
import { Field, FieldArray } from 'formik';

import { Grid, GridItem } from '@patternfly/react-core';

import { FormSubnet } from '~/common/validators';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '~/components/clusters/wizards/rosa_v2/constants';
import MachinePoolSubnetsForm from '~/components/common/FormikFormComponents/MachinePoolSubnetsForm';
import { CloudVPC } from '~/types/clusters_mgmt.v1';

import VPCDropdown from '../../common/VPCDropdown/VPCDropdown';

/**
 * Machine Pools Subnets specific to Hypershift:
 * Up to 3 MP can be added, with one private subnet per MP
 * Additionally, if users select "Public" privacy, they will later have to select a public subnet
 *
 * @returns {Element}
 */
const MachinePoolsSubnets = () => {
  const {
    values: {
      [FieldId.SelectedVpc]: selectedVPC,
      [FieldId.MachinePoolsSubnets]: machinePoolsSubnets,
    },
    getFieldProps,
    setFieldValue,
    getFieldMeta,
  } = useFormState();

  const subnetWarnings = useMemo(() => {
    if (machinePoolsSubnets) {
      const privateSubnetIds = (machinePoolsSubnets as FormSubnet[])
        .map((subnet) => subnet.privateSubnetId)
        .filter((id) => !!id);

      const AZs = ((selectedVPC as CloudVPC)?.aws_subnets || [])
        .filter(
          (vpcSubnet) => vpcSubnet.subnet_id && privateSubnetIds.includes(vpcSubnet.subnet_id),
        )
        .map((vpcSubnet) => vpcSubnet.availability_zone);

      const allSubnetsInSameAz = new Set(privateSubnetIds).size > 1 && new Set(AZs).size === 1;

      return allSubnetsInSameAz
        ? `Your cluster will not be highly available because all the subnets are in the same availability zone (${AZs[0]}). To improve security and uptime, it's recommended to select subnets from different availability zones`
        : undefined;
    }
    return undefined;
  }, [machinePoolsSubnets, selectedVPC]);

  const MachinePoolSubnetsFormComponent = useCallback(
    (props) => (
      <MachinePoolSubnetsForm selectedVPC={selectedVPC} {...props} warning={subnetWarnings} />
    ),
    [selectedVPC, subnetWarnings],
  );

  return (
    <Grid hasGutter>
      <GridItem span={6}>
        <Field
          component={VPCDropdown}
          name={FieldId.SelectedVpc}
          validate={(newVPC: CloudVPC) => (newVPC?.id ? undefined : 'error')}
          selectedVPC={selectedVPC}
          showRefresh
          isHypershift
          isRosaV1={false}
          input={{
            ...getFieldProps(FieldId.SelectedVpc),
            onChange: (value: CloudVPC) => setFieldValue(FieldId.SelectedVpc, value, false),
          }}
          meta={getFieldMeta(FieldId.SelectedVpc)}
        />
      </GridItem>
      {(selectedVPC?.id || selectedVPC?.name) && (
        <FieldArray
          component={MachinePoolSubnetsFormComponent}
          name={FieldId.MachinePoolsSubnets}
        />
      )}
    </Grid>
  );
};

export default MachinePoolsSubnets;
