import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Form,
} from '@patternfly/react-core';

import NetworkingSection from '../../CreateOSDForm/FormSections/NetworkingSection/NetworkingSection';

class NetworkScreen extends React.Component {
  toggleNetworkingMode = (_, value) => {
    const { change } = this.props;
    if (value === 'basic') {
      change('network_machine_cidr', '');
      change('network_service_cidr', '');
      change('network_pod_cidr', '');
    }
  };

  render() {
    const {
      privateClusterSelected,
      isCCS,
      cloudProviderID,
      isMultiAz,
      selectedRegion,
      installToVPCSelected,
      networkingMode,
    } = this.props;

    const isAws = cloudProviderID === 'aws';
    const isGCP = cloudProviderID === 'gcp';

    return (
      <Form onSubmit={() => false}>
        <Grid hasGutter>
          <NetworkingSection
            mode={networkingMode}
            toggleNetwork={this.toggleNetworkingMode}
            privateClusterSelected={privateClusterSelected}
            isCCS={isCCS}
            showClusterPrivacy={isAws || (isGCP && isCCS)}
            cloudProviderID={cloudProviderID}
            isMultiAz={isMultiAz}
            selectedRegion={selectedRegion}
            installToVPCSelected={installToVPCSelected}
            isWizard
          />
        </Grid>
      </Form>
    );
  }
}

NetworkScreen.propTypes = {
  privateClusterSelected: PropTypes.bool,
  cloudProviderID: PropTypes.string,
  isMultiAz: PropTypes.bool,
  isCCS: PropTypes.bool,
  selectedRegion: PropTypes.string,
  installToVPCSelected: PropTypes.bool,
  networkingMode: PropTypes.bool,
  change: PropTypes.func,
};

export default NetworkScreen;
