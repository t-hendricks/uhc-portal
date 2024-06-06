import { connect } from 'react-redux';

import { GlobalState } from '~/redux/store';
import { QuotaCostList } from '~/types/accounts_mgmt.v1';

import { hasHostedQuotaSelector } from '../../../common/quotaSelectors';

import ControlPlaneScreen from './ControlPlaneScreen';

const mapStateToProps = (state: GlobalState) => {
  const { quotaList } = state.userProfile.organization;

  return {
    hasHostedProductQuota: hasHostedQuotaSelector(quotaList as QuotaCostList),
  };
};

export default connect(mapStateToProps)(ControlPlaneScreen);
