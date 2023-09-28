import React from 'react';
import { Toolbar, ToolbarItem, Button, ToolbarContent, Tooltip } from '@patternfly/react-core';

import { DemoExperience, DemoExperienceStatusEnum } from './DemoExperienceModels';
import ExternalLink from '../common/ExternalLink';
import RosaHandsOnLinks from './RosaHandsOnLinks';

export type RosaHandsonToolbarProps = {
  onRequestCluster: () => void;
  demoExperience: DemoExperience;
};

const DefaultButton = ({
  onRequestCluster,
  isDisabled,
}: {
  onRequestCluster: RosaHandsonToolbarProps['onRequestCluster'];
  isDisabled: boolean;
}) => (
  <Button variant="primary" onClick={onRequestCluster} isDisabled={isDisabled}>
    Request experience
  </Button>
);

const LearnMore = () => (
  <ExternalLink href={RosaHandsOnLinks.learnMore} isButton variant="link">
    Learn more about ROSA
  </ExternalLink>
);

const StartedButton = ({ demoExperience }: { demoExperience: DemoExperience }) => (
  <ExternalLink href={demoExperience.experience_url || ''} isButton variant="primary" noIcon>
    Launch experience
  </ExternalLink>
);

const ProvisioningButton = () => (
  <Tooltip content="We are currently getting your ROSA experience ready. This process may take up to 1 hour.">
    {/* Using style to give a disabled look and feel to the button instead of attribute isDisabled, since isDisabled won't allow the popover */}
    <Button
      variant="primary"
      style={{
        backgroundColor: 'var(--pf-c-button--disabled--BackgroundColor)',
        color: 'var(--pf-c-button--disabled--Color)',
      }}
      isLoading
    >
      Provisioning cluster
    </Button>
  </Tooltip>
);

const RosaHandsonGetStartedToolbar = ({
  demoExperience,
  onRequestCluster,
}: RosaHandsonToolbarProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { status } = demoExperience;

  return (
    <Toolbar>
      <ToolbarContent style={{ paddingLeft: 'unset' }}>
        <ToolbarItem>
          {status === DemoExperienceStatusEnum.Available && (
            <DefaultButton onRequestCluster={onRequestCluster} isDisabled={false} />
          )}
          {status === DemoExperienceStatusEnum.Started && (
            <StartedButton demoExperience={demoExperience} />
          )}
          {(status === DemoExperienceStatusEnum.Deploying ||
            status === DemoExperienceStatusEnum.Requested) && <ProvisioningButton />}
          {(status === DemoExperienceStatusEnum.Failed ||
            status === DemoExperienceStatusEnum.Unavailable) && (
            <DefaultButton onRequestCluster={onRequestCluster} isDisabled />
          )}
        </ToolbarItem>
        <ToolbarItem>
          <LearnMore />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

export default RosaHandsonGetStartedToolbar;
