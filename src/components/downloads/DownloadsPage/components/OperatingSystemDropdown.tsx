import React from 'react';

import { FormSelect, FormSelectOption } from '@patternfly/react-core';

import { urls as URLS } from '~/common/installLinks.mjs';

import { allOperatingSystemsForTool } from '../../downloadUtils';

type OperatingSystemDropdownProps = {
  urls: typeof URLS;
  tool: string;
  channel: string;
  OS: string | null;
  setOS: (event: React.FormEvent<HTMLSelectElement>, value: string) => void;
};

const OperatingSystemDropdown = ({
  urls,
  tool,
  channel,
  OS,
  setOS,
}: OperatingSystemDropdownProps) => (
  <FormSelect
    value={OS}
    data-testid={`os-dropdown-${tool}`}
    onChange={setOS}
    aria-label="Select OS dropdown"
  >
    <FormSelectOption key="select" value="select" label="Select OS" isDisabled />
    {allOperatingSystemsForTool(urls, tool, channel).map(({ value, label }) => (
      <FormSelectOption key={value} value={value} label={label} />
    ))}
  </FormSelect>
);

export default OperatingSystemDropdown;
