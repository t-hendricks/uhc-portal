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
import isUuid from 'uuid-validate';
import { Redirect } from 'react-router';
import get from 'lodash/get';

import {
  EmptyState,
  PageSection,
  TabContent,
  Card,
  CardBody,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import { Markdown } from '@redhat-cloud-services/rule-components/dist/cjs/index';

import InsightsRuleDetailsTop from './components/InsightsRuleDetailsTop';
import TabsRow from './components/TabsRow';

import ErrorBox from '../../common/ErrorBox';
import { isValid, scrollToTop } from '../../../common/helpers';
import getClusterName from '../../../common/getClusterName';
import { subscriptionStatuses } from '../../../common/subscriptionTypes';

class InsightsRuleDetails extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.fetchDetailsAndInsightsData = this.fetchDetailsAndInsightsData.bind(this);

    this.reasonTabRef = React.createRef();
    this.resolutionTabRef = React.createRef();
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
    const clusterID = match.params.clusterId;
    const oldClusterID = prevProps.match.params.clusterId;
    const externalId = get(clusterDetails, 'cluster.external_id');
    const reportID = match.params.reportId.replace(/\|/g, '.');

    if (get(clusterDetails, 'cluster.id') === clusterID) {
      const clusterName = getClusterName(clusterDetails.cluster);
      document.title = `${clusterName} | Red Hat OpenShift Cluster Manager`;
    }

    if (clusterID !== oldClusterID && isValid(clusterID)) {
      this.refresh();
    }

    if (
      get(clusterDetails, 'cluster.external_id')
      && get(prevProps.clusterDetails, 'cluster.external_id') !== externalId
    ) {
      fetchReportData(get(clusterDetails, 'cluster.external_id'), reportID);
    }
  }

  refresh() {
    const {
      match,
      clusterDetails,
    } = this.props;
    const clusterID = match.params.clusterId;
    const reportID = match.params.reportId.replace(/\|/g, '.');
    if (isValid(clusterID)) {
      this.fetchDetailsAndInsightsData(clusterID, get(clusterDetails, 'cluster.external_id'), reportID);
    }
  }

  fetchDetailsAndInsightsData(clusterId, externalId, reportId) {
    const {
      fetchClusterDetails,
      fetchReportData,
    } = this.props;
    fetchClusterDetails(clusterId);
    if (externalId) {
      fetchReportData(externalId, reportId);
    }
  }

  render() {
    const {
      clusterDetails,
      reportDetails,
      history,
      match,
      voteOnRule,
      setGlobalError,
      disableRule,
      enableRule,
    } = this.props;

    const { cluster } = clusterDetails;

    // InsightsRuleDetails can be entered via normal id from OCM, or via external_id (a uuid)
    // from openshift console. if we enter via the uuid, switch to the normal id.
    const requestedClusterID = match.params.clusterId;
    const requestedReportID = match.params.reportId.replace(/\|/g, '.');
    if (cluster && cluster.shouldRedirect && isUuid(requestedClusterID)) {
      return (
        <Redirect to={`/details/${cluster.id}/insights/${match.params.reportId}`} />
      );
    }

    // If the ClusterDetails screen is loaded once for one cluster, and then again for another,
    // the redux state will have the data for the previous cluster. We want to ensure we only
    // show data for the requested cluster, so different data should be marked as pending.

    const isPending = (((get(cluster, 'id') !== requestedClusterID) && !clusterDetails.error) || (get(reportDetails.report, 'rule_id') !== requestedReportID && !reportDetails.rejected));

    const errorClusterState = () => (
      <EmptyState>
        <ErrorBox message="Error retrieving cluster details" response={clusterDetails} />
        {isPending && <Spinner />}
      </EmptyState>
    );

    const errorReportState = () => (
      <EmptyState>
        <ErrorBox message="Error retrieving report details" response={reportDetails} />
        {isPending && <Spinner />}
      </EmptyState>
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
    if (clusterDetails.error && (!cluster || get(cluster, 'id') !== requestedClusterID)) {
      if (clusterDetails.errorCode === 404) {
        setGlobalError((
          <>
            Cluster
            {' '}
            <b>{requestedClusterID}</b>
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
          Report
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

    const displayReasonTab = !!reportDetails.report.reason;
    const displayResolutionTab = !!reportDetails.report.resolution;

    return (
      <PageSection id="ruledetails-content">
        <InsightsRuleDetailsTop
          cluster={cluster}
          rule={reportDetails.report}
          pending={clusterDetails.pending || reportDetails.pending}
          refreshFunc={this.refresh}
          voteOnRule={voteOnRule}
          disableRule={disableRule}
          enableRule={enableRule}
        >
          {
            (displayReasonTab || displayResolutionTab) && (
              <TabsRow
                displayReasonTab={displayReasonTab}
                displayResolutionTab={displayResolutionTab}
                reasonTabRef={this.reasonTabRef}
                resolutionTabRef={this.resolutionTabRef}
              />
            )
          }
        </InsightsRuleDetailsTop>
        {displayReasonTab && (
          <TabContent
            eventKey={0}
            id="reasonTabContent"
            ref={this.reasonTabRef}
            aria-label="Reason"
          >
            <Card>
              <CardBody>
                <Markdown
                  template={reportDetails.report.reason}
                  definitions={reportDetails.report.extra_data}
                />
              </CardBody>
            </Card>
          </TabContent>
        )}
        {displayResolutionTab && (
          <TabContent
            eventKey={1}
            id="resolutionTabContent"
            ref={this.resolutionTabRef}
            aria-label="How to remediate"
            hidden={displayReasonTab}
          >
            <Card>
              <CardBody>
                <Markdown
                  template={reportDetails.report.resolution}
                  definitions={reportDetails.report.extra_data}
                />
              </CardBody>
            </Card>
          </TabContent>
        )}
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
  disableRule: PropTypes.func.isRequired,
  enableRule: PropTypes.func.isRequired,
  reportDetails: PropTypes.object,
  clusterDetails: PropTypes.shape({
    cluster: PropTypes.object,
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
};

InsightsRuleDetails.defaultProps = {
  reportDetails: {},
  clusterDetails: {
    cluster: null,
    error: false,
    errorMessage: '',
    fulfilled: false,
  },
};

export default InsightsRuleDetails;
