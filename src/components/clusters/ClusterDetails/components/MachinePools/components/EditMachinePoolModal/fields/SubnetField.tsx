import * as React from 'react';
import { Alert, Spinner } from '@patternfly/react-core';
import { useField } from 'formik';

import { Cluster } from '~/types/clusters_mgmt.v1';
import { SubnetSelectField } from '~/components/clusters/common/SubnetSelectField';
import { useAWSVPCFromCluster } from '~/components/clusters/common/useAWSVPCFromCluster';
import useFormikOnChange from '~/hooks/useFormikOnChange';

const fieldId = 'subnet';

const SubnetField = ({ cluster }: { cluster: Cluster }) => {
  const [inputField, metaField] = useField(fieldId);
  const onChange = useFormikOnChange(fieldId);

  const { clusterVpc, isLoading, hasError } = useAWSVPCFromCluster(cluster);

  const fieldProps = React.useMemo(
    () => ({
      input: {
        onChange,
        value: inputField.value,
        name: inputField.name,
      },
      meta: {
        error: metaField.touched ? metaField.error : undefined,
        touched: metaField.touched,
      },
    }),
    [inputField.value, inputField.name, metaField.error, metaField.touched, onChange],
  );

  if (isLoading) {
    return <Spinner size="md">Loading the cluster VPC</Spinner>;
  }

  if (!clusterVpc || hasError) {
    return (
      <Alert
        variant="danger"
        isInline
        isPlain
        title="Failed to load the machine pool VPC. Please try refreshing the page."
        className="pf-v5-u-mb-sm"
      />
    );
  }

  return (
    <SubnetSelectField
      name="subnet"
      privacy="private"
      label="Private subnet name"
      isRequired
      selectedVPC={clusterVpc}
      {...fieldProps}
    />
  );
};

export default SubnetField;
