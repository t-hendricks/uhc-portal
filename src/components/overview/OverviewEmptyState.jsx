import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  CardBody,
  Card,
  CardHeader,
  Grid,
  GridItem,
  Title,
  List,
  ListItem,
} from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons';

const VIDEO_URL = 'https://www.youtube.com/embed/D_Lj0rObunI';

function OverviewEmptyState() {
  return (
    <>
      <div id="overview-emptystate-bg-img-container">
        <Title headingLevel="h1" size="3xl" className="space-left-lg space-bottom-md">Get started with OpenShift Container Platform</Title>
        <Title headingLevel="h2" size="lg" className="space-left-lg space-bottom-md">Download, install and configure Red Hat OpenShift 4 for free now.</Title>
        <Link to="/create" className="space-left-lg">
          <span>Create an OpenShift cluser</span>
        </Link>
      </div>
      <Grid id="overview-emptystate">
        <Title size="xl" headingLevel="h1" className="space-top-lg">Get productive with OpenShift</Title>
        <GridItem span={6}>
          <Card className="dashboard-emptystate-card space-right-lg space-top-lg">
            <CardHeader>
              <Title headingLevel="h2" size="lg" className="card-title">OpenShift Serverless</Title>
            </CardHeader>
            <CardBody>
              Help developers simplify the process of delivering
              code from development to production.
              <a href="https://docs.openshift.com/container-platform/latest/serverless/serverless-getting-started.html" rel="noreferrer noopener">
                <Button variant="link" icon={<ArrowRightIcon />}>
                Get started
                </Button>
              </a>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={6}>
          <Card className="dashboard-emptystate-card space-top-lg">
            <CardHeader>
              <Title headingLevel="h2" size="lg" className="card-title">Red Hat OpenShift Service Mesh</Title>
            </CardHeader>
            <CardBody>
              Connect, secure and monitor microservices in your
              OpenShift Container Platform environment.
              <a href="https://docs.openshift.com/container-platform/latest/service_mesh/service_mesh_arch/understanding-ossm.html" rel="noreferrer noopener">
                <Button variant="link" icon={<ArrowRightIcon />}>
                Get started
                </Button>
              </a>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={6}>
          <Card className="dashboard-emptystate-card space-right-lg space-top-lg">
            <CardHeader>
              <Title headingLevel="h2" size="lg">Container-native virtualization</Title>
            </CardHeader>
            <CardBody>
              Run and manage virtual machine workloads alongside your container workloads.
              <a href="https://docs.openshift.com/container-platform/latest/cnv/cnv-about-cnv.html" rel="noreferrer noopener">
                <Button variant="link" icon={<ArrowRightIcon />}>
                Get started
                </Button>
              </a>
            </CardBody>
          </Card>

        </GridItem>

        <GridItem span={6}>
          <Card className="dashboard-emptystate-card space-top-lg">
            <CardHeader>
              <Title headingLevel="h2" size="lg">Migrating OpenShift Contatiner Platform 3 to 4</Title>
            </CardHeader>
            <CardBody>
                Plan your transition and migrate from OpenShift Container Platform 3 to 4.
              <a href="https://docs.openshift.com/container-platform/latest/migration/migrating_3_4/about-migration.html" rel="noreferrer noopener">
                <Button variant="link" icon={<ArrowRightIcon />}>
                Get started
                </Button>
              </a>
            </CardBody>
          </Card>

        </GridItem>

        <GridItem span={12}>
          <Card className="space-top-lg">
            <CardHeader>
              <Title headingLevel="h2" size="lg" className="card-title">Let Red Hat run it for you</Title>
            </CardHeader>
            <CardBody>
              Red hat OpenShift Dedicated is a single-tenant, high availablity Kubernetes clusters,
              managed by Red Hat on Amazon Web Services or Google Cloud Platform.
              <Button
                href="https://www.openshift.com/products/dedicated/contact/"
                rel="noreferrer noopener"
                target="_blank"
                variant="secondary"
                id="request-information-btn"
              >
                 Request information
              </Button>
            </CardBody>
          </Card>
        </GridItem>
        <Title className="space-top-lg space-bottom-lg" size="lg" headingLevel="h1">Learn more about the platform</Title>
        <GridItem span={6}>
          <iframe title="learn more" width="560" height="315" src={VIDEO_URL} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </GridItem>
        <GridItem span={6}>
          <Title headingLevel="h2" size="lg" className="space-left-lg space-bottom-md">Other resources</Title>
          <List>
            <ListItem><a href="https://docs.openshift.com/container-platform/4.4/welcome/index.html" rel="noreferrer noopener" target="_blank">Official documents</a></ListItem>
            <ListItem><a href="https://www.openshift.com/blog" rel="noreferrer noopener" target="_blank">Blog</a></ListItem>
            <ListItem><a href="https://www.openshift.com/learn/courses/getting-started/" rel="noreferrer noopener" target="_blank">Tutorials</a></ListItem>
            <ListItem><a href="https://www.openshift.com/learn/courses/playground/" rel="noreferrer noopener" target="_blank">Playground</a></ListItem>
            <ListItem><a href="https://www.twitch.tv/redhatopenshift" rel="noreferrer noopener" target="_blank">Twich</a></ListItem>
          </List>
        </GridItem>
      </Grid>
    </>
  );
}

export default OverviewEmptyState;
