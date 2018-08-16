/*
 Copyright (c) 2018 Red Hat, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Alert, Row, Col, Icon,
} from 'patternfly-react';

import PropTypes from 'prop-types';
import {
  CardGrid, Card, CardBody, CardTitle, AggregateStatusCount,
} from 'patternfly-react/dist/js/components/Cards';
import { fetchClusterDetails } from '../../redux/actions/clusterDetails';
import clusterDetailsSelector from '../../selectors/clusterDetails';
import ClusterUtilizationCard from './ClusterUtilizationCard';

class ClusterDetails extends Component {
  componentDidMount() {
    const { fetchDetails, match } = this.props;
    const clusterID = match.params.id;
    if (clusterID !== null && clusterID !== undefined) {
      fetchDetails(clusterID);
    }
  }

  componentDidUpdate(prevProps) {
    const { fetchDetails, match } = this.props;
    const clusterID = match.params.id;
    const oldClusterID = prevProps.match.params.id;
    if (clusterID !== oldClusterID && clusterID !== null && clusterID !== undefined) {
      fetchDetails(clusterID);
    }
  }

  render() {
    const { details, match } = this.props;
    const cluster = details[match.params.id];
    if (cluster === undefined) {
      return <div />;
    }
    if (cluster.error !== undefined) {
      return (
        <Alert>
          {cluster.error}
        </Alert>
      );
    }
    return (
      <div>
        <h1>
          {cluster.name}
        </h1>
        <CardGrid>
          <Row style={{ marginBottom: '20px', marginTop: '20px' }}>
            <Col xs={3}>
              <Card accented aggregated>
                <CardTitle>
                  <Icon type="pf" name="container-node" />
                  <AggregateStatusCount>
                    {cluster.nodes.total}
                  </AggregateStatusCount>
                  Nodes
                </CardTitle>
              </Card>
            </Col>
            <Col xs={3}>
              <Card accented aggregated>
                <CardTitle>
                  <Icon type="pf" name="users" />
                  <AggregateStatusCount>
                    ???
                  </AggregateStatusCount>
                  Users
                </CardTitle>
              </Card>
            </Col>
            <Col xs={3}>
              <Card accented aggregated>
                <CardTitle>
                  <Icon type="pf" name="project" />
                  <AggregateStatusCount>
                    ???
                  </AggregateStatusCount>
                  Projects
                </CardTitle>
              </Card>
            </Col>
            <Col xs={3}>
              <Card accented aggregated>
                <CardTitle>
                  <Icon type="fa" name="cubes" />
                  <AggregateStatusCount>
                    ???
                  </AggregateStatusCount>
                  Pods
                </CardTitle>
              </Card>
            </Col>
          </Row>
        </CardGrid>
        <CardGrid>
          <Row style={{ marginTop: '20px' }}>
            <Col>
              <Card>
                <CardTitle>
                  <Icon type="fa" name="tachometer" />
                  Cluster Utilization
                </CardTitle>
                <CardBody>
                  <CardGrid>
                    <Row style={{ marginTop: '20px' }}>
                      <Col xs={6} sm={3} md={3}>
                        <ClusterUtilizationCard title="CPU" total={cluster.cpu.total} unit="Cores" used={cluster.cpu.used} donutId="cpu_donut" />
                      </Col>
                      <Col xs={6} sm={3} md={3}>
                        <ClusterUtilizationCard title="Memory" total={cluster.memory.total} unit="GiB" used={cluster.memory.used} donutId="memory_donut" />
                      </Col>
                      <Col xs={6} sm={3} md={3}>
                        <ClusterUtilizationCard title="Storage" total={cluster.storage.total} unit="GiB" used={cluster.storage.used} donutId="storage_donut" />
                      </Col>
                    </Row>
                  </CardGrid>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardGrid>
        <CardGrid>
          <Row>
            <Col>
              <Card>
                <CardTitle>
                  <Icon type="pf" name="info" />
                  Cluster info
                </CardTitle>
                <CardBody>
                  <Row>
                    <Col sm={6}>
                      <dl className="dl-horizontal left">
                        <dt>
                          Status
                        </dt>
                        <dd>
                          {cluster.state}
                        </dd>
                        <dt>
                          Cluster Name
                        </dt>
                        <dd>
                          {cluster.name}
                        </dd>
                        <dt>
                          Provider
                        </dt>
                        <dd>
                          ??????
                        </dd>
                        <dt>
                          Region
                        </dt>
                        <dd>
                          {cluster.region}
                        </dd>
                        <dt>
                          OpenShift Version
                        </dt>
                        <dd>
                          ????
                        </dd>
                        <dt>
                          Container Runtime
                        </dt>
                        <dd>
                          ????
                        </dd>
                        <dt>
                          OS Version
                        </dt>
                        <dd>
                          ????
                        </dd>
                      </dl>
                    </Col>
                    <Col sm={6}>
                      <dl className="dl-horizontal left">
                        <dt>
                          Masters
                        </dt>
                        <dd>
                          {cluster.nodes.master}
                          {' '}
                          Master nodes
                        </dd>
                        <dt>
                          Infrastructure
                        </dt>
                        <dd>
                          {cluster.nodes.infra}
                          {' '}
                          Nodes
                        </dd>
                        <dt>
                          Compute
                        </dt>
                        <dd>
                          {cluster.nodes.compute}
                          {' '}
                          Nodes
                        </dd>
                        <dt>
                          vCPU
                        </dt>
                        <dd>
                          {cluster.cpu.total}
                          {' '}
                          Cores
                        </dd>
                        <dt>
                          Memory
                        </dt>
                        <dd>
                          {cluster.memory.total}
                          {' '}
                          (unit unknown)
                        </dd>
                        <dt>
                          Storage
                        </dt>
                        <dd>
                          {cluster.storage.total}
                          {' '}
                          (unit unknown)
                        </dd>
                        <dt>
                          Network
                        </dt>
                        <dd>
                          ?????????
                        </dd>
                      </dl>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardGrid>
      </div>);
  }
}

ClusterDetails.propTypes = {
  match: PropTypes.object.isRequired,
  fetchDetails: PropTypes.func.isRequired,
  details: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  details: clusterDetailsSelector(state),
});

const mapDispatchToProps = {
  fetchDetails: fetchClusterDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);
