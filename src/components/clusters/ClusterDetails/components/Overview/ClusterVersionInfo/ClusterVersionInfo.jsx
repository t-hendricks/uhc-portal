import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  Button,
  Flex,
  Popover,
} from '@patternfly/react-core';

import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import SupportStatusLabel from '../SupportStatusLabel';
import ClusterUpdateLink from '../../../../common/ClusterUpdateLink';
import UpgradeStatus from '../../../../common/Upgrades/UpgradeStatus';
import UpgradeAcknowledgeLink from '../../../../common/Upgrades/UpgradeAcknowledge/UpgradeAcknowledgeLink';

class ClusterVersionInfo extends React.Component {
  state = {
    popoverOpen: false,
  };

  componentDidMount() {
    const { cluster, getSchedules } = this.props;
    if (cluster && cluster.id && cluster.managed) {
      getSchedules(cluster.id);
    }
  }

  componentDidUpdate(prevProps) {
    const { cluster, getSchedules } = this.props;
    if (prevProps.cluster.id !== cluster.id && cluster.managed) {
      getSchedules(cluster.id);
    }
  }

  componentWillUnmount() {
    const { clearSchedulesResponse } = this.props;
    clearSchedulesResponse();
  }

  render() {
    const {
      cluster, openModal, schedules,
    } = this.props;
    const { popoverOpen } = this.state;
    const isUpgrading = get(cluster, 'metrics.upgrade.state') === 'running';
    const clusterVersion = (isUpgrading ? cluster.version?.raw_id : cluster.openshift_version) || 'N/A';
    const channel = get(cluster, 'metrics.channel');

    const scheduledUpdate = schedules.items.find(
      schedule => schedule.version !== cluster.version?.raw_id,
    );

    return (
      <div>
        <dl className="pf-l-stack">
          <Flex>
            <dt>
              OpenShift:
              {' '}
            </dt>
            <dd>
              {clusterVersion}
              <ClusterUpdateLink
                cluster={cluster}
                openModal={openModal}
                hideOSDUpdates={!!scheduledUpdate}
              />
              { scheduledUpdate && scheduledUpdate.schedule_type === 'automatic' && !isUpgrading
                ? (<UpgradeAcknowledgeLink clusterId={cluster.id} />) : null}
            </dd>
          </Flex>
          { scheduledUpdate && scheduledUpdate.schedule_type === 'manual' && (
            <div>
              <Flex>
                <dt>Update scheduled: </dt>
                <dd>
                  <Popover
                    headerContent="Update status"
                    isVisible={popoverOpen}
                    shouldOpen={() => this.setState({ popoverOpen: true })}
                    shouldClose={() => this.setState({ popoverOpen: false })}
                    bodyContent={(
                      <UpgradeStatus
                        clusterID={cluster.id}
                        canEdit={cluster.canEdit}
                        clusterVersion={cluster.openshift_version}
                        clusterVersionRawID={cluster.version?.raw_id}
                        scheduledUpgrade={scheduledUpdate}
                        openModal={openModal}
                        // eslint-disable-next-line camelcase
                        availableUpgrades={cluster.version?.available_upgrades}
                        onCancelClick={() => this.setState({ popoverOpen: false })}
                      />
                    )}
                  >
                    <Button variant="link">
                      View details
                      {' '}
                      <OutlinedQuestionCircleIcon />
                    </Button>
                  </Popover>
                </dd>
              </Flex>
            </div>
          )}
          { !cluster.managed && !isUpgrading && (
          <div>
            <Flex>
              <dt>Life cycle state: </dt>
              <dd>
                <SupportStatusLabel clusterVersion={clusterVersion} />
              </dd>
            </Flex>
          </div>
          )}
          { channel && (
          <div>
            <Flex>
              <dt>Update channel: </dt>
              <dd>{channel}</dd>
            </Flex>
          </div>
          )}
        </dl>
      </div>
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
      available_upgrades: PropTypes.arrayOf(PropTypes.string),
      raw_id: PropTypes.string,
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
  openModal: PropTypes.func.isRequired,
  getSchedules: PropTypes.func.isRequired,
  clearSchedulesResponse: PropTypes.func.isRequired,
};

export default ClusterVersionInfo;
