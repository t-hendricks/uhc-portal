import React from 'react';
import { Grid, GridItem, Form, Title } from '@patternfly/react-core';
import UpgradeSettingsFields from '../common/Upgrades/UpgradeSettingsFields';

function UpdatesScreen() {
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
        <UpgradeSettingsFields />
      </Grid>
    </Form>
  );
}

export default UpdatesScreen;
