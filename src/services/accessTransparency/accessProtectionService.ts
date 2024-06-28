import apiRequest from '~/services/apiRequest';
import { AccessProtection } from '~/types/access_transparency.v1';

const getAccessProtection = (params: {
  subscriptionId?: string;
  organizationId?: string;
  clusterId?: string;
}) =>
  apiRequest.get<AccessProtection>(`/api/access_transparency/v1/access_protection`, {
    params,
  });

const accessProtectionService = {
  getAccessProtection,
};

export default accessProtectionService;
