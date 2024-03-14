// a redux-form Field-compatible component for selecting a cluster version

import { Button, FormGroup, Grid, GridItem, Popover, Switch } from '@patternfly/react-core';
import {
  Select as SelectDeprecated,
  SelectGroup as SelectGroupDeprecated,
  SelectOption as SelectOptionDeprecated,
} from '@patternfly/react-core/deprecated';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { isSupportedMinorVersion } from '~/common/helpers';
import { MIN_MANAGED_POLICY_VERSION } from '~/components/clusters/wizards/rosa_v1/rosaConstants';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import { useOCPLifeCycleStatusData } from '~/components/releases/hooks';
import ErrorBox from '../../../../../../common/ErrorBox';
import RosaVersionErrorAlert from './RosaVersionErrorAlert';

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
  hasManagedArnsSelected,
  isHypershiftSelected,
  isOpen: isInitiallyOpen = false,
}) {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);
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
    (version) => isSupportedMinorVersion(version.raw_id, rosaMaxOSVersion) && version.rosa_enabled,
    [rosaMaxOSVersion],
  );

  const isValidHypershiftVersion = React.useCallback(
    // rosaMaxOSVersion - is actually the max version allowed by the chosen AccountRoles
    // if Hypershift is used outside of ROSA, the logic to determine the max version (aka rosaMaxOSVersion)
    // may need to change
    (version) =>
      isSupportedMinorVersion(version.raw_id, rosaMaxOSVersion) &&
      version.hosted_control_plane_enabled,
    [rosaMaxOSVersion],
  );

  const toggleCompatibleVersions = (ev, showCompatible) => {
    ev.preventDefault();
    ev.stopPropagation();
    setShowOnlyCompatibleVersions(showCompatible);
  };

  const versionName = (version) => parseFloat(version.raw_id);

  const isHostedDisabled = (version) =>
    isHypershiftSelected && !version.hosted_control_plane_enabled;

  const isIncompatibleVersion = (version) => {
    if (!version?.raw_id) {
      return false;
    }
    const minManagedPolicyVersionName = parseFloat(MIN_MANAGED_POLICY_VERSION);

    const versionPatch = Number(version.raw_id.split('.')[2]);

    const minManagedPolicyVersionPatch = Number(MIN_MANAGED_POLICY_VERSION.split('.')[2]);

    const isIncompatibleManagedVersion =
      hasManagedArnsSelected &&
      (versionName(version) < minManagedPolicyVersionName ||
        (versionName(version) === minManagedPolicyVersionName &&
          versionPatch < minManagedPolicyVersionPatch));

    return (
      (isRosa && !isValidRosaVersion(version)) ||
      isIncompatibleManagedVersion ||
      isHostedDisabled(version)
    );
  };

  useEffect(() => {
    // Get version list if first time or if control plane selection has changed
    const isHCPVersions = getInstallableVersionsResponse.params?.product === 'hcp';

    if (
      !getInstallableVersionsResponse.fulfilled ||
      getInstallableVersionsResponse.error ||
      (isHCPVersions && !isHypershiftSelected) ||
      (!isHCPVersions && isHypershiftSelected)
    ) {
      getInstallableVersions(isRosa, isHypershiftSelected);
    }
    // Call only component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      if (getInstallableVersionsResponse.fulfilled) {
        const versions = getInstallableVersionsResponse?.versions ?? [];

        const selectedVersionInVersionList = versions.find(
          (ver) => ver.raw_id === selectedClusterVersion?.raw_id,
        );

        if (
          selectedClusterVersion?.raw_id &&
          (!selectedVersionInVersionList || isIncompatibleVersion(selectedVersionInVersionList))
        ) {
          // The previously selected version is no longer compatible
          input.onChange(undefined);
        }
        setVersions(versions);
      } else if (getInstallableVersionsResponse.error) {
        // error, close dropdown
        setIsOpen(false);
      }
    },
    // We only want to run this code when the full set of available versions is available.
    // and not when  selectedClusterVersion? changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getInstallableVersionsResponse],
  );

  useEffect(() => {
    if (versions.length && !selectedClusterVersion?.raw_id) {
      const defaultVersion = versions.find((version) => version.default === true);

      const defaultRosaVersion = isRosa && versions.find((version) => isValidRosaVersion(version));

      const defaultHypershiftVersion =
        isHypershiftSelected && versions.find((version) => isValidHypershiftVersion(version));

      if ((isRosa && !defaultRosaVersion) || (isHypershiftSelected && !defaultHypershiftVersion)) {
        setRosaVersionError(true);
        return;
      }

      // default to max: hypershift version supported (if hypershift), rosa version supported, version.default, or first version in list
      const version =
        defaultHypershiftVersion || defaultRosaVersion || defaultVersion || versions[0];

      input.onChange(version);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    versions,
    selectedClusterVersion?.raw_id,
    isRosa,
    rosaMaxOSVersion,
    input,
    isValidRosaVersion,
  ]);

  const onToggle = (_event, toggleOpenValue) => {
    setIsOpen(toggleOpenValue);
    // In case of backend error, don't want infinite loop reloading,
    // but allow manual reload by opening the dropdown.
    if (toggleOpenValue && getInstallableVersionsResponse.error) {
      getInstallableVersions(isRosa, isHypershiftSelected);
    }
  };

  const onSelect = (_, selection) => {
    setIsOpen(false);
    input.onChange(versions.find((version) => version.raw_id === selection));
  };

  const getSelection = () => {
    const selectedVersion = versions.find((version) => input.value?.raw_id === version.raw_id);
    return selectedVersion ? selectedVersion.raw_id : '';
  };

  const selectOptionDescription = (isIncompatibleVersion, isHostedDisabled) => {
    if (isHostedDisabled) return 'This version is not compatible with a Hosted control plane';
    if (isIncompatibleVersion)
      return 'This version is not compatible with the selected ARNs in previous step';

    return '';
  };

  const selectOptions = React.useMemo(() => {
    const fullSupport = [];
    const maintenanceSupport = [];
    let hasIncompatibleVersions = false;

    versions.forEach((version) => {
      const isIncompatible = isIncompatibleVersion(version);

      hasIncompatibleVersions = hasIncompatibleVersions || isIncompatible;

      if (isIncompatible && showOnlyCompatibleVersions) {
        return;
      }

      const selectOption = (
        <SelectOptionDeprecated
          className="pf-v5-c-dropdown__menu-item"
          isSelected={selectedClusterVersion?.raw_id === version.raw_id}
          value={version.raw_id}
          formValue={version.raw_id}
          key={version.id}
          isDisabled={isIncompatible}
          description={selectOptionDescription(isIncompatible, isHostedDisabled(version))}
        >
          {`${version.raw_id}`}
        </SelectOptionDeprecated>
      );

      switch (supportVersionMap?.[versionName(version)]) {
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
      hasIncompatibleVersions,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isRosa,
    isValidRosaVersion,
    selectedClusterVersion?.raw_id,
    supportVersionMap,
    versions,
    showOnlyCompatibleVersions,
  ]);

  return (
    <FormGroup {...input} label={label} isRequired>
      {getInstallableVersionsResponse.error && (
        <ErrorBox
          message="Error getting cluster versions"
          response={getInstallableVersionsResponse}
        />
      )}
      {rosaVersionError ? (
        <RosaVersionErrorAlert isHypershiftSelected={isHypershiftSelected} />
      ) : null}
      {getInstallableVersionsResponse.pending && (
        <div className="spinner-fit-container">
          <Spinner />
        </div>
      )}
      {getInstallableVersionsResponse.fulfilled && !rosaVersionError && (
        <Grid>
          <GridItem>
            <SelectDeprecated
              label={label}
              aria-label={label}
              isOpen={isOpen}
              selections={selectedClusterVersion?.raw_id || getSelection()}
              onToggle={onToggle}
              onSelect={onSelect}
              isDisabled={isDisabled}
              onBlur={(event) => event.stopPropagation()}
            >
              {isRosa && selectOptions.hasIncompatibleVersions ? (
                <Switch
                  className="pf-v5-u-align-items-center pf-v5-u-mx-md pf-v5-u-mb-sm pf-v5-u-font-size-sm"
                  id="view-only-compatible-versions"
                  aria-label="View only compatible versions"
                  key={`compatible-switch-${showOnlyCompatibleVersions}`}
                  label={
                    <>
                      <span>View only compatible versions</span>
                      <Popover
                        bodyContent={
                          isHypershiftSelected
                            ? 'View only versions that are compatible with a Hosted control plane'
                            : 'View only versions that are compatible with the selected ARNs in previous step'
                        }
                        enableFlip={false}
                      >
                        <Button variant="plain" className="pf-v5-u-p-0 pf-v5-u-ml-md">
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
                <span className="pf-v5-u-display-none">&nbsp;</span>
              )}
              <SelectGroupDeprecated label="Full support">
                {selectOptions.fullSupport}
              </SelectGroupDeprecated>
              <SelectGroupDeprecated
                label="Maintenance support"
                className={classNames(
                  !selectOptions.maintenanceSupport?.length && 'pf-v5-u-hidden',
                )}
              >
                {selectOptions.maintenanceSupport}
              </SelectGroupDeprecated>
            </SelectDeprecated>
          </GridItem>
        </Grid>
      )}

      <FormGroupHelperText touched={touched} error={error} />
    </FormGroup>
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
  selectedClusterVersion: PropTypes.shape({
    raw_id: PropTypes.string,
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
  hasManagedArnsSelected: PropTypes.bool,
  isHypershiftSelected: PropTypes.bool,
  isOpen: PropTypes.bool,
};

export default VersionSelection;
