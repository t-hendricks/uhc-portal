import React from 'react';
import { TextListItem } from '@patternfly/react-core';

import './Instruction.scss';

type Props = {
  children?: React.ReactNode;
  simple?: boolean;
};

const Instruction = ({ children, simple }: Props) => (
  <TextListItem
    className={simple ? 'ocm-instructions__list-item-simple' : 'ocm-instructions__list-item'}
  >
    <div className="ocm-instructions__list-item-contents">{children}</div>
  </TextListItem>
);

export default Instruction;
