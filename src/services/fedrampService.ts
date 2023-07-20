import config from '~/config';
import apiRequest from './apiRequest';

const createIncident = (
  file: File,
  checks: {
    isUSCitizen: boolean;
    backgroundCheck: boolean;
    securityTraining: boolean;
  },
) =>
  apiRequest.postForm(
    '/fedramp-customer-interest/incident',
    {
      file,
      data: JSON.stringify(
        {
          short_description: 'FedRAMP Onboarding',
          urgency: '1',
          impact: '1',
          description: JSON.stringify(checks),
          contact_type: 'contact',
        },
        null,
        2,
      ),
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
