import React from 'react';

type Props = {
  children?: React.ReactNode;
};

/**
 * Places children to the right side of the available space.
 */
const AlignRight = ({ children }: Props) => (
  <div style={{ textAlign: 'right' }}>
    <span style={{ display: 'inline-block' }}>{children}</span>
  </div>
);

export default AlignRight;
