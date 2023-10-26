import React from 'react';
import {
  List,
  ListItem,
  Text,
  Card,
  CardBody,
  Popover,
  Grid,
  GridItem,
  Button,
  CardTitle,
  CardHeader,
  CardFooter,
  Tooltip,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Title,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';

import { CheckIcon, HelpIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_link_Color_dark } from '@patternfly/react-tokens';
import RosaHandsOnIcon from './RosaHandsOnIcons/RosaHandsOnIcon';
import ExternalLink from '../common/ExternalLink';
import { MAX_DURATION, rosaHandsOnLinks } from './constants';

import { DemoExperienceStatusEnum } from './DemoExperienceModels';
import { AugmentedDemoExperience } from './augmentedModelTypes';

const cardId = 'rosa-handson-main-card';

const CheckListItem = ({
  children,
  popoverContent,
  popoverHeader,
}: {
  children: React.ReactNode;
  popoverContent?: React.ReactNode;
  popoverHeader?: React.ReactNode;
}) => (
  <ListItem
    icon={<CheckIcon color={global_link_Color_dark.value} size="md" />}
    style={{ alignItems: 'baseline' }}
  >
    <Text>
      {children}
      {popoverContent && (
        <>
          &nbsp;
          <Popover
            bodyContent={popoverContent}
            headerContent={popoverHeader}
            maxWidth="40rem"
            // append to inner element instead of body, to enable Contact support to open intercom
            appendTo={() => document.getElementById(cardId) as HTMLElement}
          >
            <Button icon={<HelpIcon />} variant="link" isInline />
          </Popover>
        </>
      )}
    </Text>
  </ListItem>
);

const DefaultCardBody = ({ demoExperience }: { demoExperience: AugmentedDemoExperience }) => (
  <List isPlain id={cardId}>
    <CheckListItem
      popoverContent={
        <>
          You may launch a demo up to <strong>{demoExperience.quota.limit} times</strong> total. If
          you have questions, you can join the{' '}
          <ExternalLink href={rosaHandsOnLinks.slackChannel}>
            ROSA community Slack channel
          </ExternalLink>
          .
        </>
      }
      popoverHeader="What to expect"
    >
      Access to a free hands-on experience of ROSA that will last for {MAX_DURATION} hours.
    </CheckListItem>
    <CheckListItem
      popoverContent="Your time will not start until after the cluster is provisioned."
      popoverHeader="Getting started"
    >
      One-click deployment of a ROSA cluster in a demo environment.
    </CheckListItem>
    <CheckListItem>
      A view into a fully managed turnkey application platform with integrated services and tools,
      <br />
      fully backed by a global team of site reliability engineers (SREs).
    </CheckListItem>
    <CheckListItem>
      Step-by-step guided content on how to get started and build, deploy and scale an application
      on ROSA.
    </CheckListItem>
  </List>
);

const RosaHandsOnGetStartedCard = ({
  demoExperience,
  onRequestCluster,
}: {
  demoExperience: AugmentedDemoExperience;
  onRequestCluster: () => void;
}) => {
  let body: React.ReactNode = <DefaultCardBody demoExperience={demoExperience} />;
  let title = 'What you get with this experience';
  let btn;
  let showIcon = true;
  switch (demoExperience.status) {
    case DemoExperienceStatusEnum.Started:
      title = 'Your experience is ready';
      body = 'Get started with OpenShift with a guided walkthrough of ROSA.';
      btn = (
        <ExternalLink
          href={demoExperience.experience_url || ''}
          isButton
          variant="primary"
          noIcon
          customTrackProperties={{ link_name: 'launch-rosa-hands-on-experience' }}
        >
          Access experience
        </ExternalLink>
      );
      showIcon = false;
      break;
    case DemoExperienceStatusEnum.Deploying:
    case DemoExperienceStatusEnum.Requested:
      btn = (
        <Tooltip content="We are currently getting your ROSA experience ready. This process may take up to 1 hour.">
          <Button variant="primary" isLoading isAriaDisabled>
            Provisioning cluster
          </Button>
        </Tooltip>
      );
      break;
    case 'quota-exceeded':
      btn = (
        <Button
          variant="primary"
          href={rosaHandsOnLinks.getStarted}
          component={(props) => <Link {...props} to={rosaHandsOnLinks.getStarted} />}
        >
          Create a ROSA cluster
        </Button>
      );
      title = 'Take the next step. Create your own ROSA Cluster!';
      body = (
        <>
          You&apos;ve successfully completed the ROSA Hands on Experience. Now, it&apos;s time to
          dive even deeper
          <br />
          into the world of ROSA by creating your very own cluster on your AWS account.
        </>
      );
      showIcon = false;
      break;
    default:
      btn = (
        <Button
          variant="primary"
          onClick={onRequestCluster}
          isDisabled={demoExperience.status === DemoExperienceStatusEnum.Unavailable}
        >
          Request experience
        </Button>
      );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Title headingLevel="h4">{title}</Title>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Grid>
          <GridItem span={9}>{body}</GridItem>
          {showIcon && (
            <GridItem span={3} style={{ justifySelf: 'right' }}>
              <RosaHandsOnIcon />
            </GridItem>
          )}
        </Grid>
      </CardBody>
      <CardFooter>
        <Toolbar>
          <ToolbarContent style={{ paddingLeft: 'unset' }}>
            <ToolbarItem>{btn}</ToolbarItem>
            <ToolbarItem>
              <ExternalLink href={rosaHandsOnLinks.learnMore} isButton variant="link">
                Learn more about ROSA
              </ExternalLink>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </CardFooter>
    </Card>
  );
};

export default RosaHandsOnGetStartedCard;
