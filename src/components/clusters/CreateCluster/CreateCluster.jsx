import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardHeader,
  CardBody,
  PageSection,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import openShiftDedicatedLogo from '../../../styles/images/Logo-Red_Hat-OpenShift_Dedicated-A-Standard-RGB.svg';
import openShiftContainerPlatformLogo from '../../../styles/images/Logo-Red_Hat-OpenShift-Container_Platform-A-Standard-RGB.svg';
import PageTitle from '../../common/PageTitle';


class CreateCluster extends React.Component {
  componentDidMount() {
    // Try to get quota or organization when the component is first mounted.
    const { getOrganizationAndQuota, organization } = this.props;
    if (!organization.pending) {
      getOrganizationAndQuota();
    }
  }

  render() {
    const { hasQuota, organization } = this.props;
    const title = (
      <PageTitle
        title="Create a Cluster to Get Started"
        breadcrumbs={(
          <Breadcrumb className="breadcrumbs-in-card">
            <LinkContainer to="">
              <BreadcrumbItem to="#">
                Clusters
              </BreadcrumbItem>
            </LinkContainer>
            <BreadcrumbItem isActive>
              Create
            </BreadcrumbItem>
          </Breadcrumb>
        )}
      />
    );

    const osdCardBody = (
      <>
        <CardHeader className="create-cluster-header">
          <img src={openShiftDedicatedLogo} alt="OpenShift Dedicated" className="create-cluster-logo" />
        </CardHeader>
        <CardBody>
          Create a Red Hat-managed cluster (OSD),
          provisioned on Amazon Web Services.
        </CardBody>
      </>
    );

    const osdCard = hasQuota ? (
      <Link to="/create/osd" className="infra-card pf-c-card create-cluster-card">
        {osdCardBody}
      </Link>
    ) : (
      <Card className="infra-card create-cluster-card card-disabled">
        {osdCardBody}
      </Card>
    );

    const ocpCard = (
      <Link to="/install" className="infra-card pf-c-card create-cluster-card">
        <CardHeader className="create-cluster-header">
          <img src={openShiftContainerPlatformLogo} alt="OpenShift Container Platform" className="create-cluster-logo" />
        </CardHeader>
        <CardBody>
          Create an OCP cluster using the command-line installer.
          Your cluster will automatically register to
          the Cluster Manager after installation completes.
        </CardBody>
      </Link>
    );

    const quotaRequestComplete = organization.fulfilled || organization.error;
    return quotaRequestComplete ? (
      <>
        {title}
        <PageSection>
          <Card>
            <div className="pf-c-content ocm-page">
              <div className="flex-container">
                {ocpCard}
                {osdCard}
              </div>
            </div>
          </Card>
        </PageSection>
      </>
    ) : (
      <>
        {title}
        <PageSection>
          <Spinner centered />
        </PageSection>
      </>
    );
  }
}

CreateCluster.propTypes = {
  hasQuota: PropTypes.bool.isRequired,
  organization: PropTypes.object.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
};

export default CreateCluster;
