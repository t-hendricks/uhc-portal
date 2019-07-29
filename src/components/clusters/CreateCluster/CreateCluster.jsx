import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
} from '@patternfly/react-core';
import openShiftDedicatedLogo from '../../../styles/images/Logo-Red_Hat-OpenShift_Dedicated-A-Standard-RGB.svg';
import openShiftContainerPlatformLogo from '../../../styles/images/Logo-Red_Hat-OpenShift-Container_Platform-A-Standard-RGB.svg';
import FavoriteButton from '../../common/FavoriteButton';
import PageTitle from '../../common/PageTitle';


class CreateCluster extends React.Component {
  componentDidMount() {
    // Try to get quota or organization when the component is first mounted.
    // Quota requires the organization, so we can only get it when we have the organization.
    this.getOrganizationAndQuota();
  }

  componentDidUpdate() {
    // If the request for organization was complete, we can get quota now.
    this.getOrganizationAndQuota();
  }

  getOrganizationAndQuota() {
    // TODO! Remove this and make it a part of the redux action + reducer
    const {
      organization, getOrganization, quota, getQuota,
    } = this.props;

    if (!organization.fulfilled && !organization.pending && !organization.error) {
      getOrganization();
    }

    if (organization.fulfilled && !quota.pending && !quota.fulfilled && !quota.error) {
      getQuota(organization.details.id);
    }
  }

  render() {
    const { hasQuota } = this.props;
    const osdCard = (
      <Link to="/create/osd" className="infra-card pf-c-card create-cluster-card">
        <div className="create-cluster-favorite-btn-container">
          <FavoriteButton isActive>Recommended</FavoriteButton>
        </div>
        <CardHeader className="create-cluster-header">
          <img src={openShiftDedicatedLogo} alt="OpenShift Dedicated" className="create-cluster-logo" />
        </CardHeader>
        <CardBody>
          Create a Red Hat-managed cluster (OSD),
          provisioned on Amazon Web Services.
        </CardBody>
      </Link>
    );

    const ocpCard = (
      <Link to="/install" className="infra-card pf-c-card create-cluster-card">
        <CardHeader className="create-cluster-header">
          <img src={openShiftContainerPlatformLogo} alt="OpenShift Container Platform" className="create-cluster-logo" />
        </CardHeader>
        <CardBody>
          Install an OCP cluster manually and manage it yourself.
          Once installation is complete, the cluster will be automatically
          registered to the Cluster Manager.
        </CardBody>
      </Link>
    );

    return (
      <React.Fragment>
        <Card>
          <div className="pf-c-content ocm-page">
            <PageTitle title="Create a Cluster to Get Started" />
            <div className="flex-container">
              {hasQuota && (<React.Fragment>{osdCard}</React.Fragment>)}
              {ocpCard}
            </div>
          </div>
        </Card>
      </React.Fragment>
    );
  }
}

CreateCluster.propTypes = {
  hasQuota: PropTypes.bool.isRequired,
  getOrganization: PropTypes.func.isRequired,
  getQuota: PropTypes.func.isRequired,
  quota: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
};

export default CreateCluster;
