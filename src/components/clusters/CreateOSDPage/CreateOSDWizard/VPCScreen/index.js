import { connect } from 'react-redux';
import { change, untouch, formValueSelector } from 'redux-form';

import { canConfigureSharedVpc } from '~/components/clusters/wizards/rosa/constants';
import wizardConnector from '../WizardConnector';
import VPCScreen from './VPCScreen';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');

  const clusterName = valueSelector(state, 'name');
  const version = valueSelector(state, 'cluster_version');
  const sharedVpcSettings = valueSelector(state, 'shared_vpc');
  const selectedVPC = valueSelector(state, 'selected_vpc');
  const isSharedVpcSelected = sharedVpcSettings?.is_selected || false;
  const isSharedVpcSelectable = canConfigureSharedVpc(version.raw_id);
  const hostedZoneDomainName = isSharedVpcSelected
    ? `${clusterName}.${sharedVpcSettings.base_dns_domain || '<selected-base-domain>'}`
    : undefined;

  return {
    cloudProviderID: valueSelector(state, 'cloud_provider'),
    isMultiAz: valueSelector(state, 'multi_az') === 'true',
    isSharedVpcSelected,
    isSharedVpcSelectable,
    hostedZoneDomainName,
    selectedVPC,
    selectedRegion: valueSelector(state, 'region'),
  };
};

const mapDispatchToProps = () => ({
  change,
  untouch,
});

export default connect(mapStateToProps, mapDispatchToProps)(wizardConnector(VPCScreen));
