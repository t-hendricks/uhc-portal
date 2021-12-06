/*
 Copyright (c) 2018 Red Hat, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import {
  PageSection,
  TabContent,
  Card,
  CardBody,
  CardTitle,
  Button,
  CardFooter,
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { Markdown } from '@redhat-cloud-services/rule-components/Markdown';
import moment from 'moment';
import { EyeSlashIcon } from '@patternfly/react-icons';

import InsightsRuleDetailsTop from './components/InsightsRuleDetailsTop';
import EmptyRemediationInfo from './components/EmptyRemediationInfo';
import TabsRow from './components/TabsRow';

import Unavailable from '../../common/Unavailable';
import { isValid, scrollToTop } from '../../../common/helpers';
import getClusterName from '../../../common/getClusterName';
import { subscriptionStatuses } from '../../../common/subscriptionTypes';
import OnRuleDisableFeedbackModal from '../ClusterDetails/components/Insights/OnRuleDisableFeedbackModal/index';

class InsightsRuleDetails extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.fetchDetailsAndInsightsData = this.fetchDetailsAndInsightsData.bind(this);
    this.onRuleDisable = this.onRuleDisable.bind(this);

    this.reasonTabRef = React.createRef();
    this.resolutionTabRef = React.createRef();
    this.moreinfoTabRef = React.createRef();
  }

  componentDidMount() {
    document.title = 'Red Hat OpenShift Cluster Manager';
    scrollToTop();

    const { clearGlobalError } = this.props;

    clearGlobalError('clusterDetails');

    this.refresh();
  }

  componentDidUpdate(prevProps) {
    const {
      match,
      clusterDetails,
      fetchReportData,
    } = this.props;
    const isManagedCluster = clusterDetails?.cluster?.subscription?.managed || false;
    const externalId = clusterDetails?.cluster?.external_id || '';
    const { subscriptionID, errorKey, reportId } = match.params;
    const reportIdModified = reportId.replace(/\|/g, '.');

    if (get(clusterDetails, 'cluster.subscription.id') === subscriptionID) {
      const clusterName = getClusterName(clusterDetails.cluster);
      document.title = `${clusterName} | Red Hat OpenShift Cluster Manager`;
    }

    if (externalId && get(prevProps.clusterDetails, 'cluster.external_id') !== externalId) {
      fetchReportData(
        externalId,
        reportIdModified,
        errorKey,
        isManagedCluster,
      );
    }
  }

  onRuleDisable(ruleId) {
    const { openModal, clusterDetails, match } = this.props;
    const { errorKey } = match.params;
    const isManagedCluster = clusterDetails?.cluster?.subscription?.managed || false;
    const clusterId = clusterDetails?.cluster?.external_id || '';
    openModal('insights-on-rule-disable-feedback-modal', {
      clusterId, ruleId, errorKey, isRuleDetailsPage: true, isManagedCluster,
    });
  }

  onVoteOnRule = async (clusterUUID, ruleId, vote) => {
    const {
      voteOnRule,
      clusterDetails,
      fetchReportData,
      match,
    } = this.props;
    const isManagedCluster = clusterDetails?.cluster?.subscription?.managed || false;
    const { errorKey } = match.params;
    await voteOnRule(clusterUUID, ruleId, errorKey, vote);
    fetchReportData(clusterUUID, ruleId, errorKey, isManagedCluster);
  }

  refresh() {
    const {
      match,
      clusterDetails,
    } = this.props;
    const isManagedCluster = clusterDetails?.cluster?.subscription?.managed || false;
    const externalId = clusterDetails?.cluster?.external_id || '';
    const { subscriptionID, errorKey, reportId } = match.params;
    const reportIdModified = reportId.replace(/\|/g, '.');
    if (isValid(subscriptionID)) {
      this.fetchDetailsAndInsightsData(
        subscriptionID,
        externalId,
        reportIdModified,
        errorKey,
        isManagedCluster,
      );
    }
  }

  fetchDetailsAndInsightsData(subscriptionID, externalId, reportId, errorKey, isManaged) {
    const {
      fetchClusterDetails,
      fetchReportData,
    } = this.props;
    fetchClusterDetails(subscriptionID);
    if (externalId) {
      fetchReportData(externalId, reportId, errorKey, isManaged);
    }
  }

  render() {
    const {
      clusterDetails,
      reportDetails,
      history,
      match,
      setGlobalError,
      enableRule,
      addNotification,
    } = this.props;

    const { cluster } = clusterDetails;
    const isManagedCluster = cluster?.subscription?.managed || false;
    const externalId = cluster?.external_id || '';
    const { errorKey } = match.params;
    const requestedSubscriptionID = match.params.subscriptionID;
    const requestedReportID = match.params.reportId.replace(/\|/g, '.');

    // If the ClusterDetails screen is loaded once for one cluster, and then again for another,
    // the redux state will have the data for the previous cluster. We want to ensure we only
    // show data for the requested cluster, so different data should be marked as pending.

    const isPending = (
      ((get(cluster, 'subscription.id') !== requestedSubscriptionID) && !clusterDetails.error)
    || (get(reportDetails.report, 'rule_id') !== requestedReportID && !reportDetails.rejected));

    const errorClusterState = () => (
      <>
        <Unavailable message="Error retrieving cluster details" response={clusterDetails} />
        {isPending && <Spinner />}
      </>
    );

    const errorReportState = () => (
      <>
        <Unavailable message="Error retrieving report details" response={reportDetails} />
        {isPending && <Spinner />}
      </>
    );

    if (isPending) {
      return (
        <div id="clusterdetails-content">
          <div className="cluster-loading-container">
            <Spinner centered />
          </div>
        </div>
      );
    }

    // show a full error state only if we don't have data at all,
    // or when we only have data for a different cluster
    if (clusterDetails.error && (!cluster || get(cluster, 'id') !== requestedSubscriptionID)) {
      if (clusterDetails.errorCode === 404) {
        setGlobalError((
          <>
            Cluster with ID
            {' '}
            <b>{requestedSubscriptionID}</b>
            {' '}
            was not found, it might have been deleted or you don&apos;t have permission to see it.
          </>
        ), 'clusterDetails', clusterDetails.errorMessage);
        history.push('/');
      }
      return errorClusterState();
    }

    const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;

    // show a full error state only if we don't have data at all,
    // or when we only have data for a different cluster
    if (isArchived || (!reportDetails.pending && reportDetails.rejected)) {
      setGlobalError((
        <>
          Recommendation
          {' '}
          <b>{requestedReportID}</b>
          {' '}
          was not found,
          {' '}
          it might have been deleted or you don&apos;t have permission to see it or this page.
        </>
      ), 'clusterDetails', clusterDetails.errorMessage);
      history.push('/');
      return errorReportState();
    }

    const {
      rule_id: currentRuleId,
      disabled: isRuleDisabled,
      disable_feedback: ruleDisableFeedback,
      disabled_at: ruleDisabledAtDate,
      resolution,
      reason,
      more_info: moreInfo,
      extra_data: extraData,
    } = get(reportDetails, 'report', {});

    return (
      <PageSection id="ruledetails-content">
        <InsightsRuleDetailsTop
          cluster={cluster}
          rule={reportDetails.report}
          pending={clusterDetails.pending || reportDetails.pending}
          refreshFunc={this.refresh}
          voteOnRule={this.onVoteOnRule}
          disableRule={this.onRuleDisable}
          enableRule={ruleId => enableRule(externalId, ruleId, errorKey, true, isManagedCluster)}
        >
          {!isRuleDisabled
          && (
          <TabsRow
            reasonTabRef={this.reasonTabRef}
            resolutionTabRef={this.resolutionTabRef}
            moreinfoTabRef={this.moreinfoTabRef}
            showMoreInfo={!!moreInfo}
          />
          )}
          <OnRuleDisableFeedbackModal />
        </InsightsRuleDetailsTop>
        {
          isRuleDisabled
            ? (
              <div>
                <Card ouiaId="recommendationDisabledCard">
                  <CardTitle className="disabled-recommendation-title">Recommendation is disabled</CardTitle>
                  <CardBody>
                    <div className="disabled-recommendation-message">
                      This recommendation was disabled on
                      {` ${moment(ruleDisabledAtDate).format('DD MMM YYYY')}`}
                      {(ruleDisableFeedback && ruleDisableFeedback.length)
                        && (
                        <>
                          {' '}
                          for the following reason:
                          <i>
                            {ruleDisableFeedback}
                          </i>
                        </>
                        )}
                      .
                    </div>
                  </CardBody>
                  <CardFooter>
                    <Button
                      variant="link"
                      isInline
                      onClick={() => {
                        enableRule(externalId, currentRuleId, errorKey, true, isManagedCluster);
                        addNotification({
                          title: 'Recommendation successfully enabled',
                          variant: 'success',
                          dismissable: true,
                          dismissDelay: 4000,
                        });
                      }}
                    >
                      Enable recommendation
                    </Button>
                  </CardFooter>
                </Card>
                <EmptyState>
                  <EmptyStateIcon icon={EyeSlashIcon} />
                  <Title size="lg" headingLevel="h4">
                    Recommendation is disabled
                  </Title>
                  <EmptyStateBody>
                    This recommendation has been disabled and has no results.
                  </EmptyStateBody>
                </EmptyState>
              </div>
            )
            : (
              <div>
                <TabContent
                  eventKey={0}
                  id="resolutionTabContent"
                  ref={this.resolutionTabRef}
                  aria-label="How to remediate"
                  ouiaId="resolutionTabContent"
                >
                  <Card ouiaId="resolution">
                    <CardBody>
                      { resolution ? <Markdown template={resolution} definitions={extraData} />
                        : <EmptyRemediationInfo />}
                    </CardBody>
                  </Card>
                </TabContent>
                <TabContent
                  eventKey={1}
                  id="reasonTabContent"
                  ref={this.reasonTabRef}
                  aria-label="Reason"
                  ouiaId="reasonTabContent"
                  hidden
                >
                  <Card ouiaId="reason">
                    <CardBody>
                      { reason ? <Markdown template={reason} definitions={extraData} />
                        : <EmptyRemediationInfo />}
                    </CardBody>
                  </Card>
                </TabContent>
                {moreInfo && (
                <TabContent
                  eventKey={2}
                  id="moreinfoTabContent"
                  ref={this.moreinfoTabRef}
                  aria-label="Additional info"
                  ouiaId="moreinfoTabContent"
                  hidden
                >
                  <Card ouiaId="moreinfo">
                    <CardBody>
                      <Markdown template={moreInfo} definitions={extraData} />
                    </CardBody>
                  </Card>
                </TabContent>
                )}
              </div>
            )
        }
      </PageSection>
    );
  }
}

InsightsRuleDetails.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchReportData: PropTypes.func.isRequired,
  fetchClusterDetails: PropTypes.func.isRequired,
  clearGlobalError: PropTypes.func.isRequired,
  setGlobalError: PropTypes.func.isRequired,
  enableRule: PropTypes.func.isRequired,
  reportDetails: PropTypes.object,
  clusterDetails: PropTypes.shape({
    cluster: PropTypes.shape({
      external_id: PropTypes.string,
      subscription: PropTypes.shape({
        managed: PropTypes.bool,
      }),
    }),
    error: PropTypes.bool,
    errorCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    errorMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.element,
    ]),
    fulfilled: PropTypes.bool,
    history: PropTypes.object,
    pending: PropTypes.bool.isRequired,
  }),
  voteOnRule: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
};

InsightsRuleDetails.defaultProps = {
  reportDetails: {},
  clusterDetails: {},
};

export default InsightsRuleDetails;
