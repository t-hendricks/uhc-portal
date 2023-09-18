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

import OSDSubscriptionCard from './OSDSubscriptionCard';
import SubscriptionNotFulfilled from './SubscriptionNotFulfilled';
import type { State as SubscriptionState } from '../../redux/reducers/subscriptionsReducer';

import './Quota.scss';
import { AppPage } from '../App/AppPage';

type Props = {
  fetchAccount: () => void;
  account: SubscriptionState['account'];
  invalidateClusters: () => void;
  marketplace?: boolean;
};

const PAGE_TITLE = 'Quota | Red Hat OpenShift Cluster Manager';

const Quota = ({ invalidateClusters, fetchAccount, account, marketplace }: Props) => {
  // store in refs so that we can retrieve the latest value without re-creating the effect
  const fetchAccountRef = React.useRef(fetchAccount);
  fetchAccountRef.current = fetchAccount;
  const invalidateClustersRef = React.useRef(invalidateClusters);
  invalidateClustersRef.current = invalidateClusters;

  React.useEffect(() => {
    fetchAccount();
    const cleanupOcmListener = window.insights?.ocm?.on('APP_REFRESH', () =>
      fetchAccountRef.current(),
    );
    return () => {
      invalidateClustersRef.current();

      if (cleanupOcmListener) {
        cleanupOcmListener();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (account.fulfilled && account.data.organization && account.data.organization.id) {
    const title = marketplace ? 'Dedicated (On-Demand Limits)' : 'Dedicated (Annual)';
    const organizationID = account.data.organization.id;
    return (
      <AppPage title={PAGE_TITLE}>
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
      </AppPage>
    );
  }
  return (
    <AppPage title={PAGE_TITLE}>
      <SubscriptionNotFulfilled
        data={{
          error: account.error,
          pending: account.pending,
          type: 'account',
          internalErrorCode: account.error ? account.internalErrorCode : undefined,
        }}
        refresh={fetchAccount}
      />
    </AppPage>
  );
};

export default Quota;
