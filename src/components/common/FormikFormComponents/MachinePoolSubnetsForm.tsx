import React, { useEffect } from 'react';
import { Field } from 'formik';

import { Alert, Button, Grid, GridItem } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';

import { FormSubnet, validateMultipleMachinePoolsSubnets } from '~/common/validators';
import { SubnetSelectField } from '~/components/clusters/common/SubnetSelectField';
import { emptyAWSSubnet } from '~/components/clusters/wizards/common/createOSDInitialValues';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '~/components/clusters/wizards/rosa_v2/constants';
import { CloudVPC } from '~/types/clusters_mgmt.v1';

import './MachinePoolSubnetsForm.scss';

type MachinePoolSubnetsFormProps = {
  selectedVPC?: CloudVPC;
  warning?: string;
};

const MachinePoolSubnetsForm = ({ selectedVPC, warning }: MachinePoolSubnetsFormProps) => {
  const {
    values: { [FieldId.MachinePoolsSubnets]: machinePoolsSubnets },
    getFieldProps,
    setFieldValue,
    getFieldMeta,
  } = useFormState();

  const addMachinePool = (machinePoolSubnet: FormSubnet) =>
    setFieldValue(FieldId.MachinePoolsSubnets, [...machinePoolsSubnets, machinePoolSubnet], false);

  const removeMachinePool = (machinePoolsSubnetsIndex: number) =>
    setFieldValue(
      FieldId.MachinePoolsSubnets,
      (machinePoolsSubnets as FormSubnet[]).filter((e, i) => i !== machinePoolsSubnetsIndex),
    );

  const selectSubnet = (machinePoolIndex: number, subnetId: string) => {
    const newMachinePoolsSubnet = (machinePoolsSubnets as FormSubnet[]).map(
      (machinePoolSubnet, index) =>
        index === machinePoolIndex
          ? { ...machinePoolSubnet, privateSubnetId: subnetId }
          : machinePoolSubnet,
    );
    setFieldValue(FieldId.MachinePoolsSubnets, newMachinePoolsSubnet, false);
  };

  useEffect(() => {
    if (machinePoolsSubnets === undefined) {
      setFieldValue(FieldId.MachinePoolsSubnets, [emptyAWSSubnet()]);
    }
  }, [machinePoolsSubnets, setFieldValue]);

  return (
    <Grid hasGutter>
      {warning && (
        <GridItem>
          <Alert variant="warning" isPlain isInline title={warning} />
        </GridItem>
      )}
      <GridItem span={2} className="pf-v5-c-form__label pf-v5-c-form__label-text">
        Machine pool
      </GridItem>
      <GridItem span={4} className="pf-v5-c-form__label pf-v5-c-form__label-text">
        Private subnet name
      </GridItem>
      <GridItem span={6} />

      {(machinePoolsSubnets as FormSubnet[])?.map((_, index) => {
        const isRemoveDisabled = machinePoolsSubnets.length === 1;
        const fieldNameSubnetId = `${FieldId.MachinePoolsSubnets}[${index}].privateSubnetId`;
        return selectedVPC ? (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={`${machinePoolsSubnets.indexOf(index).privateSubnetId}_${index}`}>
            <GridItem span={2}>Machine pool {index + 1}</GridItem>
            <GridItem span={4}>
              <Field
                component={SubnetSelectField}
                name={fieldNameSubnetId}
                validate={(subnetId: string) =>
                  validateMultipleMachinePoolsSubnets(
                    subnetId,
                    { machinePoolsSubnets },
                    { pristine: getFieldMeta(fieldNameSubnetId)?.touched },
                  )
                }
                isRequired
                privacy="private"
                selectedVPC={selectedVPC}
                withAutoSelect={false}
                isNewCluster
                input={{
                  ...getFieldProps(fieldNameSubnetId),
                  onChange: (subnetId: string) => {
                    setFieldValue(fieldNameSubnetId, subnetId);
                    selectSubnet(index, subnetId);
                  },
                }}
                meta={getFieldMeta(fieldNameSubnetId)}
              />
            </GridItem>
            <GridItem span={1}>
              <Button
                onClick={() => removeMachinePool(index)}
                icon={<MinusCircleIcon />}
                variant="link"
                isDisabled={isRemoveDisabled}
                className={
                  isRemoveDisabled
                    ? 'machinePoolSubnetsForm-removeBtn-disabled'
                    : 'machinePoolSubnetsForm-removeBtn'
                }
              />
            </GridItem>
            <GridItem span={5} />
          </React.Fragment>
        ) : null;
      })}
      <GridItem>
        <Button
          onClick={() => addMachinePool(emptyAWSSubnet())}
          icon={<PlusCircleIcon />}
          variant="link"
          isInline
          className="machinePoolSubnetsForm-addBtn"
          isDisabled={!selectedVPC?.id}
        >
          Add machine pool
        </Button>
      </GridItem>
    </Grid>
  );
};

export default MachinePoolSubnetsForm;
