import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import EntitlementConfig from './EntitlementConfig';
import { createRosaEntitlement } from '../../../redux/actions/tokensActions';
import { GlobalState } from '~/redux/store';

const mapStateToProps = (state: GlobalState) => ({
  fulfilled: state.entitlementConfig.fulfilled,
  pending: state.entitlementConfig.pending,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createRosaEntitlement: () => dispatch(createRosaEntitlement()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EntitlementConfig);
