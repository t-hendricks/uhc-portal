import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Tokens from './Tokens';
import { setOfflineToken } from '~/components/clusters/CreateROSAPage/CreateROSAWizard/rosaActions';
import { GlobalState } from '~/redux/store';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setOfflineToken: (token: string) => dispatch(setOfflineToken(token)),
});

const mapStateToProps = (state: GlobalState) => {
  const { offlineToken } = state.rosaReducer;

  return {
    offlineToken,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tokens);
