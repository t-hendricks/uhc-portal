import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, GridItem, Title } from '@patternfly/react-core';
import { getAllSubnetFieldNames } from '~/common/vpcHelpers';

import InstallToVPC from './InstallToVPC';

function VPCScreen({
  cloudProviderID,
  isMultiAz,
  selectedRegion,
  selectedVPC,
  selectedAZs,
  openshiftVersion,
  privateLinkSelected,
  isSharedVpcSelected,
  hostedZoneDomainName,
  change,
  untouch,
}) {
  React.useEffect(() => {
    if (!selectedVPC.id) {
      const subnetReset = [{ availabilityZone: '', privateSubnetId: '', publicSubnetId: '' }];

      if (isMultiAz) {
        subnetReset.push({ availabilityZone: '', privateSubnetId: '', publicSubnetId: '' });
        subnetReset.push({ availabilityZone: '', privateSubnetId: '', publicSubnetId: '' });
      }
      change('machinePoolsSubnets', subnetReset);

      // Prevent the validation errors from showing - fields have been reset
      const untouchFields = getAllSubnetFieldNames(isMultiAz);
      untouch(...untouchFields); // Fails sometimes if we only touch the main "machinePoolsSubnets"
    }
  }, [change, untouch, isMultiAz, selectedVPC]);

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        return false;
      }}
    >
      <Grid hasGutter>
        <GridItem>
          <Title headingLevel="h3">Virtual Private Cloud (VPC) subnet settings</Title>
        </GridItem>

        <InstallToVPC
          cloudProviderID={cloudProviderID}
          isMultiAz={isMultiAz}
          selectedRegion={selectedRegion}
          selectedVPC={selectedVPC}
          selectedAZs={selectedAZs}
          openshiftVersion={openshiftVersion}
          isSharedVpcSelected={isSharedVpcSelected}
          privateLinkSelected={privateLinkSelected}
          hostedZoneDomainName={hostedZoneDomainName}
        />
      </Grid>
    </Form>
  );
}

VPCScreen.propTypes = {
  cloudProviderID: PropTypes.string,
  isMultiAz: PropTypes.bool,
  change: PropTypes.func,
  untouch: PropTypes.func,
  selectedRegion: PropTypes.string,
  selectedVPC: PropTypes.object,
  selectedAZs: PropTypes.arrayOf(PropTypes.string),
  openshiftVersion: PropTypes.string,
  privateLinkSelected: PropTypes.bool,
  isSharedVpcSelected: PropTypes.bool,
  hostedZoneDomainName: PropTypes.string,
};

export default VPCScreen;
