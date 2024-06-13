import React from 'react';

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
  Timestamp,
  TimestampTooltipVariant,
} from '@patternfly/react-core';

import { AccessRequest } from '~/types/access_transparency.v1';

type AccessRequestDetailsProps = {
  accessRequest?: AccessRequest;
  hideJustification?: boolean;
};

const AccessRequestDetails = ({ accessRequest, hideJustification }: AccessRequestDetailsProps) =>
  accessRequest ? (
    <Grid hasGutter>
      <GridItem sm={6}>
        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTerm>ID</DescriptionListTerm>
            <DescriptionListDescription>{accessRequest.id}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Subscription ID</DescriptionListTerm>
            <DescriptionListDescription>{accessRequest.subscription_id}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Cluster ID</DescriptionListTerm>
            <DescriptionListDescription>{accessRequest.cluster_id}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Requestor</DescriptionListTerm>
            <DescriptionListDescription>
              {accessRequest.requested_by || 'N/A'}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Service Request ID</DescriptionListTerm>
            <DescriptionListDescription>
              {accessRequest.support_case_id || 'N/A'}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </GridItem>
      <GridItem sm={6}>
        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTerm>Created Time</DescriptionListTerm>
            <DescriptionListDescription>
              <Timestamp
                value={accessRequest.created_at}
                tooltip={{
                  variant: TimestampTooltipVariant.custom,
                  content: (
                    <span>
                      Last updated on <Timestamp value={accessRequest.updated_at} />
                    </span>
                  ),
                }}
              />
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Expires on</DescriptionListTerm>
            <DescriptionListDescription>
              <Timestamp value={accessRequest.deadlineAt} />
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Request Duration</DescriptionListTerm>
            <DescriptionListDescription>
              <Timestamp value={accessRequest.duration} />
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </GridItem>
      {!hideJustification ? (
        <GridItem sm={12}>
          <DescriptionList>
            <DescriptionListGroup>
              <DescriptionListTerm>Justification</DescriptionListTerm>
              <DescriptionListDescription>
                <span data-testid="justification-field-value">
                  {accessRequest.justification || 'N/A'}
                </span>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </GridItem>
      ) : null}
    </Grid>
  ) : null;

export default AccessRequestDetails;
