import React from 'react';
import PropTypes from 'prop-types';
import {
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';

export const downloadsCategoryTitles = {
  ALL: 'All categories',
  CLI: 'Command-line interface (CLI) tools',
  DEV: 'Developer tools',
  INSTALLATION: 'OpenShift installation',
  TOKENS: 'Tokens',
};

const DownloadsCategoryDropdown = ({ selectedCategory, setCategory }) => (
  <FormSelect
    aria-label="Select category"
    value={selectedCategory}
    onChange={setCategory}
  >
    {['ALL', 'CLI', 'DEV', 'INSTALLATION', 'TOKENS'].map(key => (
      <FormSelectOption key={key} value={key} label={downloadsCategoryTitles[key]} />
    ))}
  </FormSelect>
);
DownloadsCategoryDropdown.propTypes = {
  selectedCategory: PropTypes.oneOf(Object.keys(downloadsCategoryTitles)).isRequired,
  setCategory: PropTypes.func.isRequired,
};

export default DownloadsCategoryDropdown;
