import React from 'react';

import { FormSelect, FormSelectOption } from '@patternfly/react-core';

import { allCategories, downloadsCategories } from './downloadsStructure';

type DownloadsCategoryDropdownProps = {
  selectedCategory: (typeof allCategories)[number]['key'];
  setCategory: (
    event: React.FormEvent<HTMLSelectElement>,
    selectedCategory: (typeof allCategories)[number]['key'],
  ) => void;
};

const DownloadsCategoryDropdown = ({
  selectedCategory,
  setCategory,
}: DownloadsCategoryDropdownProps) => (
  <FormSelect
    aria-label="Select category"
    value={selectedCategory}
    onChange={setCategory}
    data-testid="downloads-category-dropdown"
  >
    {downloadsCategories().map((c) => (
      <FormSelectOption key={c.key} value={c.key} label={c.title} />
    ))}
  </FormSelect>
);

export default DownloadsCategoryDropdown;
