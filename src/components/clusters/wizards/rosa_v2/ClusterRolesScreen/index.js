import { connect } from 'react-redux';

import ClusterRolesScreen from './ClusterRolesScreen';
import {
  getOCMRole,
  clearGetOcmRoleResponse,
  getUserOidcConfigurations,
} from '../../../../../redux/actions/rosaActions';

const mapDispatchToProps = (dispatch) => ({
  getOCMRole: (awsAccountID) => dispatch(getOCMRole(awsAccountID)),
  clearGetOcmRoleResponse: () => dispatch(clearGetOcmRoleResponse()),
  getUserOidcConfigurations: (awsAccountID) => dispatch(getUserOidcConfigurations(awsAccountID)),
});

const mapStateToProps = (state) => {
  const { getOCMRoleResponse } = state.rosaReducer;

  return {
    getOCMRoleResponse,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterRolesScreen);
