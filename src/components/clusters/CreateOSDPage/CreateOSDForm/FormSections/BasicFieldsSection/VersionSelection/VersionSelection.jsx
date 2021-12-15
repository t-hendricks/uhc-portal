// a redux-form Field-compatible component for selecting a cluster version

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  Select, SelectOption,
  FormGroup,
} from '@patternfly/react-core';
import ErrorBox from '../../../../../../common/ErrorBox';

function VersionSelection({
  input,
  isDisabled,
  label,
  meta: { error, touched },
  getClusterVersions,
  getClusterVersionsResponse,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [clusterVersions, setClusterVersions] = useState([]);
  const [clusterVersionsErrorBox, setClusterVersionsErrorBox] = useState(null);

  useEffect(() => {
    if (!getClusterVersionsResponse || (!getClusterVersionsResponse.pending
      && !getClusterVersionsResponse.fulfilled)) {
      getClusterVersions();
    } else if (getClusterVersionsResponse.pending) {
      setClusterVersionsErrorBox(null);
    } else if (getClusterVersionsResponse.fulfilled) {
      const versions = get(getClusterVersionsResponse, 'versions', []);
      setClusterVersions(versions);
      setClusterVersionsErrorBox(null);
    } else if (getClusterVersionsResponse.error) {
      // display error
      setClusterVersionsErrorBox(<ErrorBox
        message="Error getting cluster versions"
        response={getClusterVersionsResponse}
      />);
    }
  }, [getClusterVersionsResponse]);

  useEffect(() => {
    if (clusterVersions.length && !input.value) {
      input.onChange(clusterVersions[0]); // default to first version in list
    }
  }, [clusterVersions, input]);

  const onToggle = (toggleOpenValue) => {
    setIsOpen(toggleOpenValue);
  };

  const onSelect = (_, selection) => {
    setIsOpen(false);
    input.onChange(clusterVersions.find(version => version.raw_id === selection));
  };

  const getSelection = () => {
    const selectedVersion = clusterVersions.find(version => get(input, 'value.raw_id') === version.raw_id);
    return selectedVersion ? selectedVersion.raw_id : '';
  };

  return (
    <>
      { clusterVersionsErrorBox }
      <FormGroup
        {...input}
        label={label}
        validated={error ? 'error' : undefined}
        helperTextInvalid={touched && error}
        isRequired
      >
        <Select
          label={label}
          isOpen={isOpen}
          selections={getSelection()}
          onToggle={onToggle}
          onSelect={onSelect}
          isDisabled={isDisabled}
        >
          {clusterVersions.map(version => (
            <SelectOption
              className="pf-c-dropdown__menu-item"
              isSelected={input.value.raw_id === version.raw_id}
              value={version.raw_id}
              formValue={version.raw_id}
              key={version.id}
            >
              {`${version.raw_id}`}
            </SelectOption>
          ))}
        </Select>
      </FormGroup>
    </>
  );
}

VersionSelection.propTypes = {
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func,
  }),
  getClusterVersions: PropTypes.func.isRequired,
  getClusterVersionsResponse: PropTypes.object.isRequired,
  initialValue: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};

export default VersionSelection;
