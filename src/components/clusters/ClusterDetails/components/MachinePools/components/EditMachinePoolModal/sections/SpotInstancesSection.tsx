import * as React from 'react';
import { Form, FormGroup, GridItem, Radio } from '@patternfly/react-core';
import { useField } from 'formik';
import PopoverHint from '~/components/common/PopoverHint';

import { EditMachinePoolValues } from '../hooks/useMachinePoolFormik';
import UseSpotInstancesField from '../fields/UseSpotInstancesField';
import MaxPriceField from '../fields/MaxPriceField';

type SpotInstancesSectionProps = {
  isEdit: boolean;
};

const SpotInstancesSection = ({ isEdit }: SpotInstancesSectionProps) => {
  const [onDemandTypeField] = useField<EditMachinePoolValues['spotInstanceType']>({
    name: 'spotInstanceType',
    value: 'onDemand',
    type: 'radio',
  });

  const [maximumTypeField] = useField<EditMachinePoolValues['spotInstanceType']>({
    name: 'spotInstanceType',
    value: 'maximum',
    type: 'radio',
  });

  return (
    <GridItem>
      <FormGroup fieldId="spotInstances" label="Cost saving" />
      <UseSpotInstancesField isDisabled={isEdit}>
        <Form>
          <Radio
            {...onDemandTypeField}
            isChecked={onDemandTypeField.checked}
            id="spotinstance-ondemand"
            onChange={(e, _) => onDemandTypeField.onChange(e)}
            label="Use On-Demand instance price"
            description="The maximum price defaults to charge up to the On-Demand Instance price."
            isDisabled={isEdit}
          />
          <Radio
            {...maximumTypeField}
            isChecked={maximumTypeField.checked}
            onChange={(e, _) => maximumTypeField.onChange(e)}
            id="spotinstance-max"
            label={
              <>
                Set maximum price{' '}
                <PopoverHint
                  headerContent="Maximum hourly price for a Spot Instance"
                  hint="This value should be lower or equal to the On-Demand Instance price. This cannot be changed after the machine pool is created."
                />
              </>
            }
            description="Specify the maximum hourly price for a Spot Instance."
            isDisabled={isEdit}
            body={maximumTypeField.checked && <MaxPriceField isEdit={isEdit} />}
          />
        </Form>
      </UseSpotInstancesField>
    </GridItem>
  );
};

export default SpotInstancesSection;
