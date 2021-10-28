import React from 'react';
import PropTypes from 'prop-types';

class EntitlementConfig extends React.Component {
  componentDidMount() {
    const { fulfilled, pending, createRosaEntitlement } = this.props;
    if (!fulfilled && !pending) {
      createRosaEntitlement();
    }
  }

  render() { return null; }
}

EntitlementConfig.propTypes = {
  pending: PropTypes.bool,
  fulfilled: PropTypes.bool,
  createRosaEntitlement: PropTypes.func,
};

export default EntitlementConfig;
