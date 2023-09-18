import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useField } from 'formik';
import get from 'lodash/get';

import { Select, SelectOption, FormGroup, SelectOptionObject } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';

import ErrorBox from '~/components/common/ErrorBox';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { clustersActions } from '~/redux/actions';
import { useGlobalState } from '~/redux/hooks';
import { Version } from '~/types/clusters_mgmt.v1';
import { FieldId } from '~/components/clusters/wizards/osd/constants';

interface VersionSelectFieldProps {
  label: string;
  name: string;
  isDisabled?: boolean;
}

export const VersionSelectField = ({ name, label, isDisabled }: VersionSelectFieldProps) => {
  const dispatch = useDispatch();
  const [input, { touched, error }] = useField(name);
  const { clusterVersions: getInstallableVersionsResponse } = useGlobalState(
    (state) => state.clusters,
  );
  const {
    values: { [FieldId.ClusterVersion]: selectedClusterVersion },
    setFieldValue,
  } = useFormState();
  const [isOpen, setIsOpen] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);

  const getInstallableVersions = () => dispatch(clustersActions.getInstallableVersions(false));

  useEffect(() => {
    if (getInstallableVersionsResponse.fulfilled) {
      setVersions(getInstallableVersionsResponse.versions);
    } else if (getInstallableVersionsResponse.error) {
      // error, close dropdown
      setIsOpen(false);
    } else if (!getInstallableVersionsResponse.pending) {
      // First time.
      getInstallableVersions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getInstallableVersionsResponse]);

  useEffect(() => {
    if (versions.length && !selectedClusterVersion?.raw_id) {
      const versionIndex = versions.findIndex((version) => version.default === true);
      setFieldValue(name, versions[versionIndex !== -1 ? versionIndex : 0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versions, selectedClusterVersion?.raw_id]);

  const onToggle = (isExpanded: boolean) => {
    setIsOpen(isExpanded);
    // In case of backend error, don't want infinite loop reloading,
    // but allow manual reload by opening the dropdown.
    if (isExpanded && getInstallableVersionsResponse.error) {
      getInstallableVersions();
    }
  };

  const onSelect = (
    _event: React.ChangeEvent<Element> | React.MouseEvent<Element, MouseEvent>,
    value: string | SelectOptionObject,
  ) => {
    setIsOpen(false);
    setFieldValue(
      name,
      versions.find((version) => version.raw_id === value),
    );
  };

  const getSelection = () => {
    const selectedVersion = versions.find(
      (version) => get(input, 'value.raw_id') === version.raw_id,
    );
    return selectedVersion ? selectedVersion.raw_id : '';
  };

  return (
    <FormGroup
      {...input}
      label={label}
      fieldId={name}
      validated={error ? 'error' : undefined}
      helperTextInvalid={touched && error}
      isRequired
    >
      {getInstallableVersionsResponse.error && (
        <ErrorBox
          message="Error getting cluster versions"
          response={getInstallableVersionsResponse}
        />
      )}

      {getInstallableVersionsResponse.pending && (
        <>
          <div className="spinner-fit-container">
            <Spinner />
          </div>
          <div className="spinner-loading-text">Loading...</div>
        </>
      )}

      {getInstallableVersionsResponse.fulfilled && (
        <Select
          label={label}
          isOpen={isOpen}
          selections={selectedClusterVersion?.raw_id || getSelection()}
          onToggle={onToggle}
          onSelect={onSelect}
          isDisabled={isDisabled}
        >
          {versions.map((version) => (
            <SelectOption
              className="pf-c-dropdown__menu-item"
              isSelected={selectedClusterVersion?.raw_id === version.raw_id}
              value={version.raw_id}
              key={version.id}
            >
              {`${version.raw_id}`}
            </SelectOption>
          ))}
        </Select>
      )}
    </FormGroup>
  );
};
