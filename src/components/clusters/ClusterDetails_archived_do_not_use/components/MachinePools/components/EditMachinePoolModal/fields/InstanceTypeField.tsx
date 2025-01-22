import * as React from 'react';
import { useField } from 'formik';

import { GridItem } from '@patternfly/react-core';

import { normalizeProductID } from '~/common/normalize';
import MachineTypeSelection from '~/components/clusters/common/archived_do_not_use/ScaleSection/MachineTypeSelection';
import useFormikOnChange from '~/hooks/useFormikOnChange';
import { SubscriptionCommonFieldsCluster_billing_model as SubscriptionCommonFieldsClusterBillingModel } from '~/types/accounts_mgmt.v1';
import { Cluster } from '~/types/clusters_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

import { isMultiAZ } from '../../../../../clusterDetailsHelper';

const fieldId = 'instanceType';

const forceChoiceInput = {
  input: {
    value: undefined,
    onChange: () => {},
  },
};

type InstanceTypeFieldProps = {
  cluster: ClusterFromSubscription;
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
        billingModel={
          (cluster as Cluster).billing_model ||
          ((cluster as ClusterFromSubscription).subscription
            ?.cluster_billing_model as Cluster['billing_model']) ||
          SubscriptionCommonFieldsClusterBillingModel.standard
        }
        inModal
        menuAppendTo={document.getElementById('edit-mp-modal')}
      />
    </GridItem>
  );
};

export default InstanceTypeField;
