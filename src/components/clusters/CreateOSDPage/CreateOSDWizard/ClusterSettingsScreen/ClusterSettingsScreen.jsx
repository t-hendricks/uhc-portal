import React from 'react';
import PropTypes from 'prop-types';
import {
  Title,
  Grid,
  GridItem,
  FormGroup,
  Form,
} from '@patternfly/react-core';
import { Field } from 'redux-form';

import PopoverHint from '../../../../common/PopoverHint';
import ReduxCheckbox from '../../../../common/ReduxFormComponents/ReduxCheckbox';
import ExternalLink from '../../../../common/ExternalLink';
import PersistentStorageDropdown from '../../../common/PersistentStorageDropdown';
import LoadBalancersDropdown from '../../../common/LoadBalancersDropdown';

import GCPClusterEncryption from '../../CreateOSDForm/FormSections/EncryptionSection/GCPClusterEncryption';
import UserWorkloadMonitoringSection from '../../../common/UserWorkloadMonitoringSection';

import { constants } from '../../CreateOSDForm/CreateOSDFormConstants';

import BasicFieldsSection from '../../CreateOSDForm/FormSections/BasicFieldsSection';
import UpgradeSettingsFields from '../../../common/Upgrades/UpgradeSettingsFields';

function ClusterSettingsScreen({
  isByoc,
  isMultiAz,
  isAutomaticUpgrade,
  canEnableEtcdEncryption,
  customerManagedEncryptionSelected,
  selectedRegion,
  cloudProviderID,
  product,
  billingModel,
  change,
}) {
  const isGCP = cloudProviderID === 'gcp';

  return (
    <Form onSubmit={() => false}>
      <Grid>
        <GridItem span={12}>
          <Title headingLevel="h3">Cluster details</Title>
        </GridItem>
        <BasicFieldsSection
        /* TODO move some props to index.js */
          cloudProviderID={cloudProviderID}
          isBYOC={isByoc}
          isMultiAz={isMultiAz}
          showAvailability
          change={change}
        />
        <GridItem span={4}>
          <FormGroup
            label="Persistent storage"
            fieldId="persistent_storage"
            labelIcon={<PopoverHint hint={constants.persistentStorageHint} />}
          >
            <Field
              name="persistent_storage"
              component={PersistentStorageDropdown}
              currentValue={null}
              cloudProviderID={cloudProviderID}
              billingModel={billingModel}
              product={product}
              isBYOC={isByoc}
              isMultiAZ={isMultiAz}
            />
          </FormGroup>
        </GridItem>
        <GridItem span={8} />
        <GridItem span={4}>
          <FormGroup
            label="Load balancers"
            fieldId="load_balancers"
            labelIcon={<PopoverHint hint={constants.loadBalancersHint} />}
          >
            <Field
              name="load_balancers"
              component={LoadBalancersDropdown}
              currentValue={null}
              cloudProviderID={cloudProviderID}
              billingModel={billingModel}
              product={product}
              isBYOC={isByoc}
              isMultiAZ={isMultiAz}
            />
          </FormGroup>
        </GridItem>
        <UserWorkloadMonitoringSection parent="create" disableUVM={false} />
        <GridItem span={12}>
          <Title headingLevel="h3" className="clusterupdatespace">Cluster updates</Title>
        </GridItem>
        <UpgradeSettingsFields
          isAutomatic={isAutomaticUpgrade}
        />
        {(canEnableEtcdEncryption || (isGCP && isByoc)) && (
        <>
          <GridItem span={12}>
            <Title headingLevel="h3">Encryption</Title>
          </GridItem>
        </>
        )}
        {canEnableEtcdEncryption && (
        <FormGroup
          fieldId="etcd_encryption"
          id="etcdEncryption"
        >
          <Field
            component={ReduxCheckbox}
            name="etcd_encryption"
            label="Enable etcd encryption"
            extendedHelpText={(
              <>
                {constants.enableEtcdHint}
                {' '}
                <ExternalLink href="https://docs.openshift.com/container-platform/latest/security/encrypting-etcd.html">Learn more about etcd</ExternalLink>
              </>
              )}
          />
          <div className="ocm-c--reduxcheckbox-description">Provide an additional layer of data security to your cluster.</div>
        </FormGroup>
        )}
        {(isGCP && isByoc) && (

        <GCPClusterEncryption
          customerManagedEncryptionSelected={customerManagedEncryptionSelected}
          selectedRegion={selectedRegion}
        />

        )}
      </Grid>
    </Form>
  );
}

ClusterSettingsScreen.propTypes = {
  isByoc: PropTypes.bool,
  cloudProviderID: PropTypes.string,
  isMultiAz: PropTypes.bool,
  isAutomaticUpgrade: PropTypes.bool,
  canEnableEtcdEncryption: PropTypes.bool,
  customerManagedEncryptionSelected: PropTypes.bool,
  product: PropTypes.string,
  billingModel: PropTypes.string,
  selectedRegion: PropTypes.string,
  change: PropTypes.func,
};

export default ClusterSettingsScreen;
