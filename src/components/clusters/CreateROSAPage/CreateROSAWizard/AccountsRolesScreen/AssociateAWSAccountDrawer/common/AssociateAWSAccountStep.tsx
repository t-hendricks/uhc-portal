import React, { PropsWithChildren } from 'react';
import { ExpandableSection, ExpandableSectionToggle, Title } from '@patternfly/react-core';

type AssociateAWSAccountStepProps = {
  title: string;
  contentId: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
};

const AssociateAWSAccountStep: React.FC<PropsWithChildren<AssociateAWSAccountStepProps>> = ({
  title,
  contentId,
  headingLevel,
  children,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const onToggle = (isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  const level = headingLevel || 'h3';

  return (
    <>
      <Title headingLevel={level} size="md">
        <ExpandableSectionToggle isExpanded={isExpanded} contentId={contentId} onToggle={onToggle}>
          {title}
        </ExpandableSectionToggle>
      </Title>
      <ExpandableSection
        isExpanded={isExpanded}
        isDetached
        contentId={contentId}
        className="pf-u-mb-xl"
      >
        {children}
      </ExpandableSection>
    </>
  );
};

export default AssociateAWSAccountStep;
