import axios from 'axios';
import serviceConfig from './serviceConfig';

const getCurrentAccount = () => axios(
  serviceConfig({
    method: 'get',
    url: '/api/accounts_mgmt/v1/current_account',
  }),
);

const getOrganization = organizationID => axios(
  serviceConfig({
    method: 'get',
    url: `/api/accounts_mgmt/v1/organizations/${organizationID}`,
  }),
);


const accountsService = {
  getCurrentAccount,
  getOrganization,
};

export default accountsService;
