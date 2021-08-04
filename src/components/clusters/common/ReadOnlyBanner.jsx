import React from 'react';
import PropTypes from 'prop-types';

import {
  Banner, Text,
} from '@patternfly/react-core';

function ReadOnlyBanner({ isReadOnly, someReadOnly }) {
  if (isReadOnly) {
    return (
      <Banner variant="warning" className="configuration_mode_read_only">
        <Text>
          <b>You will be unable to configure your cluster during maintenance.</b>
        </Text>
        <Text>
          Actions like configuring identity providers and updating cluster settings
          are disabled until maintenance is complete.
          More information may be available under
          {' '}
          <b>Cluster history</b>
          {' '}
          in Overview tab.
        </Text>
      </Banner>
    );
  }
  if (someReadOnly) {
    return (
      <Banner variant="warning" className="configuration_mode_read_only">
        <Text>
          <b>You will be unable to configure some of your clusters during maintenance.</b>
        </Text>
        <Text>
          Actions like configuring identity providers and updating cluster settings
          are disabled until maintenance is complete.
        </Text>
      </Banner>
    );
  }
  return null;
}
ReadOnlyBanner.propTypes = {
  isReadOnly: PropTypes.bool,
  someReadOnly: PropTypes.bool,
};

export default ReadOnlyBanner;
