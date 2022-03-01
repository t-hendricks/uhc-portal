import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Form,
  Grid,
  GridItem,
  Title,
  Text,
  Alert,
} from '@patternfly/react-core';

import { constants } from '../../CreateOSDForm/CreateOSDFormConstants';
import validators from '../../../../../common/validators';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import ReduxFileUpload from '../../../../common/ReduxFormComponents/ReduxFileUpload';

import { HTTP_PROXY_PLACEHOLDER, HTTPS_PROXY_PLACEHOLDER } from '../../CreateOSDForm/FormSections/NetworkingSection/networkingPlaceholders';

function ClusterProxyScreen({
  cloudProviderID, isMultiAz, selectedRegion,
}) {
  return (
    <Form onSubmit={(event) => { event.preventDefault(); return false; }}>
      <Grid hasGutter>
        <GridItem>
          <Title headingLevel="h3">Cluster-wide proxy</Title>
        </GridItem>
        <GridItem>
          <Text>
            {constants.clusterProxyHint}
          </Text>
        </GridItem>
        <GridItem>
          <Alert variant="info" isInline title="Configure at least 1 of the following fields:" />
        </GridItem>
        <GridItem md={6}>
          <Field
            component={ReduxVerticalFormGroup}
            name="http_proxy_url"
            label="HTTP Proxy URL"
            placeholder={HTTP_PROXY_PLACEHOLDER}
            type="text"
            // validate={machineCidrValidators}
            // disabled={disabled}
            helpText="Specify a proxy URL to use for HTTP connections outside the cluster."
            showHelpTextOnError={false}
          />
        </GridItem>
        <GridItem md={6} />
        <GridItem md={6}>
          <Field
            component={ReduxVerticalFormGroup}
            name="https_proxy_url"
            label="HTTPS Proxy URL"
            placeholder={HTTPS_PROXY_PLACEHOLDER}
            type="text"
            // validate={machineCidrValidators}
            // disabled={disabled}
            helpText="Specify a proxy URL to use for HTTPS connections outside the cluster."
            showHelpTextOnError={false}
          />
        </GridItem>
        <GridItem md={6} />
        <GridItem md={6}>
          <Field
            component={ReduxFileUpload}
            // validate={[required, validateGCPServiceAccount]}
            name="additional_trust_bundle"
            // disabled={pending}
            // isRequired
            label="Additional trust bundle"
            helpText="To upload a CA certificate JSON file, type or paste"
            className="pf-c-form-control"
          />
        </GridItem>
      </Grid>
    </Form>
  );
}

ClusterProxyScreen.propTypes = {
  cloudProviderID: PropTypes.string,
  isMultiAz: PropTypes.bool,
  selectedRegion: PropTypes.string,
};

export default ClusterProxyScreen;
