import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { GlobalState } from '~/redux/store';
import { QuotaCostList } from '~/types/accounts_mgmt.v1';
import { hasHostedQuotaSelector } from '../../../common/quotaSelectors';
import wizardConnector from '../../../CreateOSDPage/CreateOSDWizard/WizardConnector';

import ControlPlaneScreen from './ControlPlaneScreen';

const mapStateToProps = (state: GlobalState) => {
  const formValues = getFormValues('CreateCluster')(state);
  const { quotaList } = state.userProfile.organization;

  return {
    formValues,
    hasHostedProductQuota: hasHostedQuotaSelector(quotaList as QuotaCostList),
  };
};

export default connect(mapStateToProps)(wizardConnector(ControlPlaneScreen));
