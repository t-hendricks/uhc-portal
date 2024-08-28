import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Navigate } from '~/common/routing';
import LoadingPage from '~/components/App/LoadingPage';
import NotFoundError from '~/components/App/NotFoundError';
import { getAccessRequest } from '~/redux/actions/accessRequestActions';
import { useGlobalState } from '~/redux/hooks';

const AccessRequestNavigate = () => {
  const { id: accessRequestId } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const accessRequestState = useGlobalState((state) => state.accessRequest.accessRequest);

  useEffect(() => {
    if (!accessRequestState.subscription_id && accessRequestId) {
      dispatch(getAccessRequest(accessRequestId));
    }
  }, [dispatch, accessRequestId, accessRequestState.subscription_id]);

  if (accessRequestState.error) {
    return <NotFoundError />;
  }

  return !accessRequestState.subscription_id ? (
    <LoadingPage />
  ) : (
    <Navigate replace to={`/details/s/${accessRequestState.subscription_id}#accessRequest`} />
  );
};

export default AccessRequestNavigate;
