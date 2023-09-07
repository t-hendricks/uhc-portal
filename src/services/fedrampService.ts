import config from '~/config';
import apiRequest from './apiRequest';

const createIncident = (
  file: File,
  checks: {
    isUSCitizen: boolean;
    backgroundCheck: boolean;
    securityTraining: boolean;
  },
  contractID?: string,
) =>
  apiRequest.postForm(
    '/fedramp-customer-interest/incident',
    {
      file,
      contractID,
      acknowledgement: JSON.stringify(checks),
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      baseURL: config.configData.fedrampGateway,
    },
  );

const fedrampService = {
  createIncident,
};

export default fedrampService;
