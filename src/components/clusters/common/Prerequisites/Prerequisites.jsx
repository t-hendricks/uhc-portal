import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { ExpandableSection } from '@patternfly/react-core';

import AcknowledgePrerequisites from './AcknowledgePrerequisites';

import './Prerequisites.scss';

const Prerequisites = ({
  initiallyExpanded,
  children,
  acknowledgementRequired = false,
  toggleText = 'Prerequisites',
  ...restProps
}) => {
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
        contentId="prerequisites-content"
        toggleId="prerequisites-toggle"
        {...restProps}
      >
        <div className="prerequisites-section">{children}</div>
      </ExpandableSection>
      {acknowledgementRequired && <AcknowledgePrerequisites />}
    </>
  );
};

Prerequisites.propTypes = {
  toggleText: PropTypes.string,
  children: PropTypes.node.isRequired,
  initiallyExpanded: PropTypes.bool,
  acknowledgementRequired: PropTypes.bool,
};

export default Prerequisites;
