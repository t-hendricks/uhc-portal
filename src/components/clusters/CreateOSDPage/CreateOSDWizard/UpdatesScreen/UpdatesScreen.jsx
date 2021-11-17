import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  GridItem,
  Form,
  Title,
} from '@patternfly/react-core';

import UpgradeSettingsFields from '../../../common/Upgrades/UpgradeSettingsFields';

function UpdatesScreen({ isAutomaticUpgrade, change }) {
  return (
    <Form onSubmit={(event) => { event.preventDefault(); return false; }}>
      <Grid hasGutter>
        <GridItem span={12}>
          <Title headingLevel="h3">Cluster updates</Title>
        </GridItem>
        <UpgradeSettingsFields
          isAutomatic={isAutomaticUpgrade}
          change={change}
          initialSceduleValue="0 0 * * 0"
        />
      </Grid>
    </Form>
  );
}

UpdatesScreen.propTypes = {
  isAutomaticUpgrade: PropTypes.bool,
  change: PropTypes.func.isRequired,
};

export default UpdatesScreen;
