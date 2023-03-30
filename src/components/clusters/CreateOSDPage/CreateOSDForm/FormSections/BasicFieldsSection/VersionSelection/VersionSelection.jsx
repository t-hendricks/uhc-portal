// a redux-form Field-compatible component for selecting a cluster version

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  Select,
  SelectOption,
  SelectGroup,
  FormGroup,
  TextList,
  TextListVariants,
  TextListItem,
  Text,
  TextVariants,
  Alert,
  Switch,
  Popover,
  Button,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import ErrorBox from '../../../../../../common/ErrorBox';
import InstructionCommand from '../../../../../../common/InstructionCommand';
import { isSupportedMinorVersion } from '~/common/helpers';
import { useOCPLifeCycleStatusData } from '~/components/releases/hooks';

function VersionSelection({
  isRosa,
  rosaMaxOSVersion,
  input,
  isDisabled,
  label,
  meta: { error, touched },
  getInstallableVersions,
  getInstallableVersionsResponse,
  selectedClusterVersion,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [versions, setVersions] = useState([]);
  const [rosaVersionError, setRosaVersionError] = useState(false);
  const [showOnlyCompatibleVersions, setShowOnlyCompatibleVersions] = useState(isRosa || false);
  const [statusData] = useOCPLifeCycleStatusData();
  const statusVersions = statusData?.[0]?.versions;
  const supportVersionMap = statusVersions?.reduce((acc, version) => {
    acc[version.name] = version.type;
    return acc;
  }, {});

  const isValidRosaVersion = React.useCallback(
    (version) => isSupportedMinorVersion(version, rosaMaxOSVersion),
    [rosaMaxOSVersion],
  );

  const toggleCompatibleVersions = () => {
    setShowOnlyCompatibleVersions(!showOnlyCompatibleVersions);
  };

  const RosaVersionErrorAlert = () => (
    <Alert
      className="pf-u-ml-lg"
      variant="danger"
      isInline
      title="There is no version compatible with the selected ARNs in previous step"
    >
      <TextList component={TextListVariants.ol} className="ocm-c-wizard-alert-steps">
        <TextListItem className="pf-u-mb-sm">
          <Text component={TextVariants.p} className="pf-u-mb-sm">
            Please select different ARNs or create new account roles using the following command in
            the ROSA CLI
          </Text>
        </TextListItem>
        <TextListItem className="pf-u-mb-sm">
          <Text component={TextVariants.p} className="pf-u-mb-sm">
            <InstructionCommand textAriaLabel="Copyable ROSA create account-roles command">
              rosa create account-roles
            </InstructionCommand>
          </Text>
        </TextListItem>
      </TextList>
    </Alert>
  );

  useEffect(() => {
    if (getInstallableVersionsResponse.fulfilled) {
      setVersions(get(getInstallableVersionsResponse, 'versions', []));
    } else if (getInstallableVersionsResponse.error) {
      // error, close dropdown
      setIsOpen(false);
    } else if (!getInstallableVersionsResponse.pending) {
      // First time.
      getInstallableVersions(isRosa);
    }
  }, [getInstallableVersions, getInstallableVersionsResponse, isRosa]);

  useEffect(() => {
    if (versions.length && !selectedClusterVersion?.raw_id) {
      const defaultVersionIndex = versions.findIndex((version) => version.default === true);
      const defaultRosaVersionIndex = isRosa
        ? versions.findIndex((version) => isValidRosaVersion(version.raw_id))
        : -1;
      const defaultRosaVersionFound = defaultRosaVersionIndex !== -1;
      if (isRosa && !defaultRosaVersionFound) {
        setRosaVersionError(true);
        return;
      }
      // default to max rosa version supported, version.default, or first version in list
      const versionIndex = defaultRosaVersionFound ? defaultRosaVersionIndex : defaultVersionIndex;
      input.onChange(versions[versionIndex !== -1 ? versionIndex : 0]);
    }
  }, [
    versions,
    selectedClusterVersion?.raw_id,
    isRosa,
    rosaMaxOSVersion,
    input,
    isValidRosaVersion,
  ]);

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
    input.onChange(versions.find((version) => version.raw_id === selection));
  };

  const getSelection = () => {
    const selectedVersion = versions.find(
      (version) => get(input, 'value.raw_id') === version.raw_id,
    );
    return selectedVersion ? selectedVersion.raw_id : '';
  };

  const selectOptions = React.useMemo(() => {
    const fullSupport = [];
    const maintenanceSupport = [];

    versions.forEach((version) => {
      const versionName = version.raw_id.split('.', 2).join('.');
      const isIncompatibleVersion = isRosa && !isValidRosaVersion(version.raw_id);

      if (isIncompatibleVersion && showOnlyCompatibleVersions) {
        return;
      }

      const selectOption = (
        <SelectOption
          className="pf-c-dropdown__menu-item"
          isSelected={selectedClusterVersion?.raw_id === version.raw_id}
          value={version.raw_id}
          formValue={version.raw_id}
          key={version.id}
          isDisabled={isIncompatibleVersion}
          description={
            isIncompatibleVersion &&
            'This version is not compatible with the selected ARNs in previous step'
          }
        >
          {`${version.raw_id}`}
        </SelectOption>
      );

      switch (supportVersionMap?.[versionName]) {
        case SupportStatusType.Full:
          fullSupport.push(selectOption);
          break;
        default:
          maintenanceSupport.push(selectOption);
      }
    });

    return {
      fullSupport,
      maintenanceSupport,
    };
  }, [
    isRosa,
    isValidRosaVersion,
    selectedClusterVersion?.raw_id,
    supportVersionMap,
    versions,
    showOnlyCompatibleVersions,
  ]);

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
          <ErrorBox
            message="Error getting cluster versions"
            response={getInstallableVersionsResponse}
          />
        )}
        {rosaVersionError && <RosaVersionErrorAlert />}
        {getInstallableVersionsResponse.pending && (
          <>
            <div className="spinner-fit-container">
              <Spinner />
            </div>
            <div className="spinner-loading-text">Loading...</div>
          </>
        )}
        {getInstallableVersionsResponse.fulfilled && !rosaVersionError && (
          <Grid>
            <GridItem>
              <Select
                label={label}
                isOpen={isOpen}
                selections={selectedClusterVersion?.raw_id || getSelection()}
                onToggle={onToggle}
                onSelect={onSelect}
                isDisabled={isDisabled}
                onBlur={(event) => event.stopPropagation()}
              >
                {isRosa ? (
                  <Switch
                    className="pf-u-align-items-center pf-u-mx-md"
                    id="view-only-compatible-versions"
                    aria-label="View only compatible versions"
                    label={
                      <>
                        <span>View only compatible versions</span>
                        <Popover
                          bodyContent="View only versions that are compatible with the selected ARNs in previous step"
                          enableFlip={false}
                        >
                          <Button variant="plain">
                            <OutlinedQuestionCircleIcon />
                          </Button>
                        </Popover>
                      </>
                    }
                    hasCheckIcon
                    isChecked={showOnlyCompatibleVersions}
                    onChange={toggleCompatibleVersions}
                  />
                ) : (
                  <span className="pf-u-display-none">&nbsp;</span>
                )}
                <SelectGroup label="Full support">{selectOptions.fullSupport}</SelectGroup>
                <SelectGroup label="Maintenance support">
                  {selectOptions.maintenanceSupport}
                </SelectGroup>
              </Select>
            </GridItem>
          </Grid>
        )}
      </FormGroup>
    </>
  );
}

const SupportStatusType = {
  Full: 'Full Support',
  Maintenance: 'Maintenance Support',
};

VersionSelection.propTypes = {
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func,
  }),
  selectedClusterVersion: PropTypes.string,
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
