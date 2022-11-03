import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Tokens from './Tokens';
import { setOfflineToken } from '~/components/clusters/CreateROSAPage/CreateROSAWizard/rosaActions';
import { RosaApi } from '~/redux/types';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setOfflineToken: (token: string) => dispatch(setOfflineToken(token)),
});

type TokenState = {
  rosaReducer: RosaApi;
};
const mapStateToProps = (state: TokenState) => {
  const { offlineToken } = state.rosaReducer;

  return {
    offlineToken,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tokens);
