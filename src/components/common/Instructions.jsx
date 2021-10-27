import React from 'react';
import PropTypes from 'prop-types';
import {
  TextContent,
  TextList,
  TextListVariants,
} from '@patternfly/react-core';

import './Instructions.scss';

const Instructions = ({ children }) => (
  <TextContent className="ocm-instructions">
    <TextList component={TextListVariants.ol} className="ocm-instructions__list">
      {children}
    </TextList>
  </TextContent>
);

Instructions.propTypes = {
  children: PropTypes.node,
};

export default Instructions;
