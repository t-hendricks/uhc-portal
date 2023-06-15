import React from 'react';
import {
  Alert,
  AlertVariant,
  Grid,
  GridItem,
  TextContent,
  Text,
  TextVariants,
  ButtonVariant,
  PageSection,
  Stack,
  StackItem,
  Card,
  CardBody,
  CardHeader,
  CardActions,
  CardTitle,
  Title,
  ExpandableSection,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { WarningTriangleIcon, CheckCircleIcon } from '@patternfly/react-icons';

import { useLocation } from 'react-router-dom';
import PageTitle from '~/components/common/PageTitle';
import Breadcrumbs from '~/components/common/Breadcrumbs';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import { scrollToTop } from '~/common/helpers';

import Instruction from '~/components/common/Instruction';
import Instructions from '~/components/common/Instructions';

import StepDownloadROSACli from './StepDownloadROSACli';
import StepCreateAWSAccountRoles from './StepCreateAWSAccountRoles';
import '../createROSAWizard.scss';
import WithCLICard from './WithCLICard';
import WithWizardCard from './WithWizardCard';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { HCP_ROSA_GETTING_STARTED_PAGE } from '~/redux/constants/featureConstants';

export const productName = 'Red Hat OpenShift Service on AWS';
const title = (productName: string = '') => `Get started with ${productName} (ROSA)`;

const breadcrumbs = (
  <Breadcrumbs
    path={[
      { label: 'Clusters' },
      { label: 'Cluster Type', path: '/create' },
      { label: 'Get Started with ROSA' },
    ]}
  />
);

const CreateRosaGetStarted = () => {
  const { search } = useLocation();
  const sourceIsAWS = search.indexOf('source=aws') !== -1;
  const [isAWSPrereqOpen, setIsAWSPrereqOpen] = React.useState(!sourceIsAWS);
  const showHCPDirections = useFeatureGate(HCP_ROSA_GETTING_STARTED_PAGE);

  React.useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={breadcrumbs} title={title(productName)}>
        <TextContent className="pf-u-mt-md">
          <Text component={TextVariants.p}>
            ROSA allows you to deploy fully operational and managed Red Hat OpenShift clusters while
            leveraging the full breadth and depth of AWS.{' '}
            <ExternalLink href={links.WHAT_IS_ROSA}>Learn more about ROSA</ExternalLink> or{' '}
            <ExternalLink href={links.ROSA_COMMUNITY_SLACK}>Slack us</ExternalLink>
          </Text>
        </TextContent>
      </PageTitle>
      <PageSection>
        <Stack hasGutter>
          {/* ************ Start of AWS prerequisites section ***************** */}
          <StackItem>
            <Card>
              <CardBody>
                <ExpandableSection
                  onToggle={() => setIsAWSPrereqOpen(!isAWSPrereqOpen)}
                  isExpanded={isAWSPrereqOpen}
                  toggleContent={
                    <div>
                      <span>Complete AWS prerequisites</span>
                      <span className="pf-u-ml-sm">
                        {isAWSPrereqOpen ? (
                          <WarningTriangleIcon className="warning" />
                        ) : (
                          <CheckCircleIcon className="success" />
                        )}
                      </span>
                    </div>
                  }
                >
                  <TextContent className="pf-u-mt-md">
                    <Title headingLevel="h2">Have you prepared your AWS account?</Title>
                    <Text component={TextVariants.p}>
                      You will need to enable AWS, configure Elastic Load Balancer (ELB), and verify
                      your quotas on AWS console. If you have already prepared your AWS console, you
                      can continue to complete ROSA prerequisites below.
                    </Text>
                    <ExternalLink
                      href={links.AWS_CONSOLE_ROSA_HOME}
                      isButton
                      variant={ButtonVariant.secondary}
                    >
                      Open AWS Console
                    </ExternalLink>
                  </TextContent>
                </ExpandableSection>
              </CardBody>
            </Card>
          </StackItem>
          <StackItem>
            <Card>
              <CardBody>
                <Split className="pf-u-mb-lg">
                  <SplitItem isFilled>
                    <Title headingLevel="h2">Complete ROSA prerequisites</Title>
                  </SplitItem>
                  <SplitItem>
                    <ExternalLink href={links.AWS_ROSA_GET_STARTED}>
                      Help with ROSA setup
                    </ExternalLink>
                  </SplitItem>
                </Split>

                {/* ************* START OF PREREQ STEPS ******************* */}
                <Instructions wide>
                  <Instruction simple>
                    <StepDownloadROSACli />
                  </Instruction>

                  <Instruction simple>
                    <StepCreateAWSAccountRoles />
                  </Instruction>
                </Instructions>
              </CardBody>
            </Card>
          </StackItem>
          {/* ************ Start of Deploy the cluster and setup access cards ***************** */}
          <StackItem>
            <Card>
              <CardHeader>
                <CardActions>
                  <ExternalLink href={links.ROSA_GET_STARTED}>
                    More information on ROSA cluster creation
                  </ExternalLink>
                </CardActions>
                <CardTitle>
                  <Title headingLevel="h2" size="xl">
                    Deploy the cluster and set up access
                  </Title>
                  <Text component={TextVariants.p} className="pf-u-font-weight-normal">
                    Select a deployment method
                  </Text>
                </CardTitle>
              </CardHeader>

              <CardBody>
                {showHCPDirections ? (
                  <Alert
                    variant={AlertVariant.info}
                    isInline
                    className="pf-u-mb-md"
                    component="p"
                    aria-label=""
                    title="For now, you can only create ROSA with Hosted Control Plane clusters using the CLI.  You'll be able to create ROSA with Hosted Control Plane clusters using the web interface soon."
                  />
                ) : null}

                <Grid hasGutter>
                  <GridItem span={6}>
                    <WithCLICard />
                  </GridItem>
                  <GridItem span={6}>
                    <WithWizardCard />
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </PageSection>
    </>
  );
};

export default CreateRosaGetStarted;
