const SHOW_API_ERROR = 'SHOW_API_ERROR';
const CLEAR_API_ERROR = 'CLEAR_API_ERROR';

const apiErrorConstants = {
  SHOW_API_ERROR,
  CLEAR_API_ERROR,
};

const showApiError = (error) => ({
  type: SHOW_API_ERROR,
  payload: error,
});

const clearApiError = () => ({
  type: CLEAR_API_ERROR,
});

const apiErrorActions = { showApiError, clearApiError };

export {
  apiErrorConstants,
  SHOW_API_ERROR,
  CLEAR_API_ERROR,
  apiErrorActions,
  showApiError,
  clearApiError,
};
