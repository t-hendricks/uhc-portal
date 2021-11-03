import { connect } from 'react-redux';
import EntitlementConfig from './EntitlementConfig';
import { createRosaEntitlement } from '../../../redux/actions/tokensActions';

const mapStateToProps = state => ({
  fulfilled: state.entitlementConfig.fulfilled,
  pending: state.entitlementConfig.pending,
});

const mapDispatchToProps = dispatch => ({
  createRosaEntitlement: () => dispatch(createRosaEntitlement()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EntitlementConfig);
