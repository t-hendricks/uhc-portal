import React from 'react';
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import { BillingContract, getDimensionValue } from './awsBillingAccountHelper';

const ContractInfo = ({ contract }: { contract: BillingContract }) => (
  <DescriptionList id="contract-info" isHorizontal>
    <DescriptionListGroup>
      <DescriptionListTerm>Start date:</DescriptionListTerm>
      <DescriptionListDescription>
        {contract.start_date ? (
          <DateFormat type="onlyDate" date={new Date(contract.start_date)} />
        ) : (
          'N/A'
        )}
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>End date:</DescriptionListTerm>
      <DescriptionListDescription>
        {contract.end_date ? (
          <DateFormat type="onlyDate" date={new Date(contract.end_date)} />
        ) : (
          'N/A'
        )}
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>Number of vCPUs</DescriptionListTerm>
      <DescriptionListDescription>
        {getDimensionValue(contract.dimensions, 'four_vcpu_hour')}
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>Number of clusters</DescriptionListTerm>
      <DescriptionListDescription>
        {getDimensionValue(contract.dimensions, 'control_plane')}
      </DescriptionListDescription>
    </DescriptionListGroup>
  </DescriptionList>
);

export default ContractInfo;
