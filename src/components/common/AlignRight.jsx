import React from 'react';
import PropTypes from 'prop-types';

/**
 * Places children to the right side of the available space.
 */
const AlignRight = ({ children }) => (
  <div style={{ 'text-align': 'right' }}>
    <span style={{ display: 'inline-block' }}>
      {children}
    </span>
  </div>
);
AlignRight.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AlignRight;
