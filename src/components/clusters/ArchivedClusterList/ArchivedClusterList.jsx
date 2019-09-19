/*
Copyright (c) 2019 Red Hat, Inc.

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

import size from 'lodash/size';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Spinner } from '@redhat-cloud-services/frontend-components';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

import {
  Alert,
  AlertActionCloseButton, Breadcrumb, BreadcrumbItem,
  Card,
  EmptyState,
  Split,
  SplitItem,
} from '@patternfly/react-core';

import ClusterListFilter from '../common/ClusterListFilter';
import ArchivedClusterListTable from './components/ArchiveClusterListTable/ArchivedClusterListTable';
import RefreshBtn from '../../common/RefreshButton/RefreshButton';
import ErrorTriangle from '../common/ErrorTriangle';
import GlobalErrorBox from '../common/GlobalErrorBox';


import ErrorBox from '../../common/ErrorBox';
import UnarchiveClusterDialog from '../common/UnarchiveClusterDialog';

import ViewPaginationRow from '../common/ViewPaginationRow/viewPaginationRow';
import helpers from '../../../common/helpers';
import { viewConstants } from '../../../redux/constants';


class ArchivedClusterList extends Component {
  constructor(props) {
    super(props);

    // refresh needs to be bound because it is passed to another component
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    document.title = 'Archived Clusters | Red Hat OpenShift Cluster Manager';
    const {
      getCloudProviders, cloudProviders, setListFlag,
    } = this.props;

    setListFlag('showArchived', true);

    if (!cloudProviders.fulfilled && !cloudProviders.pending) {
      getCloudProviders();
    }
  }

  componentDidUpdate(prevProps) {
    // Check for changes resulting in a fetch
    const {
      viewOptions, valid, pending, unarchivedCluster, closeToast,
    } = this.props;
    if ((!valid && !pending)
      || helpers.viewPropsChanged(viewOptions, prevProps.viewOptions)) {
      this.refresh();
    }
    if (!prevProps.unarchivedCluster.showToast && unarchivedCluster.showToast) {
      setTimeout(closeToast, 8000);
    }
  }

  componentWillUnmount() {
    const { closeModal, invalidateClusters } = this.props;
    closeModal();
    invalidateClusters();
  }

  refresh() {
    const { fetchClusters, viewOptions } = this.props;
    fetchClusters(helpers.createViewQueryObject(viewOptions));
  }

  render() {
    const {
      error,
      valid,
      pending,
      clusters,
      viewOptions,
      setSorting,
      openModal,
      invalidateClusters,
      errorMessage,
      unarchivedCluster,
      operationID,
      closeToast,
    } = this.props;

    const toast = unarchivedCluster.showToast && (
      <Alert
        className="archived-cluster-toast"
        variant="success"
        title="Cluster successfully unarchived"
        action={<AlertActionCloseButton onClose={() => closeToast()} />}
      />
    );

    const breadCrumbs = (
      <Breadcrumb className="breadcrumbs-in-card">
        <LinkContainer to="">
          <BreadcrumbItem to="#">
            Clusters
          </BreadcrumbItem>
        </LinkContainer>
        <BreadcrumbItem isActive>
          Archived clusters
        </BreadcrumbItem>
      </Breadcrumb>
    );

    if (error && !size(clusters)) {
      return (
        <React.Fragment>
          {toast}
          <EmptyState>
            <ErrorBox
              message="Error retrieving archived clusters"
              response={{
                errorMessage,
                operationID,
              }}
            />
          </EmptyState>
        </React.Fragment>);
    }

    if ((!size(clusters) && pending && (isEmpty(viewOptions.filter) || !valid))) {
      return (
        <React.Fragment>
          {toast}
          <Card>
            <div className="cluster-list pf-c-content ocm-page">
              {breadCrumbs}
              <h1>Archived Clusters</h1>
              <div className="cluster-loading-container">
                <Spinner centered />
              </div>
            </div>
          </Card>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {toast}
        <Card>
          <div className="cluster-list pf-c-content ocm-page">
            {breadCrumbs}
            <GlobalErrorBox />
            <h1>Archived Clusters</h1>
            <Split id="cluster-list-top">
              <SplitItem>
                <ClusterListFilter view={viewConstants.ARCHIVED_CLUSTERS_VIEW} />
              </SplitItem>
              <SplitItem className="pf-l-split__item split-margin-left">
                <div className="show-active-clusters-link">
                  <Link to="/">
                    Show active clusters
                  </Link>
                </div>
              </SplitItem>
              <SplitItem className="spinner-fit-container">
                { pending && <Spinner className="cluster-list-spinner" /> }
                { error && <ErrorTriangle errorMessage={errorMessage} className="cluster-list-warning" /> }
              </SplitItem>
              <SplitItem isFilled />
              <SplitItem>
                <ViewPaginationRow
                  viewType={viewConstants.ARCHIVED_CLUSTERS_VIEW}
                  currentPage={viewOptions.currentPage}
                  pageSize={viewOptions.pageSize}
                  totalCount={viewOptions.totalCount}
                  totalPages={viewOptions.totalPages}
                  variant="top"
                />
              </SplitItem>
              <SplitItem>
                <RefreshBtn autoRefresh refreshFunc={this.refresh} classOptions="cluster-list-top" />
              </SplitItem>
            </Split>
            <ArchivedClusterListTable
              clusters={clusters || []}
              viewOptions={viewOptions}
              setSorting={setSorting}
              openModal={openModal}
            />
            <ViewPaginationRow
              viewType={viewConstants.ARCHIVED_CLUSTERS_VIEW}
              currentPage={viewOptions.currentPage}
              pageSize={viewOptions.pageSize}
              totalCount={viewOptions.totalCount}
              totalPages={viewOptions.totalPages}
              variant="bottom"
            />
            <UnarchiveClusterDialog onClose={invalidateClusters} />
          </div>
        </Card>
      </React.Fragment>
    );
  }
}

ArchivedClusterList.propTypes = {
  invalidateClusters: PropTypes.func.isRequired,
  fetchClusters: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  clusters: PropTypes.array.isRequired,
  error: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  pending: PropTypes.bool.isRequired,
  viewOptions: PropTypes.object.isRequired,
  setSorting: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  setListFlag: PropTypes.func.isRequired,
  operationID: PropTypes.string,
  unarchivedCluster: PropTypes.shape({
    showToast: PropTypes.bool.isRequired,
  }),
  closeToast: PropTypes.func.isRequired,
};

export default ArchivedClusterList;
