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
import * as fromClusterDetails from './ducks/clusterdetails';
import { Alert, Row, Col, Icon, DonutChart, UtilizationCard, UtilizationCardDetails, 
         UtilizationCardDetailsCount, UtilizationCardDetailsDesc, UtilizationCardDetailsLine1, UtilizationCardDetailsLine2 } from 'patternfly-react'

import PropTypes from 'prop-types'
import { CardGrid, Card, CardBody, CardTitle, AggregateStatusCount } from 'patternfly-react/dist/js/components/Cards';
import ClusterUtilizationCard from './components/ClusterUtilizationCard' 

class ClusterDetails extends Component {
  componentDidMount() {
    const clusterID = this.props.match.params.id;
    if (clusterID !== null && clusterID !== undefined) {
      this.props.fetchClusterDetails(clusterID);
    }
  }

  componentDidUpdate(prevProps) {
    const clusterID = this.props.match.params.id;
    const oldClusterID = prevProps.match.params.id;
    if (clusterID !== oldClusterID && clusterID !== null && clusterID !== undefined) {
      this.props.fetchClusterDetails(clusterID);
    }
  }

  close() {
    this.props.hideClusterDetails()
  }

  render() {
    console.log(this.props)
    const details = this.props.details[this.props.match.params.id];
    if (details === undefined) {
      return <div />
    }
    if (details.error !== undefined) {
      return (
        <Alert>{details.error}</Alert>
      )
    }
    return (
      <div>
        <h1>{details.name}</h1>
        <CardGrid>
          <Row  style={{marginBottom: '20px',marginTop: '20px'}}>
            <Col xs={3}>
              <Card accented aggregated>
                <CardTitle>
                  <Icon type="pf" name="container-node" />
                  <AggregateStatusCount>
                    {details.nodes.total}
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
          <Row  style={{marginTop: '20px'}}>
            <Col>
              <Card>
                <CardTitle>
                  <Icon type="fa" name="tachometer" />
                  Cluster Utilization
                </CardTitle>
                <CardBody>
                  <CardGrid>
                    <Row style={{marginTop: '20px'}}>
                      <Col xs={6} sm={3} md={3}>
                        <ClusterUtilizationCard title="CPU" total={details.cpu.total} available={10} unit="Cores" used={10} donut_id="cpu_donut" />
                      </Col>
                      <Col xs={6} sm={3} md={3}>
                        <ClusterUtilizationCard title="Memory" total={details.memory.total} available={100} unit="GiB" used={10} donut_id="memory_donut" />
                      </Col>
                      <Col xs={6} sm={3} md={3}>
                        <ClusterUtilizationCard title="Storage" total={details.storage.total} available={100} unit="GiB" used={10} donut_id="storage_donut" />
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
                      <dl class="dl-horizontal left">
                        <dt>Status</dt>
                        <dd>??????</dd>
                        <dt>Cluster Name</dt>
                        <dd>{details.name}</dd>
                        <dt>Provider</dt>
                        <dd>??????</dd>
                        <dt>Region</dt>
                        <dd>{details.region}</dd>
                        <dt>OpenShift Version</dt>
                        <dd>????</dd>
                        <dt>Container Runtime</dt>
                        <dd>????</dd>
                        <dt>OS Version</dt>
                        <dd>????</dd>
                      </dl>
                    </Col>
                    <Col sm={6}>
                      <dl class="dl-horizontal left">
                        <dt>Masters</dt>
                        <dd>{details.nodes.master} Master nodes</dd>
                        <dt>Infrastructure</dt>
                        <dd>{details.nodes.infra} Nodes</dd>
                        <dt>Compute</dt>
                        <dd>{details.nodes.compute} Nodes</dd>
                        <dt>vCPU</dt>
                        <dd>{details.cpu.total} Cores</dd>
                        <dt>Memory</dt>
                        <dd>{details.memory.total} (unit unknown)</dd>
                        <dt>Storage</dt>
                        <dd>{details.storage.total} (unit unknown)</dd>
                        <dt>Network</dt>
                        <dd>?????????</dd>
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
  fetchClusterDetails: PropTypes.func.isRequired,
  details: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  details: fromClusterDetails.getClusterDetails(state)
});

const mapDispatchToProps = {
  fetchClusterDetails: fromClusterDetails.fetchClusterDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);