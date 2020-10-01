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

const selfTermsReview = () => apiRequest({
  method: 'post',
  url: '/api/authorizations/v1/self_terms_review',
});

const authorizationsService = {
  selfResourceReview,
  selfAccessReview,
  selfTermsReview,
};

export default authorizationsService;
