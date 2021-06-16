import React from 'react';
import PropTypes from 'prop-types';
import {
  Title,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { Field } from 'redux-form';

import { required } from '../../../../../common/validators';

import CloudProviderSelectionField from '../CloudProviderSelectionField';
import AWSByocFields from './AWSByocFields';
import GCPByocFields from './GCPByocFields';

function ClusterSettingsScreen({ isByoc, cloudProviderID }) {
  return (
    <Grid>
      <GridItem span={12}>
        <Title headingLevel="h3">
          Select a cloud provider
        </Title>
      </GridItem>
      <Field
        name="cloud_provider"
        component={CloudProviderSelectionField}
        validate={required}
      />
      { isByoc && (
        cloudProviderID === 'aws' ? <AWSByocFields /> : <GCPByocFields />
      )}
    </Grid>
  );
}

ClusterSettingsScreen.propTypes = {
  isByoc: PropTypes.bool,
  cloudProviderID: PropTypes.string,
};

export default ClusterSettingsScreen;
