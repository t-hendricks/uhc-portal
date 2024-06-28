import apiRequest from '~/services/apiRequest';
import { AccessRequest, AccessRequestList, Decision } from '~/types/access_transparency.v1';

const getAccessRequests = (params: {
  status?: string;
  page: number;
  size: number;
  search?: string;
  orderBy?: string;
  fields?: string;
}) =>
  apiRequest.get<AccessRequestList>(`/api/access_transparency/v1/access_requests`, {
    params,
  });

const getAccessRequest = (id: string) =>
  apiRequest.get<AccessRequest>(`/api/access_transparency/v1/access_requests/${id}`);

const postAccessRequestDecision = (id: string, decision: Decision) =>
  apiRequest.post<Decision>(
    `/api/access_transparency/v1/access_requests/${id}/decisions`,
    decision,
  );

const accessRequestService = {
  getAccessRequests,
  getAccessRequest,
  postAccessRequestDecision,
};

export default accessRequestService;
