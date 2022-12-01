import React from 'react';
import { Label } from '@patternfly/react-core';
import StarIcon from '@patternfly/react-icons/dist/esm/icons/star-icon';
import { InstructionsChooserCard } from './InstructionsChooserCard';

import './InstructionsChooser.scss';

interface InstructionsChooserProps {
  showAI?: boolean;
  hideIPI?: boolean;
  ipiPageLink: string;
  hideUPI?: boolean;
  upiPageLink: string;
  aiPageLink?: string;
  providerSpecificFeatures?: {
    ai?: React.ReactNode[];
    ipi?: React.ReactNode[];
    upi?: React.ReactNode[];
  };
}

export const InstructionsChooser = ({
  showAI = false,
  hideIPI = false,
  ipiPageLink,
  hideUPI = false,
  upiPageLink,
  aiPageLink = '/assisted-installer/clusters/~new',
  providerSpecificFeatures = {},
}: InstructionsChooserProps) => (
  <div className="pf-c-content ocm-page instructions-chooser">
    {showAI && (
      <InstructionsChooserCard
        id="select-interactive"
        href={aiPageLink}
        title="Interactive"
        labels={
          <>
            <Label color="blue" icon={<StarIcon />}>
              Recommended
            </Label>
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
    {!hideIPI && (
      <InstructionsChooserCard
        id="select-automated"
        href={ipiPageLink}
        title="Automated"
        labels={<Label color="purple">CLI-based</Label>}
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
