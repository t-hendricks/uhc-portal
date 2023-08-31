import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import wizardConnector from '../WizardConnector';
import { isVPCInquiryValid } from './useVPCInquiry';
import VPCScreen from './VPCScreen';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');
  const { vpcs } = state.ccsInquiries;

  const clusterName = valueSelector(state, 'name');
  const sharedVpcSettings = valueSelector(state, 'shared_vpc');

  const isSharedVpcSelected = sharedVpcSettings?.is_selected || false;
  const hostedZoneDomainName = isSharedVpcSelected
    ? `${clusterName}.${sharedVpcSettings.base_dns_domain || '<selected-base-domain>'}`
    : undefined;
  return {
    cloudProviderID: valueSelector(state, 'cloud_provider'),
    isMultiAz: valueSelector(state, 'multi_az') === 'true',
    isSharedVpcSelected,
    hostedZoneDomainName,
    selectedRegion: valueSelector(state, 'region'),
    // `vpcs` and `vpcsValid` props are here for consumption by validations in AWSSubnetFields
    // (props of the component wrapped by reduxForm() are accessible to validate` functions.)
    vpcs,
    vpcsValid: isVPCInquiryValid(state),
  };
};

export default connect(mapStateToProps)(wizardConnector(VPCScreen));
