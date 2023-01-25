import React, { useState, useEffect } from 'react';

import { ExpandableSection, ExpandableSectionProps } from '@patternfly/react-core';
import { acknowledgePrerequisites } from '~/common/validators';
import { CheckboxField } from '~/components/clusters/wizards/form';
import { FieldId } from '~/components/clusters/wizards/common/constants';

import './Prerequisites.scss';

interface PrerequisitesProps extends ExpandableSectionProps {
  children: React.ReactNode | React.ReactNode[];
  initiallyExpanded: boolean;
  acknowledgementRequired?: boolean;
  fieldName?: string;
  ref?: React.LegacyRef<HTMLDivElement & ExpandableSection> | undefined;
}

export const Prerequisites = ({
  initiallyExpanded,
  children,
  acknowledgementRequired = false,
  toggleText = 'Prerequisites',
  fieldName = 'acknowledge_prerequisites',
  ...expandSectionProps
}: PrerequisitesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(initiallyExpanded);
  }, [initiallyExpanded]);

  const onToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <ExpandableSection
        className="prerequisites-expandable-section"
        toggleText={toggleText}
        isExpanded={isExpanded}
        onToggle={onToggle}
        {...expandSectionProps}
      >
        <div className="prerequisites-section">{children}</div>
      </ExpandableSection>
      {acknowledgementRequired && (
        <CheckboxField
          name={FieldId.AcknowledgePrereq}
          label="I've read and completed all the prerequisites and am ready to continue creating my cluster."
          validate={acknowledgePrerequisites}
        />
      )}
    </>
  );
};
