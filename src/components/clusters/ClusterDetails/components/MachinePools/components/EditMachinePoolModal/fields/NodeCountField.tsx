import { FormGroup, FormSelect, FormSelectOption, Tooltip } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';
import PopoverHint from '~/components/common/PopoverHint';
import { constants } from '~/components/clusters/CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import { Cluster } from '~/types/clusters_mgmt.v1';
import { isMultiAZ } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import { normalizeProductID } from '~/common/normalize';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { noQuotaTooltip } from '~/common/helpers';
import useFormikOnChange from '../hooks/useFormikOnChange';

const fieldId = 'replicas';

type NodeCountFieldProps = {
  minNodesRequired: number;
  options: number[];
  cluster: Cluster;
};

const NodeCountField = ({ minNodesRequired, options, cluster }: NodeCountFieldProps) => {
  const [field] = useField<number>(fieldId);
  const onChange = useFormikOnChange(fieldId);

  const isMultiAz = isMultiAZ(cluster);

  const optionExists = options.includes(field.value);

  React.useEffect(() => {
    if (!optionExists) {
      onChange(minNodesRequired);
    }
  }, [optionExists, minNodesRequired, onChange]);

  const notEnoughQuota = options.length < 1;

  const isRosa = normalizeProductID(cluster.product?.id) === normalizedProducts.ROSA;

  const selectOptions = options.map((option) => (
    <FormSelectOption label={`${isMultiAz ? option / 3 : option}`} key={option} value={option} />
  ));

  return (
    <FormGroup
      fieldId={fieldId}
      label={isMultiAz ? 'Compute node count (per zone)' : 'Compute node count'}
      isRequired
      labelIcon={
        <PopoverHint
          hint={
            <>
              {constants.computeNodeCountHint}
              {isRosa && (
                <>
                  <br />
                  <ExternalLink href={links.ROSA_WORKER_NODE_COUNT}>
                    Learn more about worker/compute node count
                  </ExternalLink>
                </>
              )}
            </>
          }
        />
      }
      helperText={isMultiAz && `x 3 zones = ${field.value}`}
    >
      <FormSelect
        {...field}
        id={fieldId}
        onChange={(val, event) => {
          onChange(parseInt(val, 10));
        }}
        isDisabled={notEnoughQuota}
      >
        {notEnoughQuota ? (
          <Tooltip content={noQuotaTooltip} position="right">
            <div>{selectOptions}</div>
          </Tooltip>
        ) : (
          selectOptions
        )}
      </FormSelect>
    </FormGroup>
  );
};

export default NodeCountField;
