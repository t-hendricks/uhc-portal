import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Card, CardBody, CardTitle, Title } from '@patternfly/react-core';

import { Report } from '~/components/dashboard/CostCard/models/Report';
import { getReport, getSources } from '~/redux/actions/costActions';
import { useGlobalState } from '~/redux/hooks';

import CostEmptyState from '../../../../../dashboard/CostCard/CostEmptyState';

import CostBreakdownSummary from './CostBreakdownSummary';

import './CostBreakdownCard.scss';

type CostBreakdownCardProps = {
  clusterId?: string;
};
const CostBreakdownCard = ({ clusterId }: CostBreakdownCardProps) => {
  const dispatch = useDispatch();
  const { report, sources } = useGlobalState((state) => state.cost);

  useEffect(() => {
    dispatch(
      getReport({
        filter: {
          cluster: clusterId,
        },
      }),
    );
    dispatch(getSources({ type: 'OCP' }));
  }, [clusterId, dispatch]);

  const hasSources = useMemo(
    () => sources?.meta?.count !== undefined && sources?.meta?.count !== 0,
    [sources?.meta?.count],
  );

  return (
    <Card className="ocm--cost-breakdown-card">
      <CardTitle>
        <Title size="lg" headingLevel="h2">
          Cost breakdown
        </Title>
      </CardTitle>
      <CardBody className="ocm--cost-breakdown-card__body">
        {!hasSources && sources.fulfilled ? (
          <CostEmptyState />
        ) : (
          <CostBreakdownSummary report={report as any as Report} />
        )}
      </CardBody>
    </Card>
  );
};

export default CostBreakdownCard;
