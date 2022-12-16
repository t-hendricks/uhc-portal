import React from 'react';
import { TextContent, TextList, TextListVariants } from '@patternfly/react-core';

import './Instructions.scss';

type Props = {
  children?: React.ReactNode;
  wide?: boolean;
};

const Instructions = ({ children, wide }: Props) => (
  <TextContent className="ocm-instructions">
    <TextList
      component={TextListVariants.ol}
      className={`ocm-instructions__list ${wide ? 'pf-u-max-width' : ''}`}
    >
      {children}
    </TextList>
  </TextContent>
);

export default Instructions;
