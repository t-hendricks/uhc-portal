import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { GlobalState } from '~/redux/store';
import { setOfflineToken } from '~/redux/actions/rosaActions';
import StepCreateAWSAccountRoles from './StepCreateAWSAccountRoles';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setOfflineToken: (token: string) => dispatch(setOfflineToken(token)),
});

const mapStateToProps = (state: GlobalState) => {
  const { offlineToken } = state.rosaReducer;

  return {
    offlineToken,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StepCreateAWSAccountRoles);
