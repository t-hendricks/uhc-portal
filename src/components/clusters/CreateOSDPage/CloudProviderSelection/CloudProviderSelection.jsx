import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import {
  Card,
  CardBody,
  PageSection,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import Unavailable from '../../../common/Unavailable';
import CardBadge from '../../common/CardBadge';
import Breadcrumbs from '../../../common/Breadcrumbs';
import PageTitle from '../../../common/PageTitle';
import { noQuotaTooltip, shouldRefetchQuota } from '../../../../common/helpers';
import { normalizedProducts } from '../../../../common/subscriptionTypes';
import AWSLogo from '../../../../styles/images/AWS.png';
import GCPLogo from '../../../../styles/images/google-cloud-logo.svg';
import './CloudProviderSelection.scss';

class CloudProviderSelection extends Component {
  componentDidMount() {
    document.title = 'Create an OpenShift Dedicated cluster | Red Hat OpenShift Cluster Manager | Choose your cloud provider';
    const { getOrganizationAndQuota, organization } = this.props;
    if (shouldRefetchQuota(organization)) {
      getOrganizationAndQuota();
    }
  }

  render() {
    const {
      hasProductQuota,
      hasGcpQuota,
      hasAwsQuota,
      organization,
      product,
    } = this.props;

    const selectedOSDTrial = product === normalizedProducts.OSDTrial;
    const productSlug = product.toLowerCase();

    if (!organization.pending && (organization.fulfilled || organization.error)) {
      const noTrialQuota = (selectedOSDTrial && !hasProductQuota);
      if (noTrialQuota || (!hasGcpQuota && !hasAwsQuota)) {
        return (
          <Redirect to={`/create${noTrialQuota ? '?trial=expired' : ''}`} />
        );
      }
    }

    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'OpenShift Dedicated' },
      ]}
      />
    );

    const gcpCardBody = (
      <CardBody>
        <img src={GCPLogo} alt="GCP" className="create-cluster-logo" />
        <Title headingLevel="h5" size="lg">Run on Google Cloud Platform</Title>
      </CardBody>
    );

    const gcpCard = hasGcpQuota ? (
      <Link to={`/create/${productSlug}/gcp`} className="infra-card create-cluster-card pf-c-card">
        {gcpCardBody}
      </Link>
    ) : (
      <Tooltip content={noQuotaTooltip}>
        <Card className="infra-card create-cluster-card card-disabled">
          {gcpCardBody}
        </Card>
      </Tooltip>
    );

    const awsCardBody = (
      <CardBody>
        <img src={AWSLogo} alt="AWS" className="create-cluster-logo" />
        <Title headingLevel="h5" size="lg">Run on Amazon Web Services</Title>
      </CardBody>
    );

    const awsCard = hasAwsQuota ? (
      <Link to={`/create/${productSlug}/aws`} className="infra-card create-cluster-card pf-c-card">
        <CardBadge isHidden />
        {awsCardBody}
      </Link>
    ) : (
      <Tooltip content={noQuotaTooltip}>
        <Card className="infra-card create-cluster-card card-disabled">
          {awsCardBody}
        </Card>
      </Tooltip>
    );

    const title = (<PageTitle title="Create an OpenShift Dedicated Cluster" breadcrumbs={breadcrumbs} />);

    if (organization.fulfilled) {
      return (
        <>
          {title}
          <PageSection>
            <Card>
              <div className="pf-c-content ocm-page">
                <Title headingLevel="h3" size="2xl">
                  Select an infrastructure provider
                </Title>
                <div className="flex-container">
                  {awsCard}
                  {gcpCard}
                </div>
              </div>
            </Card>
          </PageSection>
        </>
      );
    }

    if (organization.error) {
      return (
        <>
          {title}
          <PageSection>
            <Unavailable
              message="Error retrieving quota"
              response={organization}
            />
          </PageSection>
        </>
      );
    }

    return (
      <>
        {title}
        <PageSection>
          <Spinner centered />
        </PageSection>
      </>
    );
  }
}

CloudProviderSelection.propTypes = {
  getOrganizationAndQuota: PropTypes.func.isRequired,
  organization: PropTypes.object.isRequired,
  hasGcpQuota: PropTypes.bool.isRequired,
  hasAwsQuota: PropTypes.bool.isRequired,
  hasProductQuota: PropTypes.bool.isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
};

export default CloudProviderSelection;
