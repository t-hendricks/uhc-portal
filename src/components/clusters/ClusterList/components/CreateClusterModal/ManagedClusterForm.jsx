import PropTypes from 'prop-types';
import React from 'react';
import {
  Form, Grid, Row, ExpandCollapse,
} from 'patternfly-react';
import constants from './CreateClusterModalHelper';
import ConfigurationForm from './ConfigurationForm';
import RouterShardsForm from './RouterShardsForm';

function ManagedClusterForm(props) {
  const {
    pending,
  } = props;
  return (
    <Form>
      <Grid>
        <Row>
          <ConfigurationForm
            header={constants.configurationHeader}
            pending={pending}
            showDNSBaseDomain={false}
          />
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

ManagedClusterForm.propTypes = {
  pending: PropTypes.bool,
};

export default ManagedClusterForm;
