import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ExpandableSection } from '@patternfly/react-core';
import './Prerequisites.scss';
import AcknowledgePrerequisites from './AcknowledgePrerequisites';

const Prerequisites = (
  {
    initiallyExpanded,
    children,
    acknowledgementRequired = false,
    toggleText = 'Prerequisites',
    ...restProps
  },
) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(initiallyExpanded);
  }, [initiallyExpanded]);

  const onToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <ExpandableSection className="prerequisites-expandable-section" toggleText={toggleText} isExpanded={isExpanded} onToggle={onToggle} {...restProps}>
        <div className="prerequisites-section">
          {children}
        </div>
      </ExpandableSection>
      { acknowledgementRequired && <AcknowledgePrerequisites />}
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
