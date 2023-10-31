import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, GridItem, Title } from '@patternfly/react-core';

import InstallToVPC from '../../CreateOSDForm/FormSections/NetworkingSection/InstallToVPC';

function VPCScreen({
  cloudProviderID,
  isMultiAz,
  selectedRegion,
  selectedVPC,
  privateLinkSelected,
  isSharedVpcSelected,
  isSharedVpcSelectable,
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
          selectedVPC={selectedVPC}
          isSharedVpcSelected={isSharedVpcSelected}
          isSharedVpcSelectable={isSharedVpcSelectable}
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
  selectedVPC: PropTypes.object,
  privateLinkSelected: PropTypes.bool,
  isSharedVpcSelected: PropTypes.bool,
  isSharedVpcSelectable: PropTypes.bool,
  hostedZoneDomainName: PropTypes.string,
};

export default VPCScreen;
