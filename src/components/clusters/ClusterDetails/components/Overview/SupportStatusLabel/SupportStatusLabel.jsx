import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import SupportStatus from '../../../../../common/SupportStatus';

import './SupportStatusLabel.scss';

class SupportStatusLabel extends React.Component {
  componentDidMount() {
    const { fulfilled, pending, getSupportStatus } = this.props;
    if (!fulfilled && !pending) {
      getSupportStatus();
    }
  }

  render() {
    const { pending, error, supportStatus, clusterVersion } = this.props;
    if (pending) {
      return <Skeleton className="inline-skeleton" size="sm" />;
    }
    const supportedVersionRegex = /^[4-6]\.\d{1,3}(\.\d{1,3})?$/;
    const status = supportStatus[clusterVersion.split('.', 2).join('.')];
    if (
      !clusterVersion ||
      clusterVersion === 'N/A' ||
      error ||
      !status ||
      !supportedVersionRegex.test(clusterVersion)
    ) {
      return 'N/A';
    }

    return <SupportStatus status={status} />;
  }
}

SupportStatusLabel.propTypes = {
  pending: PropTypes.bool,
  error: PropTypes.bool,
  fulfilled: PropTypes.bool,
  supportStatus: PropTypes.objectOf(PropTypes.string),
  clusterVersion: PropTypes.string,
  getSupportStatus: PropTypes.func,
};

SupportStatusLabel.defaultProps = {
  supportStatus: {},
};

export default SupportStatusLabel;
