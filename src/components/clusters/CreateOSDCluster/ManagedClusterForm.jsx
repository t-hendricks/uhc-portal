import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Row } from 'patternfly-react';
import constants from './CreateOSDClusterHelper';
import ConfigurationForm from './ConfigurationForm';

function ManagedClusterForm(props) {
  const {
    pending,
    touch,
  } = props;
  return (
    <Grid className="osd-configuration-form">
      <Row>
        <ConfigurationForm
          header={constants.configurationHeader}
          pending={pending}
          showDNSBaseDomain={false}
          touch={touch}
        />
      </Row>
    </Grid>
  );
}

ManagedClusterForm.propTypes = {
  pending: PropTypes.bool,
  touch: PropTypes.func.isRequired,
};

export default ManagedClusterForm;
