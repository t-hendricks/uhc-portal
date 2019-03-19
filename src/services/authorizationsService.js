import axios from 'axios';
import serviceConfig from './serviceConfig';

const selfResourceReview = params => axios(
  serviceConfig({
    method: 'post',
    url: '/api/authorizations/v1/self_resource_review',
    data: params,
  }),
);

const selfAccessReview = params => axios(
  serviceConfig({
    method: 'post',
    url: '/api/authorizations/v1/self_access_review',
    data: params,
  }),
);


const authorizationsService = {
  selfResourceReview,
  selfAccessReview,
};

export default authorizationsService;
