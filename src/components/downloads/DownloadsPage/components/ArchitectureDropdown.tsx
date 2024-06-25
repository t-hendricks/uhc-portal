import React from 'react';
import { has } from 'lodash';

import { FormSelect, FormSelectOption } from '@patternfly/react-core';

import { urls as URLS } from '~/common/installLinks.mjs';

import { allArchitecturesForTool, architecturesForToolOS } from '../../downloadUtils';

type ArchitectureDropdownProps = {
  urls: typeof URLS;
  tool: string;
  channel: string;
  OS: string | null;
  architecture?: string;
  setArchitecture: (event: React.FormEvent<HTMLSelectElement>, value: string) => void;
};

const ArchitectureDropdown = ({
  urls,
  tool,
  channel,
  OS,
  architecture,
  setArchitecture,
}: ArchitectureDropdownProps) => {
  const optionsForOS = architecturesForToolOS(urls, tool, channel, OS);

  return (
    <FormSelect
      aria-label="Select architecture dropdown"
      value={architecture}
      onChange={setArchitecture}
      isDisabled={optionsForOS.length <= 1}
      data-testid={`arch-dropdown-${tool}`}
    >
      <FormSelectOption key="select" value="select" label="Select architecture" isDisabled />
      {allArchitecturesForTool(urls, tool, channel).map(
        ({ value, label }) =>
          has(urls, [tool, channel, value, OS ?? '']) && (
            <FormSelectOption key={value} value={value} label={label} />
          ),
      )}
    </FormSelect>
  );
};

export default ArchitectureDropdown;
