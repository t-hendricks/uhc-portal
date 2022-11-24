import { connect } from 'react-redux';

import ApiError from './ApiError';
import { apiErrorActions } from './ApiErrorActions';

const mapStateToProps = (state) => ({
  apiError: state.apiError,
});

const mapDispatchToProps = {
  showApiError: apiErrorActions.showApiError,
  clearApiError: apiErrorActions.clearApiError,
};

export default connect(mapStateToProps, mapDispatchToProps)(ApiError);
