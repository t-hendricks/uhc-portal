import React from 'react';
import PropTypes from 'prop-types';
import { TextContent, TextList, TextListVariants } from '@patternfly/react-core';

import './Instructions.scss';

const Instructions = ({ children, wide }) => (
  <TextContent className="ocm-instructions">
    <TextList
      component={TextListVariants.ol}
      className={`ocm-instructions__list ${wide ? 'pf-u-max-width' : ''}`}
    >
      {children}
    </TextList>
  </TextContent>
);

Instructions.propTypes = {
  children: PropTypes.node,
  wide: PropTypes.bool,
};

export default Instructions;
