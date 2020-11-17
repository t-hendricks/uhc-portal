import React from 'react';
import { Label, Popover } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { Skeleton } from '@redhat-cloud-services/frontend-components';
import './SupportStatusLabel.scss';

class SupportStatusLabel extends React.Component {
  componentDidMount() {
    const { fulfilled, pending, getSupportStatus } = this.props;
    if (!fulfilled && !pending) {
      getSupportStatus();
    }
  }

  render() {
    const {
      pending,
      error,
      supportStatus,
      clusterVersion,
    } = this.props;
    if (pending) {
      return <Skeleton className="inline-skeleton" size="sm" />;
    }
    const supportedVersionRegex = /^[4-6]\.\d{1,3}(\.\d{1,3})?$/;
    const status = supportStatus[clusterVersion.split('.', 2).join('.')];
    if (!clusterVersion || clusterVersion === 'N/A' || error || !status || !supportedVersionRegex.test(clusterVersion)) {
      return 'N/A';
    }
    const defaultLabelProps = { color: 'blue', variant: 'outline' };
    const clickableLabelProps = { ...defaultLabelProps, className: 'cluster-support-label-clickable' };
    const popoverFooter = (
      <>
        See
        {' '}
        <a href="https://access.redhat.com/support/policy/updates/openshift" rel="noopener noreferrer" target="_blank">this resource</a>
        {' '}
        to learn more about the support lifecycle.
      </>
    );

    switch (status.toLowerCase()) {
      case 'full support':
        return (
          <Popover
            className="cluster-support-status-popover"
            aria-label="full support"
            bodyContent="This minor version of OpenShift is fully supported.
            In order to receive security and bug fixes, continue to install patch (z-stream)
            updates to your cluster or upgrade to the latest minor version when available."
            footerContent={popoverFooter}
          >
            <Label {...clickableLabelProps}>Full support</Label>
          </Popover>
        );
      case 'maintenance support':
        return (
          <Popover
            className="cluster-support-status-popover"
            aria-label="Maintenance Support"
            bodyContent="This minor version of OpenShift has reached the maintenance support phase.
            Critical and selected high priority fixes will continue to be delivered in patch (z-stream) releases."
            footerContent={popoverFooter}
          >
            <Label {...clickableLabelProps}>Maintenance support</Label>
          </Popover>
        );
      case 'extended update support':
        return (
          <Popover
            className="cluster-support-status-popover"
            aria-label="Extended update support"
            bodyContent=" This minor version of OpenShift has reached the extended update support phase.
            Critical and selected high priority fixes will continue to be delivered in patch (z-stream) releases."
            footerContent={popoverFooter}
          >
            <Label {...clickableLabelProps}>Extended update support</Label>
          </Popover>
        );
      case 'end of life':
        return (
          <Popover
            className="cluster-support-status-popover"
            aria-label="End of life"
            bodyContent=" This minor version of OpenShift has reached the end of life and is no longer supported.
            Upgrade to a newer version so that this cluster is supportable."
            footerContent={popoverFooter}
          >
            <Label color="red" className="cluster-support-label-clickable">End of life</Label>
          </Popover>
        );
      default:
        return <Label {...defaultLabelProps}>{status}</Label>;
    }
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
