import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import SupportStatusLabel from '../SupportStatusLabel';
import ClusterUpdateLink from '../../../../common/ClusterUpdateLink';


class ClusterVersionInfo extends React.Component {
  componentDidMount() {
    const { cluster } = this.props;
    if (cluster && cluster.openshift_version) {
      this.fetchVersionInfoIfNeeded();
    }
  }

  componentDidUpdate(prevProps) {
    const { cluster } = this.props;
    if (prevProps.cluster.openshift_version !== cluster.openshift_version) {
      this.fetchVersionInfoIfNeeded();
    }
  }

  fetchVersionInfoIfNeeded() {
    const { cluster, getVersion, versionInfo } = this.props;
    if ((!versionInfo.fulfilled || versionInfo.version !== cluster.openshift_version)
        && !versionInfo.pending && cluster.openshift_version && cluster.managed) {
      getVersion(cluster.openshift_version);
    }
  }

  render() {
    const { cluster, versionInfo, openModal } = this.props;
    const clusterVersion = cluster.openshift_version || 'N/A';
    const isUpgrading = get(cluster, 'metrics.upgrade.state') === 'running';
    const channel = get(cluster, 'metrics.channel');
    const hasUpgrades = versionInfo.version === cluster.openshift_version
                        && versionInfo.availableUpgrades.length > 0
                        && cluster.managed;

    return (
      <dl className="cluster-details-item-list">
        <dt>
          OpenShift:
          {' '}
        </dt>
        <dd>
          {clusterVersion}
          <ClusterUpdateLink
            cluster={cluster}
            openModal={openModal}
            osdUpgradeAvailable={hasUpgrades}
          />
        </dd>
        { !cluster.managed && !isUpgrading && (
        <div>
          <dt>Life cycle state: </dt>
          <dd>
            <SupportStatusLabel clusterVersion={clusterVersion} />
          </dd>
        </div>
        )}
        { channel && (
        <div>
          <dt>Upgrade channel: </dt>
          <dd>{channel}</dd>
        </div>
        )}
      </dl>
    );
  }
}

ClusterVersionInfo.propTypes = {
  cluster: PropTypes.shape({
    id: PropTypes.string.isRequired,
    openshift_version: PropTypes.string,
    managed: PropTypes.bool,
  }),
  versionInfo: PropTypes.shape({
    fulfilled: PropTypes.bool,
    pending: PropTypes.bool,
    error: PropTypes.bool,
    version: PropTypes.string,
    availableUpgrades: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  getVersion: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default ClusterVersionInfo;
