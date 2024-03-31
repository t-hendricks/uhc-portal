import React from 'react';

import '~/components/common/CheckboxDescription.scss';

// This component is useful alongside ReduxCheckbox & CheckboxField.
// TODO: Would it make sense to combine them?
// TODO: can this be replaced by patternfly Checkbox's `description` prop?

type Props = {
  children: React.ReactNode;
};

export function CheckboxDescription({ children }: Props) {
  return <div className="ocm-c--reduxcheckbox-description">{children}</div>;
}
