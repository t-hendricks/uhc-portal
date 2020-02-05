import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Gallery, GalleryItem,
  PageSection, Title,
} from '@patternfly/react-core';

import Breadcrumbs from '../common/Breadcrumbs';
import PageTitle from '../../common/PageTitle';
import { Link } from 'react-router-dom';
import CardBadge from '../install/components/CardBadge';
import AWSLogo from '../../../styles/images/AWS.png';
import GCPLogo from '../../../styles/images/google-cloud-logo.svg';

class CloudProviderSelection extends Component {
  componentDidMount() {
    document.title = 'Create an OpenShift Cluster | Red Hat OpenShift Cluster Manager | Infrastructure Provider';
  }

  render() {
    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'OpenShift Dedicated' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title="Create an OpenShift Dedicated Cluster" breadcrumbs={breadcrumbs} />
        <PageSection>
          <Card>
            <div className="pf-c-content ocm-page">
              <Title headingLevel="h3" size="2xl">
                Select an infrastructure provider
              </Title>
              <Gallery gutter="md" className="ocp-infra-gallery">
                <GalleryItem>
                  <Link to="/create/osd/aws" className="infra-card infra-card-cloud-provider">
                    <CardBadge isHidden />
                    <CardBody>
                      <img src={AWSLogo} alt="AWS" className="infra-logo" />
                      <Title headingLevel="h5" size="lg">Run on Amazon Web Services</Title>
                    </CardBody>
                  </Link>
                </GalleryItem>
                <GalleryItem>
                  <Link to="/create/osd/gcp" className="infra-card infra-card-cloud-provider">
                    <CardBadge isHidden />
                    <CardBody>
                      <img src={GCPLogo} alt="GCP" className="infra-logo-google-cloud" />
                      <Title headingLevel="h5" size="lg">Run on Google Cloud Platform</Title>
                    </CardBody>
                  </Link>
                </GalleryItem>
              </Gallery>
            </div>
          </Card>
        </PageSection>
      </>
    );
  }
}

export default CloudProviderSelection;
