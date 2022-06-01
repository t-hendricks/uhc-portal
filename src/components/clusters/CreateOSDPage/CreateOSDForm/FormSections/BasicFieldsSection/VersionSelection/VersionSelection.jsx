// a redux-form Field-compatible component for selecting a cluster version

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import semver from 'semver';
import {
  Select, SelectOption,
  FormGroup,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import ErrorBox from '../../../../../../common/ErrorBox';

function VersionSelection({
  isRosa,
  rosaMaxOSVersion,
  input,
  isDisabled,
  label,
  meta: { error, touched },
  getInstallableVersions,
  getInstallableVersionsResponse,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [versions, setVersions] = useState([]);
  const [versionsErrorBox, setVersionsErrorBox] = useState(null);

  const isValidRosaVersion = version => rosaMaxOSVersion
    && semver.satisfies(version, `<=${semver.major(rosaMaxOSVersion)}.${semver.minor(rosaMaxOSVersion)}`);

  useEffect(() => {
    if (getInstallableVersionsResponse.pending) {
      setVersionsErrorBox(null);
    } else if (getInstallableVersionsResponse.fulfilled) {
      setVersions(get(getInstallableVersionsResponse, 'versions', []));
      setVersionsErrorBox(null);
    } else if (getInstallableVersionsResponse.error) {
      // display error
      setVersionsErrorBox(<ErrorBox
        message="Error getting cluster versions"
        response={getInstallableVersionsResponse}
      />);
      setIsOpen(false);
    } else { // First time.
      getInstallableVersions(isRosa);
    }
  }, [getInstallableVersionsResponse]);

  useEffect(() => {
    if (versions.length && !input.value?.raw_id) {
      const defaultVersionIndex = versions.findIndex(version => version.default === true);
      const defaultRosaVersionIndex = isRosa
        && versions.findIndex(version => isValidRosaVersion(version.raw_id));
      // default to max rosa version supported, version.default, or first version in list
      const versionIndex = defaultRosaVersionIndex !== -1
        ? defaultRosaVersionIndex
        : defaultVersionIndex;
      input.onChange(versions[versionIndex !== -1 ? versionIndex : 0]);
    }
  }, [versions, input.value?.raw_id, isRosa, rosaMaxOSVersion]);

  const onToggle = (toggleOpenValue) => {
    setIsOpen(toggleOpenValue);
    // In case of backend error, don't want infinite loop reloading,
    // but allow manual reload by opening the dropdown.
    if (toggleOpenValue && getInstallableVersionsResponse.error) {
      getInstallableVersions(isRosa);
    }
  };

  const onSelect = (_, selection) => {
    setIsOpen(false);
    input.onChange(versions.find(version => version.raw_id === selection));
  };

  const getSelection = () => {
    const selectedVersion = versions.find(version => get(input, 'value.raw_id') === version.raw_id);
    return selectedVersion ? selectedVersion.raw_id : '';
  };

  return (
    <>
      <FormGroup
        {...input}
        label={label}
        validated={error ? 'error' : undefined}
        helperTextInvalid={touched && error}
        isRequired
      >
        {getInstallableVersionsResponse.error && (
          { versionsErrorBox }
        )}
        {getInstallableVersions.pending && (
          <>
            <div className="spinner-fit-container"><Spinner /></div>
            <div className="spinner-loading-text">Loading...</div>
          </>
        )}
        {getInstallableVersionsResponse.fulfilled && (
          <Select
            label={label}
            isOpen={isOpen}
            selections={input.value.raw_id || getSelection()}
            onToggle={onToggle}
            onSelect={onSelect}
            isDisabled={isDisabled}
          >
            {versions.map(version => (
              <SelectOption
                className="pf-c-dropdown__menu-item"
                isSelected={input.value.raw_id === version.raw_id}
                value={version.raw_id}
                formValue={version.raw_id}
                key={version.id}
                isDisabled={isRosa && !isValidRosaVersion(version.raw_id)}
                description={isRosa && !isValidRosaVersion(version.raw_id) && 'This version is not compatible with the selected ARNs in previous step'}
              >
                {`${version.raw_id}`}
              </SelectOption>
            ))}
          </Select>
        )}
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
  isRosa: PropTypes.bool,
  rosaMaxOSVersion: PropTypes.string,
  getInstallableVersions: PropTypes.func.isRequired,
  getInstallableVersionsResponse: PropTypes.object.isRequired,
  initialValue: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};

export default VersionSelection;
