import React from 'react';

const CriticalIcon = (props) => (
  <svg x="3.5" y="2.5">
    <svg {...props}>
      <polygon points="10 10, 10 3, 5 0, 0 3, 0 10, 5 8" />
    </svg>
  </svg>
);

export default CriticalIcon;
