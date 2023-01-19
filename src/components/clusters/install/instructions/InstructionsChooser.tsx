import React from 'react';
import { Label } from '@patternfly/react-core';
import StarIcon from '@patternfly/react-icons/dist/esm/icons/star-icon';
import { InstructionsChooserCard } from './InstructionsChooserCard';

import './InstructionsChooser.scss';

interface InstructionsChooserProps {
  aiPageLink: string;
  agentBasedPageLink: string;
  hideIPI?: boolean;
  hideUPI?: boolean;
  ipiPageLink: string;
  upiPageLink: string;
  recommend?: 'ai' | 'ipi';
  providerSpecificFeatures?: {
    ai?: React.ReactNode[];
    abi?: React.ReactNode[];
    ipi?: React.ReactNode[];
    upi?: React.ReactNode[];
  };
}

export const InstructionsChooser = ({
  aiPageLink,
  agentBasedPageLink,
  hideIPI = false,
  ipiPageLink,
  hideUPI = false,
  recommend = 'ai',
  upiPageLink,
  providerSpecificFeatures = {},
}: InstructionsChooserProps) => (
  <div className="pf-c-content ocm-page instructions-chooser">
    {aiPageLink && (
      <InstructionsChooserCard
        id="select-interactive"
        href={aiPageLink}
        title="Interactive"
        labels={
          <>
            {recommend === 'ai' && (
              <Label color="blue" icon={<StarIcon />}>
                Recommended
              </Label>
            )}
            <Label color="purple">Web-based</Label>
          </>
        }
        body="Runs Assisted Installer with standard configuration settings to create your cluster."
        featureListItems={[
          'Preflight validations',
          'Smart defaults',
          'For connected networks',
          ...(providerSpecificFeatures.ai || []),
        ]}
        footerLinkHref="#" // TODO URL here
        footerLinkText="Learn more about interactive"
      />
    )}
    {agentBasedPageLink && (
      <InstructionsChooserCard
        id="select-agent-based"
        href={agentBasedPageLink}
        title="Local Agent-based"
        labels={
          <>
            <Label color="purple">CLI-based</Label>
          </>
        }
        body="Runs Assisted Installer securely and locally to create your cluster."
        featureListItems={[
          'Installable ISO',
          'Preflight validations',
          ...(providerSpecificFeatures.abi || []),
        ]}
        footerLinkHref="#" // TODO URL here
        footerLinkText="Learn more about local agent-based"
      />
    )}
    {!hideIPI && (
      <InstructionsChooserCard
        id="select-automated"
        href={ipiPageLink}
        title="Automated"
        labels={
          <>
            {recommend === 'ipi' && (
              <Label color="blue" icon={<StarIcon />}>
                Recommended
              </Label>
            )}
            <Label color="purple">CLI-based</Label>
          </>
        }
        body="Auto-provision your infrastructure with minimal configuration to create your cluster."
        featureListItems={[
          'Installer Provisioned Infrastructure',
          ...(providerSpecificFeatures.ipi || []),
        ]}
        footerLinkHref="#" // TODO URL here
        footerLinkText="Learn more about automated"
      />
    )}
    {!hideUPI && (
      <InstructionsChooserCard
        id="select-full-control"
        href={upiPageLink}
        title="Full control"
        labels={<Label color="purple">CLI-based</Label>}
        body="Make all of the decisions when you create your cluster."
        featureListItems={[
          'User Provisioned Infrastructure',
          'Highly customizable',
          ...(providerSpecificFeatures.upi || []),
        ]}
        footerLinkHref="#" // TODO URL here
        footerLinkText="Learn more about full control"
      />
    )}
  </div>
);
