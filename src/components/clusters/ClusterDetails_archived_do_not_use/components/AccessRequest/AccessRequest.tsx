import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Card, CardBody, CardTitle } from '@patternfly/react-core';
import { SortByDirection } from '@patternfly/react-table';

import links from '~/common/installLinks.mjs';
import { viewPropsChanged } from '~/common/queryHelpers';
import ExternalLink from '~/components/common/ExternalLink';
import ConnectedModal from '~/components/common/Modal/ConnectedModal';
import { modalActions } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import {
  getAccessRequests,
  getPendingAccessRequests,
  resetAccessRequest,
  resetPostAccessRequestDecision,
} from '~/redux/actions/accessRequestActions';
import { viewActions } from '~/redux/actions/viewOptionsActions';
import { viewConstants } from '~/redux/constants';
import { useGlobalState } from '~/redux/hooks';
import { AccessRequest as AccessRequestModel } from '~/types/access_transparency.v1';
import { ViewSorting } from '~/types/types';

import AccessRequestModalForm from './components/AccessRequestModalForm';
import AccessRequestTable from './components/AccessRequestTable';
import AccessRequestTablePagination from './components/AccessRequestTablePagination';

import './AccessRequest.scss';

type AccessRequestProps = {
  subscriptionId?: string;
};

const AccessRequest = ({ subscriptionId }: AccessRequestProps) => {
  const dispatch = useDispatch();
  const viewType = viewConstants.ACCESS_REQUESTS_VIEW;

  const viewOptions = useGlobalState((state) => state.viewOptions[viewType]);
  const accessRequestsState = useGlobalState((state) => state.accessRequest.accessRequests);
  const accessRequestState = useGlobalState((state) => state.accessRequest.accessRequest);
  const postAccessRequestDecisionState = useGlobalState(
    (state) => state.accessRequest.postAccessRequestDecision,
  );

  const [previousViewOptions, setPreviousViewOptions] = useState(viewOptions);

  const isPending = useMemo(() => accessRequestsState.pending, [accessRequestsState.pending]);
  const isPendingNoData = useMemo(
    () => isPending || !accessRequestsState?.items?.length,
    [isPending, accessRequestsState],
  );
  const sortBy = useMemo(
    () => ({
      index: viewOptions.sorting.sortIndex,
      direction: viewOptions.sorting.isAscending ? SortByDirection.asc : SortByDirection.desc,
    }),
    [viewOptions],
  );

  const setSorting = useCallback(
    (sorting: ViewSorting) => dispatch(viewActions.onListSortBy(sorting, viewType)),
    [dispatch, viewType],
  );

  const openAccessRequest = useCallback(
    (accessRequestElement?: AccessRequestModel) =>
      dispatch(
        modalActions.openModal(modals.ACCESS_REQUEST_DETAILS, {
          accessRequest: accessRequestElement,
          onClose: () => {
            dispatch(resetAccessRequest());
            dispatch(resetPostAccessRequestDecision());
          },
        }),
      ),
    [dispatch],
  );

  useEffect(() => {
    if (subscriptionId !== undefined) {
      dispatch(getAccessRequests(subscriptionId, viewOptions));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionId]);

  useEffect(() => {
    if (subscriptionId !== undefined && postAccessRequestDecisionState.fulfilled) {
      dispatch(getAccessRequests(subscriptionId, viewOptions));
      dispatch(getPendingAccessRequests(subscriptionId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postAccessRequestDecisionState.fulfilled]);

  useEffect(() => {
    if (accessRequestState.fulfilled) {
      openAccessRequest(accessRequestState);
    }
  }, [accessRequestState, openAccessRequest]);

  useEffect(() => {
    if (
      viewPropsChanged(viewOptions, previousViewOptions) &&
      !accessRequestsState.pending &&
      subscriptionId !== undefined
    ) {
      dispatch(getAccessRequests(subscriptionId, viewOptions));
      setPreviousViewOptions(viewOptions);
    }
  }, [accessRequestsState.pending, dispatch, previousViewOptions, subscriptionId, viewOptions]);

  return (
    <>
      <Card className="ocm-c-access-request__card">
        <CardTitle className="ocm-c-access-request__card--header">Access Requests</CardTitle>
        <CardBody className="ocm-c-access-request__card--body">
          <div className="access-request-subtitle">
            Access requests to customer data on Red Hat OpenShift Service on AWS clusters and the
            corresponding cloud accounts can be created by SRE either in response to a
            customer-initiated support ticket or in response to alerts received by SRE, as part of
            the standard incident response process.
          </div>
          <ExternalLink href={links.ACCESS_REQUEST_DOC_LINK}>
            Read more about Access Requests functionality
          </ExternalLink>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <AccessRequestTablePagination
            viewType={viewType}
            viewOptions={viewOptions}
            variant="top"
            isDisabled={isPendingNoData}
          />

          <AccessRequestTable
            accessRequestItems={accessRequestsState.items}
            setSorting={setSorting}
            openDetailsAction={openAccessRequest}
            sortBy={sortBy}
            isPending={isPending}
          />
          <AccessRequestTablePagination
            viewType={viewType}
            viewOptions={viewOptions}
            variant="bottom"
            isDisabled={isPendingNoData}
          />
        </CardBody>
      </Card>
      <ConnectedModal ModalComponent={AccessRequestModalForm} />
    </>
  );
};

export default AccessRequest;
