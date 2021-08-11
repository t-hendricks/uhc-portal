import React from 'react';
import PropTypes from 'prop-types';

import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import {
  Label, Split, SplitItem, Title,
} from '@patternfly/react-core';
import ReportDetails from '@redhat-cloud-services/rule-components/ReportDetails';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import RefreshButton from '../../../common/RefreshButton/RefreshButton';
import getClusterName from '../../../../common/getClusterName';
import ReportActionsDropdown from './ReportActionsDropdown';
import Breadcrumbs from '../../../common/Breadcrumbs';
import { appendCrParamToDocLinks } from '../../ClusterDetails/components/Insights/helpers';

function InsightsRuleDetailsTop(props) {
  const {
    cluster,
    rule,
    pending,
    refreshFunc,
    children,
    voteOnRule,
    disableRule,
    enableRule,
  } = props;

  const clusterName = getClusterName(cluster);

  const actions = (
    <ReportActionsDropdown
      report={rule}
      disableRule={disableRule}
      enableRule={enableRule}
    />
  );

  const breadcrumbs = (
    <Breadcrumbs path={
      [
        { label: 'Clusters' },
        { label: clusterName, path: `/details/s/${cluster.subscription.id}#insights` },
        { label: rule.description },
      ]
    }
    />
  );

  return (
    <div id="cl-details-top" className="top-row">
      <Split>
        <SplitItem>
          {breadcrumbs}
        </SplitItem>
      </Split>
      <Split id="cl-details-top-row">
        <SplitItem>
          <ReportDetails
            title={(
              <Title size="lg" headingLevel="h1" className="cl-details-page-title">
                {rule.disabled && <Label className="disabled-tooltip">Disabled</Label>}
                {rule.description}
                {pending && <Spinner className="cluster-details-spinner" />}
              </Title>
            )}
            actions={(
              <span id="cl-details-btns">
                {actions}
                <RefreshButton id="refresh" ouiaId="refresh" autoRefresh refreshFunc={refreshFunc} />
              </span>
            )}
            createdAt={<DateFormat date={rule.created_at} />}
            details={appendCrParamToDocLinks(rule.details)}
            ruleId={rule.rule_id}
            totalRisk={rule.total_risk}
            riskOfChange={rule.risk_of_change}
            showRiskDescription={false}
            definitions={rule.extra_data}
            userVote={rule.user_vote}
            onFeedbackChanged={(ruleId, vote) => voteOnRule(cluster.external_id, ruleId, vote)}
          />
        </SplitItem>
      </Split>
      {children}
    </div>
  );
}

InsightsRuleDetailsTop.propTypes = {
  cluster: PropTypes.object,
  rule: PropTypes.object,
  disableRule: PropTypes.func.isRequired,
  enableRule: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  voteOnRule: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired,
  children: PropTypes.any,
};

export default InsightsRuleDetailsTop;
