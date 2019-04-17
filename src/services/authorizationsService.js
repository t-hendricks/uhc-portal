import apiRequest from './apiRequest';

const selfResourceReview = params => apiRequest({
  method: 'post',
  url: '/api/authorizations/v1/self_resource_review',
  data: params,
});

const selfAccessReview = params => apiRequest({
  method: 'post',
  url: '/api/authorizations/v1/self_access_review',
  data: params,
});


const authorizationsService = {
  selfResourceReview,
  selfAccessReview,
};

export default authorizationsService;
