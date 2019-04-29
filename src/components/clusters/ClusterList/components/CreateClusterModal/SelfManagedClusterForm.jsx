import PropTypes from 'prop-types';
import React from 'react';
import {
  Form, Grid, Row, ExpandCollapse,
} from 'patternfly-react';
import constants from './CreateClusterModalHelper';
import ConfigurationForm from './ConfigurationForm';
import RouterShardsForm from './RouterShardsForm';
import CredentialsForm from './CredentialsForm';

function SelfManagedClusterForm(props) {
  const {
    pending,
  } = props;
  return (
    <Form>
      <Grid>
        <Row>
          <CredentialsForm header={`Step 1: ${constants.credentialsHeader}`} pending={pending} />
        </Row>
        <Row>
          <ConfigurationForm header={`Step 2: ${constants.configurationHeader}`} pending={pending} showDNSBaseDomain />
        </Row>
        <Row>
          <ExpandCollapse>
            <RouterShardsForm pending={pending} />
          </ExpandCollapse>
        </Row>
      </Grid>
    </Form>
  );
}

SelfManagedClusterForm.propTypes = {
  pending: PropTypes.bool,
};

export default SelfManagedClusterForm;
