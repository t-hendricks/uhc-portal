import { connect } from 'react-redux';
import { change, untouch, formValueSelector } from 'redux-form';

import wizardConnector from '~/components/clusters/wizards/common/WizardConnector';
import VPCScreen from './VPCScreen';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');

  const clusterName = valueSelector(state, 'name');
  const version = valueSelector(state, 'cluster_version');
  const sharedVpcSettings = valueSelector(state, 'shared_vpc');
  const selectedVPC = valueSelector(state, 'selected_vpc');
  const machinePoolsSubnets = valueSelector(state, 'machinePoolsSubnets');
  const isSharedVpcSelected = sharedVpcSettings?.is_selected || false;
  const hostedZoneDomainName = isSharedVpcSelected
    ? `${clusterName}.${sharedVpcSettings.base_dns_domain || '<selected-base-domain>'}`
    : undefined;

  const selectedAZs = machinePoolsSubnets.map((subnet) => subnet.availabilityZone);
  return {
    cloudProviderID: valueSelector(state, 'cloud_provider'),
    isMultiAz: valueSelector(state, 'multi_az') === 'true',
    isSharedVpcSelected,
    hostedZoneDomainName,
    selectedVPC,
    selectedAZs,
    openshiftVersion: version.raw_id,
    selectedRegion: valueSelector(state, 'region'),
  };
};

const mapDispatchToProps = () => ({
  change,
  untouch,
});

export default connect(mapStateToProps, mapDispatchToProps)(wizardConnector(VPCScreen));
