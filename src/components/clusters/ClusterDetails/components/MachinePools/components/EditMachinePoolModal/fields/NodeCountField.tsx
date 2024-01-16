import { FormGroup, Tooltip } from '@patternfly/react-core';
import { SelectOption as SelectOptionDeprecated } from '@patternfly/react-core/deprecated';
import { useField } from 'formik';
import * as React from 'react';
import PopoverHint from '~/components/common/PopoverHint';
import { constants } from '~/components/clusters/CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import { Cluster } from '~/types/clusters_mgmt.v1';
import { isMPoolAz } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import { normalizeProductID } from '~/common/normalize';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { noQuotaTooltip } from '~/common/helpers';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';

import useFormikOnChange from '../hooks/useFormikOnChange';
import SelectField from './SelectField';

const fieldId = 'replicas';

type NodeCountFieldProps = {
  mpAvailZones: number | undefined;
  minNodesRequired: number;
  options: number[];
  cluster: Cluster;
};

const NodeCountField = ({
  minNodesRequired,
  options,
  cluster,
  mpAvailZones,
}: NodeCountFieldProps) => {
  const [field] = useField<number>(fieldId);
  const onChange = useFormikOnChange(fieldId);
  const isMultiPoolAz = isMPoolAz(cluster, mpAvailZones);
  const optionExists = options.includes(field.value);

  React.useEffect(() => {
    // options could not be ready yet when NodeCountField renders for the first time
    if (options.length > 0 && !optionExists) {
      onChange(minNodesRequired);
    }
  }, [optionExists, minNodesRequired, onChange, options.length]);

  const notEnoughQuota = options.length < 1;

  const isRosa = normalizeProductID(cluster.product?.id) === normalizedProducts.ROSA;

  const selectField = (
    <SelectField
      value={`${field.value}`}
      fieldId={fieldId}
      onSelect={(newValue) => onChange(parseInt(newValue as string, 10))}
      isDisabled={notEnoughQuota}
    >
      {options.map((option) => (
        <SelectOptionDeprecated key={option} value={`${option}`}>
          {`${isMultiPoolAz ? option / 3 : option}`}
        </SelectOptionDeprecated>
      ))}
    </SelectField>
  );

  return (
    <FormGroup
      fieldId={fieldId}
      label={isMultiPoolAz ? 'Compute node count (per zone)' : 'Compute node count'}
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
    >
      {notEnoughQuota ? (
        <Tooltip content={noQuotaTooltip} position="right">
          {selectField}
        </Tooltip>
      ) : (
        selectField
      )}

      <FormGroupHelperText>{isMultiPoolAz && `x 3 zones = ${field.value}`}</FormGroupHelperText>
    </FormGroup>
  );
};

export default NodeCountField;
