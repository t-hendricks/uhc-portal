import { connect } from 'react-redux';
import GlobalErrorBox from './GlobalErrorBox';
import { clearGlobalError } from '../../../../redux/actions/globalErrorActions';

const mapStateToProps = state => ({
  errorMessage: state.globalError.errorMessage,
});

const mapDispatchToProps = {
  clearGlobalError,
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalErrorBox);
