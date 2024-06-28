import React, { useMemo } from 'react';

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
  Text,
  Tooltip,
} from '@patternfly/react-core';

import { AccessRequest, Decision } from '~/types/access_transparency.v1';

type AccessRequestDetailsProps = {
  accessRequest?: AccessRequest;
};

const AccessRequestDetails = ({ accessRequest }: AccessRequestDetailsProps) => {
  const decision = useMemo(
    () =>
      accessRequest?.decisions?.length
        ? accessRequest.decisions[accessRequest.decisions.length - 1]
        : undefined,
    [accessRequest],
  );
  const shouldDisplayDecision = useMemo(
    () =>
      decision?.decision &&
      [Decision.decision.APPROVED, Decision.decision.DENIED].includes(decision.decision),
    [decision],
  );
  return accessRequest ? (
    <Grid hasGutter>
      <GridItem sm={8}>
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
            <DescriptionListTerm>Service Request ID</DescriptionListTerm>
            <DescriptionListDescription>
              {accessRequest.support_case_id || 'N/A'}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </GridItem>
      <GridItem sm={4}>
        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTerm>Created Time</DescriptionListTerm>
            <DescriptionListDescription>
              <Tooltip
                content={
                  <span>
                    Last updated on{' '}
                    {accessRequest.updated_at
                      ? new Date(accessRequest.updated_at).toLocaleDateString()
                      : 'N/A'}
                  </span>
                }
              >
                <Text>
                  {accessRequest.created_at
                    ? new Date(accessRequest.created_at).toLocaleDateString()
                    : 'N/A'}
                </Text>
              </Tooltip>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Respond By</DescriptionListTerm>
            <DescriptionListDescription>
              {accessRequest.deadline_at
                ? new Date(accessRequest.deadline_at).toLocaleDateString()
                : 'N/A'}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Request Duration</DescriptionListTerm>
            <DescriptionListDescription>
              {accessRequest.duration || 'N/A'}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </GridItem>
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
      {shouldDisplayDecision ? (
        <GridItem sm={12}>
          <DescriptionList>
            <DescriptionListGroup>
              <DescriptionListTerm>Decision</DescriptionListTerm>
              <DescriptionListDescription>
                <Text data-testid="decision-text">
                  <b>{decision?.decision}</b> on{' '}
                  <b>
                    {decision?.created_at
                      ? new Date(decision.created_at).toLocaleDateString()
                      : 'N/A'}
                  </b>{' '}
                  by <b>{decision?.decided_by}</b> because: {decision?.justification || 'N/A'}
                </Text>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </GridItem>
      ) : null}
    </Grid>
  ) : null;
};

export default AccessRequestDetails;
