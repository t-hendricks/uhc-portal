import * as React from 'react';
import { useField } from 'formik';

import { GridItem } from '@patternfly/react-core';

import { normalizeProductID } from '~/common/normalize';
import { billingModels } from '~/common/subscriptionTypes';
import { isMultiAZ } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import MachineTypeSelection from '~/components/clusters/common/ScaleSection/MachineTypeSelection';
import useFormikOnChange from '~/hooks/useFormikOnChange';
import { Cluster } from '~/types/clusters_mgmt.v1';

const fieldId = 'instanceType';

const forceChoiceInput = {
  input: {
    value: undefined,
    onChange: () => {},
  },
};

type InstanceTypeFieldProps = {
  cluster: Cluster;
};

const InstanceTypeField = ({ cluster }: InstanceTypeFieldProps) => {
  const [input, meta] = useField(fieldId);
  const onChange = useFormikOnChange(fieldId);

  const machineTypeField = React.useMemo(
    () => ({
      input: {
        value: input.value,
        name: input.name,
        onChange,
      },
      meta: {
        error: meta.error,
        touched: meta.touched,
      },
    }),
    [input.value, input.name, meta.error, meta.touched, onChange],
  );

  return (
    <GridItem>
      <MachineTypeSelection
        machine_type={machineTypeField}
        machine_type_force_choice={forceChoiceInput}
        isMultiAz={isMultiAZ(cluster)}
        isBYOC={!!cluster.ccs?.enabled}
        cloudProviderID={cluster.cloud_provider?.id as 'aws' | 'gcp' | undefined}
        product={normalizeProductID(cluster.product?.id)}
        isMachinePool
        billingModel={cluster.billing_model || billingModels.STANDARD}
        inModal
        menuAppendTo={document.getElementById('edit-mp-modal')}
      />
    </GridItem>
  );
};

export default InstanceTypeField;
