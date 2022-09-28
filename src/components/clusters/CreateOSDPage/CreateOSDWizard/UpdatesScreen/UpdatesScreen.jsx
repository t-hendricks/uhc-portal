import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Form, Title } from '@patternfly/react-core';

import UpgradeSettingsFields from '../../../common/Upgrades/UpgradeSettingsFields';

function UpdatesScreen({ isAutomaticUpgrade, change, product }) {
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        return false;
      }}
    >
      <Grid hasGutter>
        <GridItem>
          <Title headingLevel="h3">Cluster update strategy</Title>
        </GridItem>
        <UpgradeSettingsFields
          isAutomatic={isAutomaticUpgrade}
          change={change}
          initialSceduleValue="0 0 * * 0"
          product={product}
        />
      </Grid>
    </Form>
  );
}

UpdatesScreen.propTypes = {
  isAutomaticUpgrade: PropTypes.bool,
  change: PropTypes.func.isRequired,
  product: PropTypes.string,
};

export default UpdatesScreen;
