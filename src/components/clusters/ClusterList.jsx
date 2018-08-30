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

import * as _ from 'lodash-es';
import React, { Component } from 'react';
import classNames from 'classnames';

import {
  ListView, Button, Grid, Row, EmptyState,
} from 'patternfly-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ClusterListToolBar from './ClusterListToolBar';
import CreateClusterModal from './CreateClusterModal';
import ViewPaginationRow from './viewPaginationRow';
import LoadingModal from './LoadingModal';

import helpers from '../../common/helpers';
import { viewConstants } from '../../redux/constants';
import { fetchClusters } from '../../redux/actions/clusterActions';

export const renderAdditionalInfoItems = (itemProperties, state) => {
  const generateStateInfoItem = (clusterState) => {
    let text;
    let icon;
    switch (clusterState) {
      case 'Installing':
        [text, icon] = ['Installing...', 'warning-triangle-o'];
        break;
      case 'Error':
        [text, icon] = ['Error', 'error-circle-o'];
        break;
      default:
        [text, icon] = ['Ready', 'ok'];
    }
    return (
      <ListView.InfoItem key="clusterState">
        <ListView.Icon name={icon} type="pf" />
        <span>
          {text}
        </span>
      </ListView.InfoItem>
    );
  };

  const infoItems = [generateStateInfoItem(state)];

  return infoItems.concat(Object.keys(itemProperties).map((prop) => {
    const cssClassNames = classNames('pficon', {
      'pficon-flavor': prop === 'hosts',
      'pficon-cluster': prop === 'clusters',
      'pficon-container-node': prop === 'nodes',
      'pficon-image': prop === 'images',
    });
    return (
      <ListView.InfoItem key={prop}>
        <span className={cssClassNames} />
        <strong>
          {itemProperties[prop]}
        </strong>
        {' '}
        {prop}
      </ListView.InfoItem>
    );
  }));
};

class ClusterList extends Component {
  state = {
    clusterCreationModalVisible: false,
  }

  componentDidMount() {
    this.refresh();
  }

  componentWillUpdate(nextProps) {
    // Check for changes resulting in a fetch
    if (helpers.viewPropsChanged(nextProps.viewOptions, this.props.viewOptions)) {
      this.refresh(nextProps);
    }
  }

  setModalState(show) {
    this.setState((prevState) => {
      return ({ ...prevState, clusterCreationModalVisible: show });
    });
  }


  refresh(props) {
    const options = _.get(props, 'viewOptions') || this.props.viewOptions;
    this.props.fetchClusters(helpers.createViewQueryObject(options));
  }

  renderPendingMessage() {
    const { pending } = this.props;

    if (pending) {
      return (
        <LoadingModal>
          Loading clusters...
        </LoadingModal>
      );
    }

    return null;
  }

  renderCreateClusterButton() {
    return (
      <Button bsStyle="primary" bsSize="large" onClick={() => { this.setModalState(true); }}>
        Create cluster
      </Button>
    );
  }

  renderClusterCreationModal() {
    const { clusterCreationModalVisible } = this.state;
    if (clusterCreationModalVisible === true) {
      return (
        <CreateClusterModal closeFunc={() => this.setModalState(false)} />
      );
    }
    return '';
  }

  render() {
    const {
      error, pending, clusters, viewOptions,
    } = this.props;

    if (error) {
      return this.renderError();
    }

    if (pending) {
      return this.renderPendingMessage();
    }

    if (!_.size(clusters)) {
      return (
        <React.Fragment>
          <Grid fluid>
            <Row>
              <EmptyState className="full-page-blank-slate">
                <EmptyState.Icon />
                <EmptyState.Title>
No clusters have been added
                </EmptyState.Title>
                <EmptyState.Info>
Add clusters to show them in this view.
                </EmptyState.Info>
                <EmptyState.Action>
                  {this.renderCreateClusterButton()}
                </EmptyState.Action>
              </EmptyState>
            </Row>
          </Grid>
          {this.renderClusterCreationModal()}
          {this.renderPendingMessage()}
        </React.Fragment>
      );
    }

    // Add fake data. I hope we can remove this soon...
    const fakeClusters = clusters.map(cluster => Object.assign(
      {},
      {
        clusterID: cluster.id,
        title: cluster.name,
        state: cluster.state,
        properties: { nodes: cluster.nodes.total },
      },
    ));

    const maintenanceIcon = <ListView.Icon name="maintenance" type="pf" className="maintenance" />;
    const clusterIcon = <ListView.Icon name="cluster" type="pf" />;
    return (
      <div>
        <ClusterListToolBar>
          {this.renderCreateClusterButton()}
        </ClusterListToolBar>
        <ListView>
          {fakeClusters.map(({
            properties, clusterID, title, description, state,
          }) => (
            <ListView.Item
              key={`cluster${clusterID}`}
              actions={(
                <Link to={`/cluster/${clusterID}`}>
                  <Button>
                        Details
                  </Button>
                </Link>
                  )}
              leftContent={state === 'Installing' ? maintenanceIcon : clusterIcon}
              additionalInfo={renderAdditionalInfoItems(properties, state)}
              heading={title}
              description={description}
              stacked={false}
              hideCloseIcon={false}
            />
          ))}
        </ListView>
        <ViewPaginationRow
          viewType={viewConstants.CLUSTERS_VIEW}
          currentPage={viewOptions.currentPage}
          pageSize={viewOptions.pageSize}
          totalCount={viewOptions.totalCount}
          totalPages={viewOptions.totalPages}
        />
        {this.renderClusterCreationModal()}
      </div>
    );
  }
}

ClusterList.propTypes = {
  fetchClusters: PropTypes.func,
  clusters: PropTypes.array,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  pending: PropTypes.bool,
  fulfilled: PropTypes.bool,
  viewOptions: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchClusters: queryObj => dispatch(fetchClusters(queryObj)),
});

const mapStateToProps = state => Object.assign({}, state.cluster.clusters, {
  viewOptions: state.viewOptions[viewConstants.CLUSTERS_VIEW],
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClusterList);
