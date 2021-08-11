import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_Color_dark_200 } from '@patternfly/react-tokens';

import ChartByRisks from './ChartByRisks';
import ChartByGroups from './ChartByGroups';
import AdvisorEmptyState from './AdvisorEmptyState';

import './InsightsAdvisorCard.scss';

const InsightsAdvisorCard = ({ overview, groups }) => (
  <Card className="ocm-insights--advisor-card" ouiaId="insightsAdvisor">
    <CardBody className="ocm-insights--advisor-card__body">
      {!overview.clusters_hit || overview.clusters_hit === 0 ? (
        <AdvisorEmptyState />
      ) : (
        <>
          <ChartByRisks riskHits={overview.hit_by_risk} />
          <ChartByGroups tagHits={overview.hit_by_tag} groups={groups} />
          <div className="ocm-insights--advisor-notice">
            <QuestionCircleIcon
              className="ocm-insights--advisor-notice__icon"
              color={global_Color_dark_200.value}
            />
            {' '}
            Advisor information applies for OCP clusters only
          </div>
        </>
      )}
    </CardBody>
  </Card>
);

export default InsightsAdvisorCard;

InsightsAdvisorCard.propTypes = {
  overview: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
};
