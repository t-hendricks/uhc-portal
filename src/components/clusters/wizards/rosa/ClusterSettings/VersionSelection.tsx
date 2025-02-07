import React, { ReactElement, useEffect, useState } from 'react';
import { useField } from 'formik';
import { useDispatch } from 'react-redux';

import {
  Button,
  FormGroup,
  MenuToggle,
  MenuToggleElement,
  Popover,
  Select,
  SelectGroup,
  SelectList,
  SelectOption,
  SelectProps,
  Spinner,
  Switch,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';

import { isSupportedMinorVersion } from '~/common/helpers';
import { MIN_MANAGED_POLICY_VERSION } from '~/components/clusters/wizards/rosa/rosaConstants';
import ErrorBox from '~/components/common/ErrorBox';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import { useOCPLifeCycleStatusData } from '~/components/releases/hooks';
import { clustersActions } from '~/redux/actions';
import { useGlobalState } from '~/redux/hooks';
import type { Version } from '~/types/clusters_mgmt.v1';

import { useFormState } from '../../hooks';
import { FieldId } from '../constants';

import RosaVersionErrorAlert from './RosaVersionErrorAlert';

const SupportStatusType = {
  Full: 'Full Support',
  Maintenance: 'Maintenance Support',
};

type VersionSelectionProps = {
  label: string;
  onChange: (version?: Version) => void;
  isOpen?: boolean;
};

function VersionSelection({
  label,
  onChange,
  isOpen: isInitiallyOpen = false, // for testing
}: VersionSelectionProps) {
  const [input, { touched, error }, { setValue }] = useField(FieldId.ClusterVersion);
  const {
    values: {
      [FieldId.ClusterVersion]: selectedClusterVersion,
      [FieldId.Hypershift]: isHypershift,
      [FieldId.RosaMaxOsVersion]: rosaMaxOSVersion,
      [FieldId.InstallerRoleArn]: installerRoleArn,
      [FieldId.SupportRoleArn]: supportRoleArn,
      [FieldId.WorkerRoleArn]: workerRoleArn,
    },
  } = useFormState();
  const isHypershiftSelected = isHypershift === 'true';

  const dispatch = useDispatch();
  const getInstallableVersionsResponse = useGlobalState((state) => state.clusters.clusterVersions);
  const getInstallableVersions = (isHCP: boolean) =>
    dispatch(clustersActions.getInstallableVersions({ isRosa: true, isHCP }));

  const awsAccountRoleArns = useGlobalState(
    (state) => state.rosaReducer.getAWSAccountRolesARNsResponse,
  );

  const hasManagedArnsSelected = (awsAccountRoleArns?.data || []).some(
    (roleGroup) =>
      (roleGroup.managedPolicies || roleGroup.hcpManagedPolicies) &&
      (roleGroup.Installer === installerRoleArn ||
        roleGroup.Support === supportRoleArn ||
        roleGroup.Worker === workerRoleArn),
  );

  const [isOpen, setIsOpen] = useState(isInitiallyOpen);
  const [versions, setVersions] = useState<Version[]>([]);
  const [rosaVersionError, setRosaVersionError] = useState(false);
  const [showOnlyCompatibleVersions, setShowOnlyCompatibleVersions] = useState(true);
  const [statusData] = useOCPLifeCycleStatusData();
  const statusVersions = statusData?.[0]?.versions || [];

  const supportVersionMap = Object.fromEntries(
    // version.name is 'major.minor' string e.g. '4.11'.
    statusVersions.map((version) => [version.name, version.type]),
  );
  const isValidRosaVersion = React.useCallback(
    (version: Version) =>
      isSupportedMinorVersion(version?.raw_id || '', rosaMaxOSVersion) && version.rosa_enabled,
    [rosaMaxOSVersion],
  );

  const isValidHypershiftVersion = React.useCallback(
    // rosaMaxOSVersion - is actually the max version allowed by the chosen AccountRoles
    // if Hypershift is used outside of ROSA, the logic to determine the max version (aka rosaMaxOSVersion)
    // may need to change
    (version: Version) =>
      isSupportedMinorVersion(version?.raw_id || '', rosaMaxOSVersion) &&
      version.hosted_control_plane_enabled,
    [rosaMaxOSVersion],
  );

  const toggleCompatibleVersions = (
    ev: React.FormEvent<HTMLInputElement>,
    showCompatible: boolean,
  ) => {
    ev.preventDefault();
    ev.stopPropagation();
    setShowOnlyCompatibleVersions(showCompatible);
  };

  // HACK: This relies on parseFloat of '4.11.3' to return 4.11 ignoring trailing '.3'.
  // BUG(OCMUI-1736): Comparisons may be wrong e.g. 4.9 > 4.11!
  // BUG(OCMUI-1736): We later rely on converting float back to exactly '4.11'
  //   for indexing `supportVersionMap`.  Float round-tripping is fragile.
  //   Will break when parseFloat('4.20.0').toString() returns '4.2' not '4.20'!
  const versionName = (version: Version) => parseFloat(version.raw_id || '');

  const isHostedDisabled = React.useCallback(
    (version: Version) => isHypershiftSelected && !version.hosted_control_plane_enabled,
    [isHypershiftSelected],
  );

  const incompatibleVersionReason = React.useCallback(
    (version: Version): string | undefined => {
      if (!version?.raw_id) {
        return undefined;
      }

      if (isHostedDisabled(version)) {
        return 'This version is not compatible with a Hosted control plane';
      }

      const minManagedPolicyVersionName = parseFloat(MIN_MANAGED_POLICY_VERSION);

      const versionPatch = Number(version.raw_id.split('.')[2]);

      const minManagedPolicyVersionPatch = Number(MIN_MANAGED_POLICY_VERSION.split('.')[2]);

      const isIncompatibleManagedVersion =
        hasManagedArnsSelected &&
        (versionName(version) < minManagedPolicyVersionName ||
          (versionName(version) === minManagedPolicyVersionName &&
            versionPatch < minManagedPolicyVersionPatch));

      if (!isValidRosaVersion(version) || isIncompatibleManagedVersion) {
        return 'This version is not compatible with the selected ARNs in previous step';
      }
      return undefined;
    },
    [hasManagedArnsSelected, isHostedDisabled, isValidRosaVersion],
  );

  useEffect(() => {
    // Get version list if first time or if control plane selection has changed
    const isHCPVersions = getInstallableVersionsResponse.params?.product === 'hcp';

    if (
      !getInstallableVersionsResponse.fulfilled ||
      getInstallableVersionsResponse.error ||
      (isHCPVersions && !isHypershiftSelected) ||
      (!isHCPVersions && isHypershiftSelected)
    ) {
      getInstallableVersions(isHypershiftSelected);
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
          (!selectedVersionInVersionList || incompatibleVersionReason(selectedVersionInVersionList))
        ) {
          // The previously selected version is no longer compatible
          setValue(undefined);
          onChange(undefined);
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

      const defaultRosaVersion = versions.find((version) => isValidRosaVersion(version));

      const defaultHypershiftVersion =
        isHypershiftSelected && versions.find((version) => isValidHypershiftVersion(version));

      if (!defaultRosaVersion || (isHypershiftSelected && !defaultHypershiftVersion)) {
        setRosaVersionError(true);
        return;
      }

      // default to max: hypershift version supported (if hypershift), rosa version supported, version.default, or first version in list
      const version =
        defaultHypershiftVersion || defaultRosaVersion || defaultVersion || versions[0];

      setValue(version);
      onChange(version);
    }
  }, [
    versions,
    selectedClusterVersion?.raw_id,
    rosaMaxOSVersion,
    setValue,
    onChange,
    isHypershiftSelected,
    isValidRosaVersion,
    isValidHypershiftVersion,
  ]);

  const onToggle = (_event: unknown) => {
    setIsOpen(!isOpen);
    // In case of backend error, don't want infinite loop reloading,
    // but allow manual reload by opening the dropdown.
    if (!isOpen && getInstallableVersionsResponse.error) {
      getInstallableVersions(isHypershiftSelected);
    }
  };

  const onSelect: SelectProps['onSelect'] = (_event, selection) => {
    setIsOpen(false);
    const selectedVersion = versions.find((version) => version.raw_id === selection);
    setValue(selectedVersion);
    onChange(selectedVersion);
  };

  const getSelection = () => {
    const selectedVersion = versions.find((version) => input.value?.raw_id === version.raw_id);
    return selectedVersion ? selectedVersion.raw_id : '';
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggle}
      isExpanded={isOpen}
      style={{
        width: '100%',
        minWidth: '100%',
      }}
      id={FieldId.ClusterVersion}
    >
      {selectedClusterVersion?.raw_id || getSelection()}
    </MenuToggle>
  );

  const selectOptions = React.useMemo(() => {
    const fullSupport: ReactElement[] = [];
    const maintenanceSupport: ReactElement[] = [];
    let hasIncompatibleVersions = false;

    versions.forEach((version) => {
      const disableReason = incompatibleVersionReason(version);

      hasIncompatibleVersions ||= !!disableReason;

      if (disableReason && showOnlyCompatibleVersions) {
        return;
      }

      const selectOption = (
        <SelectOption
          value={version.raw_id}
          key={version.id}
          isDisabled={!!disableReason}
          description={disableReason || ''}
        >
          {`${version.raw_id}`}
        </SelectOption>
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
  }, [incompatibleVersionReason, supportVersionMap, versions, showOnlyCompatibleVersions]);

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
          <Spinner size="lg" aria-label="Loading..." />
        </div>
      )}
      {getInstallableVersionsResponse.fulfilled && !rosaVersionError && (
        <Select
          isOpen={isOpen}
          selected={selectedClusterVersion?.raw_id || getSelection()}
          toggle={toggle}
          onOpenChange={setIsOpen}
          onSelect={onSelect}
          maxMenuHeight="20em"
          isScrollable
        >
          {selectOptions.hasIncompatibleVersions ? (
            <Switch
              className="pf-v5-u-mx-md pf-v5-u-mt-md pf-v5-u-font-size-sm"
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
          ) : null}

          <SelectGroup label="Full support" id="full-support">
            <SelectList aria-labelledby="full-support">{selectOptions.fullSupport}</SelectList>
          </SelectGroup>
          {selectOptions.maintenanceSupport?.length > 0 ? (
            <SelectGroup label="Maintenance support" id="maintenance-support">
              <SelectList aria-labelledby="maintenance-support">
                {selectOptions.maintenanceSupport}
              </SelectList>
            </SelectGroup>
          ) : null}
        </Select>
      )}

      <FormGroupHelperText touched={touched} error={error} />
    </FormGroup>
  );
}

export default VersionSelection;
