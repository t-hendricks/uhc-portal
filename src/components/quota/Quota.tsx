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
import React from 'react';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { PageSection, Stack, StackItem } from '@patternfly/react-core';
import get from 'lodash/get';

import OSDSubscriptionCard from './OSDSubscriptionCard';
import SubscriptionNotFulfilled from './SubscriptionNotFulfilled';
import type { State as SubscriptionState } from '../../redux/reducers/subscriptionsReducer';

import './Quota.scss';

type Props = {
  fetchAccount: () => void;
  account: SubscriptionState['account'];
  invalidateClusters: () => void;
  marketplace?: boolean;
};

const Quota = ({ invalidateClusters, fetchAccount, account, marketplace }: Props) => {
  const fetchAccountRef = React.useRef(fetchAccount);
  fetchAccountRef.current = fetchAccount;

  // store in `invalidateClusters` in a ref so that we can get the latest value when this component unmounts
  const invalidateClustersRef = React.useRef(invalidateClusters);
  invalidateClustersRef.current = invalidateClusters;
  React.useEffect(() => {
    document.title = 'Quota | Red Hat OpenShift Cluster Manager';
    fetchAccount();
    let cleanupOcmListener: () => void;
    if (get(window, 'insights.ocm')) {
      cleanupOcmListener = insights.ocm?.on('APP_REFRESH', () => fetchAccountRef.current());
    }
    return () => {
      invalidateClustersRef.current();

      if (cleanupOcmListener) {
        cleanupOcmListener();
      }
    };
  }, []);

  if (account.fulfilled && account.data.organization && account.data.organization.id) {
    const title = marketplace ? 'Dedicated (On-Demand Limits)' : 'Dedicated (Annual)';
    const organizationID = account.data.organization.id;
    return (
      <>
        <PageHeader>
          <PageHeaderTitle title={title} className="page-title" />
        </PageHeader>
        <PageSection className="ocm-p-subscriptions">
          <Stack hasGutter>
            <StackItem className="ocm-l-osd-subscription__section">
              <OSDSubscriptionCard organizationID={organizationID} marketplace={marketplace} />
            </StackItem>
          </Stack>
        </PageSection>
      </>
    );
  }
  return (
    <SubscriptionNotFulfilled
      data={{
        error: account.error,
        pending: account.pending,
        type: 'account',
        internalErrorCode: account.error ? account.internalErrorCode : undefined,
      }}
      refresh={fetchAccount}
    />
  );
};

export default Quota;
