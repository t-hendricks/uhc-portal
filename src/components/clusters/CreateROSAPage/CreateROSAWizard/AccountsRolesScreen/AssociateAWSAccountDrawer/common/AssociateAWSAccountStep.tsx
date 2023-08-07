import React, { PropsWithChildren } from 'react';
import { ExpandableSection, Title } from '@patternfly/react-core';

const AWSAccountRoles = ['ocm', 'user', 'account'] as const;
export type AWSAccountRole = typeof AWSAccountRoles[number];

export type AssociateAWSAccountStepProps = {
  title: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  expandable?: boolean;
  initiallyExpanded?: boolean;
};

const AssociateAWSAccountStep: React.FC<PropsWithChildren<AssociateAWSAccountStepProps>> = ({
  title,
  headingLevel,
  children,
  expandable,
  initiallyExpanded,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(initiallyExpanded);
  const onToggle = (isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  const level = headingLevel || 'h3';

  return expandable ? (
    <ExpandableSection
      onToggle={onToggle}
      isExpanded={isExpanded}
      isActive={isExpanded}
      toggleContent={
        <Title headingLevel={level} size="md">
          {title}
        </Title>
      }
    >
      {children}
    </ExpandableSection>
  ) : (
    <>{children}</>
  );
};

export default AssociateAWSAccountStep;
