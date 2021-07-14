import React from 'react';
import PropTypes from 'prop-types';
import {
  Title,
  Grid,
  GridItem,
  Form,
} from '@patternfly/react-core';
import { Field } from 'redux-form';

import { required } from '../../../../../common/validators';

import CloudProviderSelectionField from '../CloudProviderSelectionField';
import AWSByocFields from './AWSByocFields';
import GCPByocFields from './GCPByocFields';

function ClusterSettingsScreen({ isByoc, cloudProviderID }) {
  return (
    <Form onSubmit={() => false}>
      <Grid hasGutter>
        <GridItem span={12}>
          <Title headingLevel="h3">
            Select a cloud provider
          </Title>
        </GridItem>
        <GridItem span={8}>
          <Field
            name="cloud_provider"
            component={CloudProviderSelectionField}
            validate={required}
          />
        </GridItem>
        { isByoc && cloudProviderID && (
          cloudProviderID === 'aws' ? <AWSByocFields /> : <GCPByocFields />
        )}
      </Grid>
    </Form>
  );
}

ClusterSettingsScreen.propTypes = {
  isByoc: PropTypes.bool,
  cloudProviderID: PropTypes.string,
};

export default ClusterSettingsScreen;
