import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, GridItem, Title } from '@patternfly/react-core';

import CIDRFields from './CIDRFields';

function CIDRScreen({
  cloudProviderID,
  isMultiAz,
  installToVpcSelected,
  isDefaultValuesChecked,
  change,
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
          <Title headingLevel="h3">CIDR ranges</Title>
        </GridItem>

        <CIDRFields
          cloudProviderID={cloudProviderID}
          isMultiAz={isMultiAz}
          installToVpcSelected={installToVpcSelected}
          isDefaultValuesChecked={isDefaultValuesChecked}
          change={change}
        />
      </Grid>
    </Form>
  );
}

CIDRScreen.propTypes = {
  cloudProviderID: PropTypes.string,
  isMultiAz: PropTypes.bool,
  installToVpcSelected: PropTypes.bool,
  isDefaultValuesChecked: PropTypes.bool,
  change: PropTypes.func,
};

export default CIDRScreen;
