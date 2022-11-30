import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardBody,
  Divider,
  Grid,
  GridItem,
  PageSection,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

import Breadcrumbs from '../../../common/Breadcrumbs';
import ExternalLink from '../../../common/ExternalLink';
import { scrollToTop } from '../../../../common/helpers';
import installLinks, { tools, channels } from '../../../../common/installLinks.mjs';
import Instruction from '../../../common/Instruction';
import InstructionCommand from '../../../common/InstructionCommand';
import Instructions from '../../../common/Instructions';
import PageTitle from '../../../common/PageTitle';
import links from '../../CreateClusterPage/CreateClusterConsts';
import DownloadAndOSSelection from '../../install/instructions/components/DownloadAndOSSelection';
import TokenErrorAlert from '../../install/instructions/components/TokenErrorAlert';

const CreateROSAWelcome = ({ getAuthToken, token }) => {
  const name = 'Red Hat OpenShift Service on AWS';
  const title = `Welcome to ${name} (ROSA)`;

  React.useEffect(() => {
    scrollToTop();
    getAuthToken();
    document.title = `${title} | Red Hat OpenShift Cluster Manager`;
  }, []);

  const breadcrumbs = (
    <Breadcrumbs
      path={[{ label: 'Clusters' }, { label: 'Create', path: '/create' }, { label: name }]}
    />
  );
  const pendoID = window.location.pathname;

  return (
    <>
      <PageTitle breadcrumbs={breadcrumbs} title={title}>
        <Grid hasGutter className="pf-u-mt-md">
          <GridItem md={8} xl2={9}>
            <TextContent>
              <Text component={TextVariants.p}>
                <strong>ROSA</strong> is a fully managed Red Hat OpenShift service running natively
                on Amazon Web Services (AWS), which allows customers to quickly and easily build,
                deploy, and manage Kubernetes applications on the industry&apos;s most comprehensive
                Kubernetes platform in the AWS public cloud.
              </Text>
            </TextContent>
          </GridItem>
          <GridItem md={4} xl2={3}>
            <TextContent>
              <Text component={TextVariants.p}>
                <Button
                  component="a"
                  href={links.AWS}
                  target="_blank"
                  rel="noreferrer noopener"
                  variant="link"
                  isLarge
                  isInline
                >
                  Learn more about ROSA <ArrowRightIcon />
                </Button>
              </Text>
            </TextContent>
          </GridItem>
        </Grid>
      </PageTitle>
      <PageSection className="ocm-p-rosa-welcome">
        <Stack hasGutter>
          <StackItem className="ocm-p-rosa-welcome__section">
            <Card>
              <CardBody>
                <Title headingLevel="h2">Getting started with ROSA</Title>
                <TextContent>
                  <Text component={TextVariants.p}>
                    Before getting started, please review the prerequisites found in the
                    documentation at{' '}
                    <ExternalLink href={installLinks.ROSA_AWS_PREREQUISITES}>
                      AWS Prerequisites for ROSA
                    </ExternalLink>
                    .
                  </Text>
                </TextContent>
                <Divider className="pf-u-mt-lg pf-u-mb-xl" />
                {token.error && (
                  <>
                    <TokenErrorAlert token={token} />
                    <div className="pf-u-mb-lg" />
                  </>
                )}
                <Instructions>
                  <Instruction>
                    <Title headingLevel="h3">Enable ROSA in your AWS account</Title>
                    <Text component={TextVariants.p}>
                      If you haven’t done so already, visit{' '}
                      <ExternalLink href="https://console.aws.amazon.com/rosa/home">
                        https://console.aws.amazon.com/rosa/home
                      </ExternalLink>{' '}
                      to enable ROSA in your AWS account.{' '}
                      <ExternalLink href="https://www.rosaworkshop.io/rosa/1-account_setup/#3-enable-rosa">
                        Help
                      </ExternalLink>
                    </Text>
                  </Instruction>
                  <Instruction>
                    <Title headingLevel="h3">Download and install the ROSA command line tool</Title>
                    <Text component={TextVariants.p}>
                      Download the ROSA command line (CLI) tools and add them to your{' '}
                      <strong>PATH</strong>.{' '}
                      <ExternalLink href={installLinks.ROSA_CLI_DOCS}>Help</ExternalLink>
                    </Text>
                    <Text component={TextVariants.p}>
                      <DownloadAndOSSelection
                        tool={tools.ROSA}
                        channel={channels.STABLE}
                        pendoID={pendoID}
                      />
                    </Text>
                    <Text component={TextVariants.p} className="ocm-secondary-text">
                      Note: If you haven’t done so already, also{' '}
                      <ExternalLink href={installLinks.AWS_CLI}>
                        install and configure the AWS CLI
                      </ExternalLink>{' '}
                      as per your operating system.
                    </Text>
                  </Instruction>
                  <Instruction>
                    <Title headingLevel="h3">Log in to the command line</Title>
                    <Text component={TextVariants.p}>
                      Run the authentication command in your terminal.{' '}
                      <Link to="/token/rosa">Help</Link>
                    </Text>
                    <InstructionCommand textAriaLabel="Copyable ROSA login command">
                      rosa login
                    </InstructionCommand>
                  </Instruction>
                  <Instruction>
                    <Title headingLevel="h3">Verify your credentials and quota</Title>
                    <Text component={TextVariants.p}>
                      Verify that your credentials are set up correctly.{' '}
                      <ExternalLink href="https://www.rosaworkshop.io/rosa/1-account_setup/#verify-credentials">
                        Help
                      </ExternalLink>
                    </Text>
                    <InstructionCommand textAriaLabel="Copyable ROSA login verification command">
                      rosa whoami
                    </InstructionCommand>
                    <Text component={TextVariants.p}>
                      Verify that your AWS account has ample quota in the region you will be
                      deploying your cluster.{' '}
                      <ExternalLink href="https://www.rosaworkshop.io/rosa/1-account_setup/#verify-quota">
                        Help
                      </ExternalLink>
                    </Text>
                    <InstructionCommand textAriaLabel="Copyable ROSA quota verification command">
                      rosa verify quota
                    </InstructionCommand>
                  </Instruction>
                  <Instruction>
                    <Title headingLevel="h3">Deploy the cluster and set up access</Title>
                    <Text component={TextVariants.p}>
                      Follow instructions to deploy your cluster and set up access using the ROSA
                      CLI.
                    </Text>
                    <Button
                      component="a"
                      href="https://www.rosaworkshop.io/rosa/2-deploy/"
                      target="_blank"
                      rel="noreferrer noopener"
                      variant="secondary"
                    >
                      Get started
                    </Button>
                  </Instruction>
                </Instructions>
              </CardBody>
            </Card>
          </StackItem>
          <StackItem className="ocm-p-rosa-welcome__section">
            <Card>
              <CardBody>
                <Title headingLevel="h2">Next steps</Title>
                <Divider className="pf-u-mt-lg pf-u-mb-xl" />
                <Instructions>
                  <Instruction>
                    <Title headingLevel="h3">Accessing the cluster</Title>
                    <Text component={TextVariants.p}>
                      Learn how to{' '}
                      <ExternalLink href="https://www.rosaworkshop.io/rosa/6-access_cluster/">
                        access your cluster
                      </ExternalLink>{' '}
                      and more in the ROSA workshop.
                    </Text>
                  </Instruction>
                  <Instruction>
                    <Title headingLevel="h3">Getting support</Title>
                    <Text component={TextVariants.p}>
                      Having trouble getting started?{' '}
                      <ExternalLink href="https://support.redhat.com/">
                        Contact Red Hat Support
                      </ExternalLink>
                      .
                    </Text>
                  </Instruction>
                  <Instruction>
                    <Title headingLevel="h3">Getting familiar with ROSA</Title>
                    <Text component={TextVariants.p}>
                      View the complete{' '}
                      <ExternalLink href="https://www.rosaworkshop.io/">ROSA workshop</ExternalLink>
                      , browse the{' '}
                      <ExternalLink href={installLinks.ROSA_DOCS_ENTRY}>
                        ROSA documentation
                      </ExternalLink>
                      , view the{' '}
                      <ExternalLink href={installLinks.ROSA_SERVICE_DEFINITION}>
                        ROSA Service Definition
                      </ExternalLink>{' '}
                      or{' '}
                      <ExternalLink href={installLinks.ROSA_RESPONSIBILITY_MATRIX}>
                        Responsibility Assignment Matrix
                      </ExternalLink>
                      .
                    </Text>
                  </Instruction>
                </Instructions>
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </PageSection>
    </>
  );
};

CreateROSAWelcome.propTypes = {
  getAuthToken: PropTypes.func.isRequired,
  token: PropTypes.object.isRequired,
};

export default CreateROSAWelcome;
