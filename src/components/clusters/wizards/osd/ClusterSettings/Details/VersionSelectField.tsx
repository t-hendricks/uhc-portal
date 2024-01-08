import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useField } from 'formik';

import { FormGroup } from '@patternfly/react-core';
import { SelectOptionObject as SelectOptionObjectDeprecated } from '@patternfly/react-core/deprecated';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';

import ErrorBox from '~/components/common/ErrorBox';
import { useOCPLifeCycleStatusData } from '~/components/releases/hooks';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { clustersActions } from '~/redux/actions';
import { useGlobalState } from '~/redux/hooks';
import { Version } from '~/types/clusters_mgmt.v1';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { billingModels } from '~/common/subscriptionTypes';
import FuzzySelect, { FuzzyEntryType } from '~/components/common/FuzzySelect';
import { versionComparator } from '~/common/versionComparator';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';

function sortFn(a: FuzzyEntryType, b: FuzzyEntryType) {
  return versionComparator(b.key, a.key);
}

interface VersionSelectFieldProps {
  label: string;
  name: string;
  isDisabled?: boolean;
  onChange: (version: Version) => void;
}

type VersionIdData = {
  versionRawId: string;
  versionId: string;
};

const SupportStatusType = {
  Full: 'Full Support',
  Maintenance: 'Maintenance Support',
};

export const VersionSelectField = ({
  name,
  label,
  isDisabled,
  onChange,
}: VersionSelectFieldProps) => {
  const dispatch = useDispatch();
  const [input, { touched, error }] = useField(name);
  const { clusterVersions: getInstallableVersionsResponse } = useGlobalState(
    (state) => state.clusters,
  );
  const {
    values: {
      [FieldId.ClusterVersion]: selectedClusterVersion,
      [FieldId.BillingModel]: billingModel,
    },
    setFieldValue,
  } = useFormState();
  const [isOpen, setIsOpen] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [statusData] = useOCPLifeCycleStatusData();
  const statusVersions = statusData?.[0]?.versions;
  const supportVersionMap = statusVersions?.reduce((acc: Record<string, string>, version) => {
    acc[version.name] = version.type;
    return acc;
  }, {});

  const isMarketplaceGcp = billingModel === billingModels.MARKETPLACE_GCP;

  const getInstallableVersions = () =>
    dispatch(clustersActions.getInstallableVersions(false, isMarketplaceGcp));

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

  const onToggle = (
    _event:
      | Event
      | React.MouseEvent<Element, MouseEvent>
      | React.ChangeEvent<Element>
      | React.KeyboardEvent<Element>,
    isExpanded: boolean,
  ) => {
    setIsOpen(isExpanded);
    // In case of backend error, don't want infinite loop reloading,
    // but allow manual reload by opening the dropdown.
    if (isExpanded && getInstallableVersionsResponse.error) {
      getInstallableVersions();
    }
  };

  const onSelect = (
    _event: React.ChangeEvent | React.MouseEvent<Element, MouseEvent>,
    value: string | SelectOptionObjectDeprecated,
  ) => {
    setIsOpen(false);
    const selectedVersion = versions.find((version) => version.raw_id === value);
    setFieldValue(name, selectedVersion);
    if (selectedVersion) {
      onChange(selectedVersion);
    }
  };

  const getSelection = () => {
    const selectedVersion = versions.find((version) => input?.value?.raw_id === version.raw_id);
    return selectedVersion ? selectedVersion.raw_id : '';
  };

  const getVersionsBySupportType = React.useMemo(() => {
    const fullSupport: VersionIdData[] = [];
    const maintenanceSupport: VersionIdData[] = [];

    versions.forEach((version: Version) => {
      const { raw_id: versionRawId, id: versionId } = version;
      if (versionRawId && versionId) {
        const majorMinorVersion = parseFloat(versionRawId);
        if (supportVersionMap?.[majorMinorVersion] === SupportStatusType.Full) {
          fullSupport.push({ versionRawId, versionId });
        } else {
          maintenanceSupport.push({ versionRawId, versionId });
        }
      }
    });
    return { fullSupport, maintenanceSupport };
  }, [supportVersionMap, versions]);

  const versionsData = {
    'Full support': getVersionsBySupportType.fullSupport.map((version) => ({
      key: version.versionRawId,
      value: version.versionRawId,
      groupKey: 'Full support',
    })),
    'Maintenance support': getVersionsBySupportType.maintenanceSupport.map((version) => ({
      key: version.versionRawId,
      value: version.versionRawId,
      groupKey: 'Maintenance support',
    })),
  };

  return (
    <FormGroup {...input} label={label} fieldId={name} isRequired>
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
        <FuzzySelect
          label={label}
          aria-label={label}
          isOpen={isOpen}
          onToggle={onToggle}
          onSelect={onSelect}
          selected={selectedClusterVersion?.raw_id || getSelection()}
          selectionData={versionsData}
          isDisabled={isDisabled}
          sortFn={sortFn}
          placeholderText="Filter by versions"
          filterValidate={{
            pattern: /^[0-9.]*$/gm,
            message: 'Please enter only digits or periods.',
          }}
          truncation={100}
          inlineFilterPlaceholderText="Filter by version number"
          toggleId="version-selector"
        />
      )}

      <FormGroupHelperText touched={touched} error={error} />
    </FormGroup>
  );
};
