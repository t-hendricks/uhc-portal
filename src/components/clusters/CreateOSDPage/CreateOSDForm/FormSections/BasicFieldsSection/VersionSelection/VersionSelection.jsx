// a redux-form Field-compatible component for selecting a cluster version

import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
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
import { isSupportedMinorVersion } from '~/common/helpers';
import { useOCPLifeCycleStatusData } from '~/components/releases/hooks';
import { MIN_MANAGED_POLICY_VERSION } from '~/components/clusters/CreateROSAPage/CreateROSAWizard/rosaConstants';
import { RosaCliCommand } from '~/components/clusters/CreateROSAPage/CreateROSAWizard/AccountsRolesScreen/constants/cliCommands';
import InstructionCommand from '../../../../../../common/InstructionCommand';
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

  const toggleCompatibleVersions = (showCompatible, ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    setShowOnlyCompatibleVersions(showCompatible);
  };

  const RosaVersionErrorAlert = () => (
    <Alert
      className="pf-u-ml-lg"
      variant="danger"
      isInline
      role="alert"
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
              {isHypershiftSelected
                ? RosaCliCommand.CreateAccountRolesHCP
                : RosaCliCommand.CreateAccountRoles}
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
      const { raw_id: versionRawId, hosted_control_plane_enabled: hostedEnabled } = version;
      const versionName = parseFloat(versionRawId);
      const minManagedPolicyVersionName = parseFloat(MIN_MANAGED_POLICY_VERSION);

      const versionPatch = Number(versionRawId.split('.')[2]);
      const minManagedPolicyVersionPatch = Number(MIN_MANAGED_POLICY_VERSION.split('.')[2]);

      const isIncompatibleManagedVersion =
        hasManagedArnsSelected &&
        (versionName < minManagedPolicyVersionName ||
          (versionName === minManagedPolicyVersionName &&
            versionPatch < minManagedPolicyVersionPatch));

      const isHostedDisabled = isHypershiftSelected && !hostedEnabled;

      const isIncompatibleVersion =
        (isRosa && !isValidRosaVersion(version)) ||
        isIncompatibleManagedVersion ||
        isHostedDisabled;
      hasIncompatibleVersions = hasIncompatibleVersions || isIncompatibleVersion;

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
          description={selectOptionDescription(isIncompatibleVersion, isHostedDisabled)}
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
          </>
        )}
        {getInstallableVersionsResponse.fulfilled && !rosaVersionError && (
          <Grid>
            <GridItem>
              <Select
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
                    className="pf-u-align-items-center pf-u-mx-md pf-u-mb-sm pf-u-font-size-sm"
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
                          <Button variant="plain" className="pf-u-p-0 pf-u-ml-md">
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
                <SelectGroup
                  label="Maintenance support"
                  className={classNames(!selectOptions.maintenanceSupport?.length && 'pf-u-hidden')}
                >
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
  hasManagedArnsSelected: PropTypes.bool,
  isHypershiftSelected: PropTypes.bool,
  isOpen: PropTypes.bool,
};

export default VersionSelection;
