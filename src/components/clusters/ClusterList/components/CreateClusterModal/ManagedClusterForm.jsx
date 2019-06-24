import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Row, ExpandCollapse } from 'patternfly-react';
import constants from './CreateClusterModalHelper';
import ConfigurationForm from './ConfigurationForm';
import RouterShardsForm from './RouterShardsForm';

function ManagedClusterForm(props) {
  const {
    pending,
    touch,
  } = props;
  return (
    <Grid>
      <Row>
        <ConfigurationForm
          header={constants.configurationHeader}
          pending={pending}
          showDNSBaseDomain={false}
          touch={touch}
        />
      </Row>
      <Row>
        <ExpandCollapse>
          <RouterShardsForm pending={pending} />
        </ExpandCollapse>
      </Row>
    </Grid>
  );
}

ManagedClusterForm.propTypes = {
  pending: PropTypes.bool,
  touch: PropTypes.func.isRequired,
};

export default ManagedClusterForm;
