import Tokens from './Tokens';
import { connect } from 'react-redux';
import { setOfflineToken } from '~/components/clusters/CreateROSAPage/CreateROSAWizard/rosaActions';

const mapDispatchToProps = (dispatch) => ({
  setOfflineToken: (token) => dispatch(setOfflineToken(token)),
});

const mapStateToProps = (state) => {
  const { offlineToken } = state.rosaReducer;

  return {
    offlineToken,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tokens);
