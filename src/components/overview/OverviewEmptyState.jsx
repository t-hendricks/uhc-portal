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
  PageSection,
} from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons';
import MarketingBanner from '../MarketingBanner/marketing-banner';
import './OverviewEmptyState.scss';

// TODO this is from 2015 for openshift 3.x, there's likely a better video for users coming here...
const VIDEO_URL = 'https://www.youtube.com/embed/D_Lj0rObunI';

function OverviewEmptyState() {
  return (
    <>
      <MarketingBanner
        hasGraphic
        graphicRight
        dark1000
        fullBleed
        isWidthLimited
        style={{
          '--ocm-c-marketing-banner--graphic--width-on-md': '200px',
          '--ocm-c-marketing-banner--graphic--width-on-xl': '400px',
        }}
      >
        <Grid className="pf-u-ml-sm pf-u-my-3xl">
          <GridItem>
            <Flex direction={{ default: 'column' }}>
              <FlexItem>
                <Title headingLevel="h1" size="3xl" className="pf-u-mb-2xl">
                  Get started with OpenShift Container Platform
                </Title>
              </FlexItem>
              <FlexItem spacer={{ default: 'spacer2xl' }}>
                <div className="ocm-c-width-limiter" style={{ '--ocm-c-width-limiter--MaxWidth': '600px' }}>
                  <Title headingLevel="h2" size="lg" className="pf-u-mb-xs">Download, install and configure Red Hat OpenShift 4 for free now.</Title>
                </div>
              </FlexItem>
              <FlexItem>
                <Button
                  isLarge
                  component="a"
                  variant="primary"
                >
                  <Link to="/create">
                    Create an OpenShift cluster
                  </Link>
                </Button>
              </FlexItem>
              <FlexItem />
            </Flex>
          </GridItem>
        </Grid>
      </MarketingBanner>

      <PageSection>
        <Title size="xl" headingLevel="h1" className="pf-u-mt-lg pf-u-mb-lg">Get productive with OpenShift</Title>
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
                  <a href="https://docs.openshift.com/container-platform/latest/serverless/discover/about-serverless.html" rel="noreferrer noopener" target="_blank">
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
                  <a href="https://docs.openshift.com/container-platform/latest/service_mesh/v2x/ossm-architecture.html" rel="noreferrer noopener" target="_blank">
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
                  <a href="https://docs.openshift.com/container-platform/4.7/virt/about-virt.html" rel="noreferrer noopener" target="_blank">
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
                  <a href="https://docs.openshift.com/container-platform/latest/migrating_from_ocp_3_to_4/about-migrating-from-3-to-4.html" rel="noreferrer noopener" target="_blank">
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
          <GridItem>
            <div id="dashboard-emptystate-osd" className="top-row pf-u-mt-lg">
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
        <Title className="pf-u-mt-lg pf-u-mb-lg" size="lg" headingLevel="h1">Learn more about the platform</Title>
        <div id="emptystate-learn-more">
          <div>
            <iframe title="learn more" width="560" height="315" src={VIDEO_URL} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
          <div>
            <Title headingLevel="h2" size="lg" className="pf-u-ml-lg pf-u-mb-md">Other resources</Title>
            <List>
              <ListItem><a href="https://docs.openshift.com/container-platform/latest/welcome/" rel="noreferrer noopener" target="_blank">Official documents</a></ListItem>
              <ListItem><a href="https://www.openshift.com/blog" rel="noreferrer noopener" target="_blank">Blog</a></ListItem>
              <ListItem><a href="https://learn.openshift.com/" rel="noreferrer noopener" target="_blank">Tutorials with live playgrounds!</a></ListItem>
              <ListItem><a href="https://www.twitch.tv/redhatopenshift" rel="noreferrer noopener" target="_blank">Twitch</a></ListItem>
            </List>
          </div>
        </div>
      </PageSection>
    </>
  );
}

export default OverviewEmptyState;
