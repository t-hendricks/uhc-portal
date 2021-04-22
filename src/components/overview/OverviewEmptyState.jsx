import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  CardBody,
  CardTitle,
  Card,
  Grid,
  GridItem,
  Title,
  List,
  ListItem,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons';
import './OverviewEmptyState.scss';

const VIDEO_URL = 'https://www.youtube.com/embed/D_Lj0rObunI';

function OverviewEmptyState() {
  return (
    <>
      <div id="overview-emptystate-bg-img-container">
        <Title headingLevel="h1" size="3xl" className="space-left-lg space-bottom-md">Get started with OpenShift Container Platform</Title>
        <Title headingLevel="h2" size="lg" className="space-left-lg space-bottom-md">Download, install and configure Red Hat OpenShift 4 for free now.</Title>
        <Link to="/create" className="space-left-lg">
          <span id="overview-emptystate-create-cluster">Create an OpenShift cluster</span>
        </Link>
      </div>
      <Title size="xl" headingLevel="h1" className="space-top-lg space-bottom-lg">Get productive with OpenShift</Title>
      <Flex id="overview-emptystate-get-productive">
        <Flex className="flex-pair">
          <FlexItem>
            <Card className="dashboard-emptystate-card">
              <CardTitle>
                <Title headingLevel="h2" size="lg" className="card-title">OpenShift Serverless</Title>
              </CardTitle>
              <CardBody>
                Help developers simplify the process of delivering
                code from development to production.
                <a href="https://docs.openshift.com/container-platform/latest/serverless/serverless-getting-started.html" rel="noreferrer noopener" target="_blank">
                  <Button variant="link" icon={<ArrowRightIcon />}>
                    Get started
                  </Button>
                </a>
              </CardBody>
            </Card>
          </FlexItem>
          <FlexItem>
            <Card className="dashboard-emptystate-card">
              <CardTitle>
                <Title headingLevel="h2" size="lg" className="card-title">Red Hat OpenShift Service Mesh</Title>
              </CardTitle>
              <CardBody>
                Connect, secure and monitor microservices in your
                OpenShift Container Platform environment.
                <a href="https://docs.openshift.com/container-platform/latest/service_mesh/service_mesh_arch/understanding-ossm.html" rel="noreferrer noopener" target="_blank">
                  <Button variant="link" icon={<ArrowRightIcon />}>
                    Get started
                  </Button>
                </a>
              </CardBody>
            </Card>
          </FlexItem>
        </Flex>
        <Flex className="flex-pair">
          <FlexItem>
            <Card className="dashboard-emptystate-card">
              <CardTitle>
                <Title headingLevel="h2" size="lg">OpenShift Virtualization</Title>
              </CardTitle>
              <CardBody>
                Run and manage virtual machine workloads alongside your container workloads.
                <a href="https://docs.openshift.com/container-platform/latest/cnv/cnv-about-cnv.html" rel="noreferrer noopener" target="_blank">
                  <Button variant="link" icon={<ArrowRightIcon />}>
                    Get started
                  </Button>
                </a>
              </CardBody>
            </Card>
          </FlexItem>
          <FlexItem>
            <Card className="dashboard-emptystate-card">
              <CardTitle>
                <Title headingLevel="h2" size="lg">Migrating OpenShift Container Platform 3 to 4</Title>
              </CardTitle>
              <CardBody>
                Plan your transition and migrate from OpenShift Container Platform 3 to 4.
                <a href="https://docs.openshift.com/container-platform/latest/migration/migrating_3_4/about-migration.html" rel="noreferrer noopener" target="_blank">
                  <Button variant="link" icon={<ArrowRightIcon />}>
                    Get started
                  </Button>
                </a>
              </CardBody>
            </Card>
          </FlexItem>
        </Flex>
      </Flex>
      <Grid>
        <GridItem span={12}>
          <div id="dashboard-emptystate-osd" className="top-row space-top-lg">
            <Title headingLevel="h2" size="lg" className="card-title">Let Red Hat run it for you</Title>
            Red hat OpenShift Dedicated is a single-tenant, high availability Kubernetes clusters,
            managed by Red Hat on Amazon Web Services or Google Cloud Platform.
            <a
              href="https://www.openshift.com/products/dedicated/contact/"
              rel="noreferrer noopener"
              target="_blank"
              id="request-information-btn"
            >
              <Button variant="secondary">Request information</Button>
            </a>
          </div>
        </GridItem>
      </Grid>
      <Title className="space-top-lg space-bottom-lg" size="lg" headingLevel="h1">Learn more about the platform</Title>
      <div id="emptystate-learn-more">
        <div>
          <iframe title="learn more" width="560" height="315" src={VIDEO_URL} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
        <div>
          <Title headingLevel="h2" size="lg" className="space-left-lg space-bottom-md">Other resources</Title>
          <List>
            <ListItem><a href="https://docs.openshift.com/container-platform/4.4/welcome/index.html" rel="noreferrer noopener" target="_blank">Official documents</a></ListItem>
            <ListItem><a href="https://www.openshift.com/blog" rel="noreferrer noopener" target="_blank">Blog</a></ListItem>
            <ListItem><a href="https://www.openshift.com/learn/courses/getting-started/" rel="noreferrer noopener" target="_blank">Tutorials</a></ListItem>
            <ListItem><a href="https://www.openshift.com/learn/courses/playground/" rel="noreferrer noopener" target="_blank">Playground</a></ListItem>
            <ListItem><a href="https://www.twitch.tv/redhatopenshift" rel="noreferrer noopener" target="_blank">Twitch</a></ListItem>
          </List>
        </div>
      </div>
    </>
  );
}

export default OverviewEmptyState;
