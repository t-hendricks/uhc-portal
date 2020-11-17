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
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { PageSection, Stack, StackItem } from '@patternfly/react-core';
import get from 'lodash/get';

import OCPSubscriptionCard from './OCPSubscriptionCard';
import OSDSubscriptionCard from './OSDSubscriptionCard';
import SubscriptionNotFulfilled from './SubscriptionNotFulfilled';
import './Subscriptions.scss';

class Subscriptions extends Component {
  componentDidMount() {
    document.title = 'Subscriptions | Red Hat OpenShift Cluster Manager';
    this.refresh();
    if (get(window, 'insights.ocm')) {
      this.cleanupOcmListener = insights.ocm.on('APP_REFRESH', () => this.refresh());
    }
  }

  componentWillUnmount() {
    const { invalidateClusters } = this.props;
    invalidateClusters();

    if (this.cleanupOcmListener) {
      this.cleanupOcmListener();
    }
  }

  refresh = () => {
    const { fetchAccount } = this.props;
    fetchAccount();
  };

  render() {
    const { account } = this.props;
    let content;
    if (account.fulfilled && account.data.organization && account.data.organization.id) {
      const organizationID = account.data.organization.id;
      content = (
        <>
          <PageHeader>
            <PageHeaderTitle title="Subscriptions" className="page-title" />
          </PageHeader>
          <PageSection className="ocm-p-subscriptions">
            <Stack hasGutter>
              <StackItem className="ocm-l-ocp-subscription__section">
                <OCPSubscriptionCard organizationID={organizationID} />
              </StackItem>
              <StackItem className="ocm-l-osd-subscription__section">
                <OSDSubscriptionCard organizationID={organizationID} />
              </StackItem>
            </Stack>
          </PageSection>
        </>
      );
    } else {
      const data = {
        error: account.error,
        pending: account.pending,
        type: 'account',
        internalErrorCode: account.internalErrorCode,
      };
      content = <SubscriptionNotFulfilled data={data} refresh={this.refresh} />;
    }

    return content;
  }
}

Subscriptions.propTypes = {
  fetchAccount: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
  invalidateClusters: PropTypes.func.isRequired,
};

export default Subscriptions;
