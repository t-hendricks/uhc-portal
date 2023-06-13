import React from 'react';
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { getDimensionValue } from './awsBillingAccountHelper';
import { Contract } from '~/types/accounts_mgmt.v1/models/Contract';

// eslint-disable-next-line camelcase
const ContractInfo: React.FC<Contract> = ({ start_date, end_date, dimensions }) => (
  <DescriptionList id="contract-info" isHorizontal>
    <DescriptionListGroup>
      <DescriptionListTerm>Start date:</DescriptionListTerm>
      <DescriptionListDescription>
        <DateFormat type="onlyDate" date={new Date(start_date)} />
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>End date:</DescriptionListTerm>
      <DescriptionListDescription>
        <DateFormat type="onlyDate" date={new Date(end_date)} />
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>Number of vCPUs</DescriptionListTerm>
      <DescriptionListDescription>
        {getDimensionValue(dimensions, 'four_vcpu_hour')}
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>Number of clusters</DescriptionListTerm>
      <DescriptionListDescription>
        {getDimensionValue(dimensions, 'control_plane')}
      </DescriptionListDescription>
    </DescriptionListGroup>
  </DescriptionList>
);

export default ContractInfo;
