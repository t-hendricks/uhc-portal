import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, GridItem, Title } from '@patternfly/react-core';

import InstallToVPC from './InstallToVPC';

function VPCScreen({
  cloudProviderID,
  isMultiAz,
  selectedRegion,
  selectedVPC,
  openshiftVersion,
  privateLinkSelected,
  isSharedVpcSelected,
  hostedZoneDomainName,
  change,
  untouch,
}) {
  React.useEffect(() => {
    if (!selectedVPC.id) {
      const azCount = isMultiAz ? 3 : 1;

      let resetFields = [];
      for (let i = 0; i < azCount; i += 1) {
        resetFields = resetFields.concat([
          `az_${i}`,
          `private_subnet_id_${i}`,
          `public_subnet_id_${i}`,
        ]);
      }
      resetFields.forEach((field) => {
        change(field, '');
      });

      // Prevent the validation errors from showing - fields have been reset
      untouch(...resetFields);
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
  openshiftVersion: PropTypes.string,
  privateLinkSelected: PropTypes.bool,
  isSharedVpcSelected: PropTypes.bool,
  hostedZoneDomainName: PropTypes.string,
};

export default VPCScreen;
