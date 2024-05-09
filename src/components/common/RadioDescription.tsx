import React from 'react';

import './RadioDescription.scss';

// This component is useful alongside RadioButtons.

type Props = {
  children: React.ReactNode;
};

export function RadioDescription({ children }: Props) {
  return <div className="ocm-c--reduxradiobutton-description">{children}</div>;
}
