import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Title, Grid, GridItem, FormGroup, Form, ExpandableSection } from '@patternfly/react-core';
import { Field } from 'redux-form';

import ReduxCheckbox from '~/components/common/ReduxFormComponents/ReduxCheckbox';
import { CheckboxDescription } from '~/components/common/CheckboxDescription';
import { validateAWSKMSKeyARN } from '~/common/validators';
import { isRestrictedEnv } from '~/restrictedEnv';
import { constants } from '~/components/clusters/common/CreateOSDFormConstants';
import { normalizedProducts } from '~/common/subscriptionTypes';
import PopoverHint from '../../../../common/PopoverHint';
import PersistentStorageDropdown from '../../../common/PersistentStorageDropdown';
import LoadBalancersDropdown from '../../../common/LoadBalancersDropdown';

import CustomerManagedEncryptionSection from '../../common/EncryptionSection/CustomerManagedKeyEncryption';
import UserWorkloadMonitoringSection from '../../../common/UserWorkloadMonitoringSection';
import EtcdEncryptionSection from '../../common/EncryptionSection/EtcdEncryptionSection';

import BasicFieldsSection from './BasicFieldsSection';

function ClusterSettingsScreen({
  isByoc,
  isMultiAz,
  customerManagedEncryptionSelected,
  selectedRegion,
  cloudProviderID,
  product,
  billingModel,
  change,
  kmsKeyArn,
  etcdKeyArn,
  isEtcdEncryptionSelected,
  isFipsCryptoSelected,
  isHypershiftSelected,
  touch,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const onToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const isRosa = product === normalizedProducts.ROSA;

  React.useEffect(() => {
    let isAdvancedEncryptionExpanded = false;
    if (
      customerManagedEncryptionSelected === 'true' &&
      validateAWSKMSKeyARN(kmsKeyArn, selectedRegion)
    ) {
      isAdvancedEncryptionExpanded = true;
      touch('CreateCluster', 'kms_key_arn');
    }

    if (
      isEtcdEncryptionSelected &&
      isHypershiftSelected &&
      validateAWSKMSKeyARN(etcdKeyArn, selectedRegion)
    ) {
      isAdvancedEncryptionExpanded = true;
      touch('CreateCluster', 'etcd_key_arn');
    }

    if (isAdvancedEncryptionExpanded) {
      setIsExpanded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerManagedEncryptionSelected, kmsKeyArn, selectedRegion]);

  React.useEffect(() => {
    if (!isEtcdEncryptionSelected && !!etcdKeyArn) {
      change('etcd_key_arn', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEtcdEncryptionSelected, change]);

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        return false;
      }}
    >
      <Grid hasGutter>
        <GridItem>
          <Title headingLevel="h3">Cluster details</Title>
        </GridItem>
        <BasicFieldsSection
          /* TODO move some props to index.js */
          cloudProviderID={cloudProviderID}
          isBYOC={isByoc}
          isMultiAz={isMultiAz}
          showAvailability
          change={change}
          product={product}
          billingModel={billingModel}
          isWizard
          isHypershiftSelected={isHypershiftSelected}
        />
        {!isByoc && !isRosa && (
          <>
            <GridItem md={6}>
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
            <GridItem md={6} />
            <GridItem md={6}>
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
          </>
        )}

        {!isHypershiftSelected && (
          <UserWorkloadMonitoringSection parent="create" disableUVM={false} planType={product} />
        )}

        <ExpandableSection
          toggleText="Advanced Encryption"
          onToggle={onToggle}
          isExpanded={isExpanded}
        >
          {isByoc && (
            <CustomerManagedEncryptionSection
              customerManagedEncryptionSelected={customerManagedEncryptionSelected}
              selectedRegion={selectedRegion}
              cloudProviderID={cloudProviderID}
              kmsKeyArn={kmsKeyArn}
            />
          )}

          <EtcdEncryptionSection
            isRosa={isRosa}
            isHypershiftSelected={isHypershiftSelected}
            isEtcdEncryptionSelected={isEtcdEncryptionSelected}
            isFipsCryptoSelected={isFipsCryptoSelected}
            etcdKeyArn={etcdKeyArn}
            selectedRegion={selectedRegion}
          />

          {!isHypershiftSelected && isEtcdEncryptionSelected && (
            <GridItem md={6} className="pf-v5-u-mt-lg">
              <FormGroup fieldId="fips" id="fipsCrypto" label="FIPS cryptography">
                <Field
                  component={ReduxCheckbox}
                  name="fips"
                  label="Enable FIPS cryptography"
                  extendedHelpText="Installs and configures your cluster to use only FIPS validated cryptographic libraries for core components and the node operating system."
                  isDisabled={isRestrictedEnv()}
                />
                <CheckboxDescription>
                  Install a cluster that uses FIPS Validated / Modules in Process cryptographic
                  libraries on the x86_64 architecture.
                </CheckboxDescription>
              </FormGroup>
            </GridItem>
          )}
        </ExpandableSection>
        <GridItem md={6} />
      </Grid>
    </Form>
  );
}

ClusterSettingsScreen.propTypes = {
  isByoc: PropTypes.bool,
  cloudProviderID: PropTypes.string,
  isMultiAz: PropTypes.bool,
  customerManagedEncryptionSelected: PropTypes.string,
  product: PropTypes.string,
  billingModel: PropTypes.string,
  selectedRegion: PropTypes.string,
  change: PropTypes.func,
  kmsKeyArn: PropTypes.string,
  etcdKeyArn: PropTypes.string,
  isEtcdEncryptionSelected: PropTypes.bool,
  isFipsCryptoSelected: PropTypes.bool,
  isHypershiftSelected: PropTypes.bool,
  touch: PropTypes.func,
};

export default ClusterSettingsScreen;
