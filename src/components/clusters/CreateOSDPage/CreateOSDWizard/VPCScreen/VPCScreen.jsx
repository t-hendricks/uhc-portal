import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, GridItem, Title } from '@patternfly/react-core';

import InstallToVPC from '../../CreateOSDForm/FormSections/NetworkingSection/InstallToVPC';

function VPCScreen({
  cloudProviderID,
  isMultiAz,
  selectedRegion,
  privateLinkSelected,
  isSharedVpcSelected,
  hostedZoneDomainName,
}) {
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
  selectedRegion: PropTypes.string,
  privateLinkSelected: PropTypes.bool,
  isSharedVpcSelected: PropTypes.bool,
  hostedZoneDomainName: PropTypes.string,
};

export default VPCScreen;
