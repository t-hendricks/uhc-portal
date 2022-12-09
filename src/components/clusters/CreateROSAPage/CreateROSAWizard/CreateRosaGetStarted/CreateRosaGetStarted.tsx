import React from 'react';
import {
  Grid,
  GridItem,
  TextContent,
  Text,
  TextVariants,
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

import PageTitle from '~/components/common/PageTitle';
import Breadcrumbs from '~/components/common/Breadcrumbs';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import { scrollToTop } from '~/common/helpers';

import Instruction from '~/components/common/Instruction';
import Instructions from '~/components/common/Instructions';

import StepEnableROSAService from './StepEnableROSAService';
import StepDownloadROSACli from './StepDownloadROSACli';
import StepLinkELBRole from './StepLinkELBRole';
import StepCreateAWSAccountRoles from './StepCreateAWSAccountRoles';
import StepVerifyCredentials from './StepVerifyCredentials';
import '../createROSAWizard.scss';
import WithCLICard from './WithCLICard';
import WithWizardCard from './WithWizardCard';

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
  const [isPrereqOpen, setIsPrereqOpen] = React.useState(true);
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
          <StackItem>
            <Card>
              <CardBody>
                <ExpandableSection
                  toggleText={`${isPrereqOpen ? 'Hide' : 'Show'} ROSA Prerequisites`}
                  onToggle={() => setIsPrereqOpen(!isPrereqOpen)}
                  isExpanded={isPrereqOpen}
                >
                  <Split className="pf-u-mb-lg">
                    <SplitItem isFilled>
                      <Title headingLevel="h2">Prepare your AWS account</Title>
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
                      <StepEnableROSAService />
                    </Instruction>

                    <Instruction simple>
                      <StepDownloadROSACli />
                    </Instruction>

                    <Instruction simple>
                      <StepLinkELBRole />
                    </Instruction>

                    <Instruction simple>
                      <StepCreateAWSAccountRoles />
                    </Instruction>

                    <Instruction simple>
                      <StepVerifyCredentials />
                    </Instruction>
                  </Instructions>
                </ExpandableSection>
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
