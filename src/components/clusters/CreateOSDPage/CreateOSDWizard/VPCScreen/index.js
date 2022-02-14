import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import wizardConnector from '../WizardConnector';
import { isVPCInquiryValid } from './useVPCInquiry';
import VPCScreen from './VPCScreen';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');
  const { vpcs } = state.ccsInquiries;

  return {
    cloudProviderID: valueSelector(state, 'cloud_provider'),
    isMultiAz: valueSelector(state, 'multi_az') === 'true',
    selectedRegion: valueSelector(state, 'region'),
    // `vpcs` and `vpcsValid` props are here for consumption by validations in AWSSubnetFields
    // (props of the component wrapped by reduxForm() are accessible to validate` functions.)
    vpcs,
    vpcsValid: isVPCInquiryValid(state),
  };
};

export default connect(mapStateToProps)(wizardConnector(VPCScreen));
