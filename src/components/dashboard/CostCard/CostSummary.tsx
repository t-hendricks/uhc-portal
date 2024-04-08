import React from 'react';
import {
  Grid,
  GridItem,
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  Title,
} from '@patternfly/react-core';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import { PromiseReducerState } from '~/redux/types';

import CostSummaryClusters from './CostSummaryClusters';
import { getTotal } from './CostSummaryHelper';

import './CostCard.scss';
import { Report } from './models/Report';

type CostSummaryProps = {
  report: PromiseReducerState<Report>;
};

const CostSummary = ({ report }: CostSummaryProps) =>
  !report.fulfilled ? (
    <Skeleton size="md" />
  ) : (
    <Grid hasGutter>
      <GridItem lg={5} md={12}>
        <Title className="ocm--cost-total" size="2xl" headingLevel="h2">
          {getTotal(report)}
        </Title>
        <span className="ocm--cost-total__desc">Month-to-date cost</span>
      </GridItem>
      <GridItem lg={7} md={12}>
        <div className="ocm--cost-clusters">
          <TextContent>
            <TextList component={TextListVariants.dl}>
              <TextListItem component={TextListItemVariants.dt} key="top-clusters">
                Top clusters
              </TextListItem>
              <CostSummaryClusters report={report as Report} />
            </TextList>
          </TextContent>
        </div>
      </GridItem>
    </Grid>
  );

export default CostSummary;
