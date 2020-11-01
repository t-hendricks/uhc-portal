import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Button } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import SupportStatusLabel from '../SupportStatusLabel';
import ClusterUpdateLink from '../../../../common/ClusterUpdateLink';


class ClusterVersionInfo extends React.Component {
  componentDidMount() {
    const { cluster, getSchedules } = this.props;
    if (cluster && cluster.id && cluster.managed) {
      if (cluster.openshift_version) {
        this.fetchVersionInfoIfNeeded();
      }
      getSchedules(cluster.id);
    }
  }

  componentDidUpdate(prevProps) {
    const { cluster, getSchedules } = this.props;
    if (prevProps.cluster.openshift_version !== cluster.openshift_version) {
      this.fetchVersionInfoIfNeeded();
    }
    if (prevProps.cluster.id !== cluster.id && cluster.managed) {
      getSchedules(cluster.id);
    }
  }

  fetchVersionInfoIfNeeded() {
    const { cluster, getVersion, versionInfo } = this.props;
    if ((!versionInfo.fulfilled
          || versionInfo.version !== cluster.openshift_version
          || versionInfo.channelGroup !== cluster.version.channel_group)
        && !versionInfo.pending && cluster.openshift_version && cluster.managed) {
      getVersion(cluster.openshift_version, cluster.version.channel_group);
    }
  }

  render() {
    const {
      cluster, versionInfo, openModal, schedules,
    } = this.props;
    const clusterVersion = cluster.openshift_version || 'N/A';
    const isUpgrading = get(cluster, 'metrics.upgrade.state') === 'running';
    const channel = get(cluster, 'metrics.channel');
    const hasUpgrades = versionInfo.version === cluster.openshift_version
                        && versionInfo.availableUpgrades.length > 0
                        && cluster.managed;

    const scheduledManualUpdate = schedules.items.find(schedule => schedule.schedule_type === 'manual' && schedule.version !== cluster.openshift_version);

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
            osdUpgradeAvailable={hasUpgrades && !scheduledManualUpdate}
          />
        </dd>
        { scheduledManualUpdate && (
          <div>
            <dt>Upgrade scheduled: </dt>
            <dd>
              <DateFormat type="exact" date={Date.parse(scheduledManualUpdate.next_run)} />
              {' '}
              {
                scheduledManualUpdate.state?.value === 'started'
                  ? '(Started)'
                  : cluster.canEdit && (
                    <Button
                      variant="link"
                      onClick={() => openModal('cancel-upgrade', { clusterID: cluster.id, schedule: scheduledManualUpdate })}
                    >
                       Cancel this upgrade
                    </Button>
                  )
              }
            </dd>
          </div>
        )}
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
    version: PropTypes.shape({
      channel_group: PropTypes.string,
    }),
    canEdit: PropTypes.bool,
  }),
  versionInfo: PropTypes.shape({
    fulfilled: PropTypes.bool,
    pending: PropTypes.bool,
    error: PropTypes.bool,
    version: PropTypes.string,
    channelGroup: PropTypes.string,
    availableUpgrades: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  schedules: PropTypes.shape({
    fulfilled: PropTypes.bool,
    pending: PropTypes.bool,
    error: PropTypes.bool,
    items: PropTypes.array,
  }).isRequired,

  getVersion: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  getSchedules: PropTypes.func.isRequired,
};

export default ClusterVersionInfo;
