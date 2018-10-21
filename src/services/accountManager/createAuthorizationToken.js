import axios from 'axios';
import serviceConfig from '../serviceConfig';

const createAuthorizationToken = () => axios(
  serviceConfig({
    method: 'post',
    url: '/api/accounts_mgmt/v1/dockercfg',
  }),
);


export default createAuthorizationToken;
