import React from 'react';
import { Toolbar, ToolbarItem, Button, ToolbarContent, Tooltip } from '@patternfly/react-core';

import { DemoExperience, DemoExperienceStatusEnum } from './DemoExperienceModels';
import ExternalLink from '../common/ExternalLink';
import { rosaHandsOnLinks } from './constants';

export type RosaHandsOnToolbarProps = {
  onRequestCluster: () => void;
  demoExperience: DemoExperience;
};

const RosaHandsOnGetStartedToolbar = ({
  demoExperience,
  onRequestCluster,
}: RosaHandsOnToolbarProps) => {
  const { status } = demoExperience;
  let btn;
  switch (status) {
    case DemoExperienceStatusEnum.Started:
      btn = (
        <ExternalLink href={demoExperience.experience_url || ''} isButton variant="primary" noIcon>
          Launch experience
        </ExternalLink>
      );
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
    default:
      btn = (
        <Button
          variant="primary"
          onClick={onRequestCluster}
          isDisabled={[
            DemoExperienceStatusEnum.Failed,
            DemoExperienceStatusEnum.Unavailable,
          ].includes(status)}
        >
          Request experience
        </Button>
      );
  }
  return (
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
  );
};

export default RosaHandsOnGetStartedToolbar;
