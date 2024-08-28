import React from 'react';
import { useLocation } from 'react-router-dom';

import {
  ButtonVariant,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  ExpandableSection,
  Grid,
  GridItem,
  PageSection,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { WarningTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/warning-triangle-icon';

import links from '~/common/installLinks.mjs';
import { AppPage } from '~/components/App/AppPage';
import Breadcrumbs from '~/components/common/Breadcrumbs';
import ExternalLink from '~/components/common/ExternalLink';
import Instruction from '~/components/common/Instruction';
import Instructions from '~/components/common/Instructions';
import PageTitle from '~/components/common/PageTitle';

import StepCreateAWSAccountRoles from './StepCreateAWSAccountRoles';
import StepDownloadROSACli from './StepDownloadROSACli';
import WithCLICard from './WithCLICard';
import WithWizardCard from './WithWizardCard';

import '../createROSAWizard.scss';

export const productName = 'Red Hat OpenShift Service on AWS';
const title = (productName: string = '') => `Set up ${productName} (ROSA)`;

const breadcrumbs = (
  <Breadcrumbs
    path={[
      { label: 'Cluster List' },
      { label: 'Cluster Type', path: '/create' },
      { label: 'Set up ROSA' },
    ]}
  />
);

const CreateRosaGetStarted = () => {
  const { search } = useLocation();
  const sourceIsAWS = search.indexOf('source=aws') !== -1;
  const [isAWSPrereqOpen, setIsAWSPrereqOpen] = React.useState(!sourceIsAWS);

  return (
    <AppPage>
      <PageTitle breadcrumbs={breadcrumbs} title={title(productName)}>
        <TextContent className="pf-v5-u-mt-md">
          <Text component={TextVariants.p}>
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
                      <span className="pf-v5-u-ml-sm">
                        {isAWSPrereqOpen ? (
                          <WarningTriangleIcon className="warning" />
                        ) : (
                          <CheckCircleIcon className="success" />
                        )}
                      </span>
                    </div>
                  }
                >
                  <TextContent className="pf-v5-u-mt-md">
                    <Title headingLevel="h2">Have you prepared your AWS account?</Title>
                    <Text component={TextVariants.p}>
                      You will need to enable ROSA on AWS, configure Elastic Load Balancer (ELB),
                      and verify your quotas on AWS console. If you have already prepared your AWS
                      account, you can continue to complete ROSA prerequisites.
                    </Text>
                    <ExternalLink
                      href={links.AWS_CONSOLE_ROSA_HOME_GET_STARTED}
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
                <Split className="pf-v5-u-mb-lg">
                  <SplitItem isFilled>
                    <Title headingLevel="h2">Complete ROSA prerequisites</Title>
                  </SplitItem>
                  <SplitItem>
                    <ExternalLink href={links.AWS_ROSA_GET_STARTED}>
                      More information on ROSA setup
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
              <CardHeader
                className="rosa-get-started"
                actions={{
                  actions: (
                    <ExternalLink href={links.ROSA_GET_STARTED}>
                      More information on ROSA cluster creation
                    </ExternalLink>
                  ),
                  hasNoOffset: false,
                }}
              >
                <CardTitle>
                  <Title headingLevel="h2" size="xl">
                    Deploy the cluster and set up access
                  </Title>
                  <Text component={TextVariants.p} className="pf-v5-u-font-weight-normal">
                    Select a deployment method
                  </Text>
                </CardTitle>
              </CardHeader>

              <CardBody>
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
    </AppPage>
  );
};

export default CreateRosaGetStarted;
