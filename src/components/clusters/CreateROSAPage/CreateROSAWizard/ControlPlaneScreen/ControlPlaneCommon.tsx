import React from 'react';
import { ListItem as PFListItem } from '@patternfly/react-core';
import { CheckIcon } from '@patternfly/react-icons';

export const defaultMarginBottomSpacing = 'pf-u-mb-md';

export const ListItem = ({ children }: { children: React.ReactNode }) => (
  <PFListItem icon={<CheckIcon className="pf-u-active-color-100" />}>{children}</PFListItem>
);

export type hypershiftValue = 'true' | 'false';
