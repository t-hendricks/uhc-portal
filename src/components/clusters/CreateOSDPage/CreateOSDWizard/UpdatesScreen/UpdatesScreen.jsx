import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  GridItem,
  Form,
  Title,
} from '@patternfly/react-core';

import UpgradeSettingsFields from '../../../common/Upgrades/UpgradeSettingsFields';

function UpdatesScreen({ isAutomaticUpgrade }) {
  return (
    <Form onSubmit={() => false}>
      <Grid hasGutter>
        <GridItem span={12}>
          <Title headingLevel="h3">Cluster updates</Title>
        </GridItem>
        <UpgradeSettingsFields
          isAutomatic={isAutomaticUpgrade}
        />
      </Grid>
    </Form>
  );
}

UpdatesScreen.propTypes = {
  isAutomaticUpgrade: PropTypes.bool,
};

export default UpdatesScreen;
