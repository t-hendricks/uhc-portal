import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Title, Grid, GridItem, FormGroup, Form, ExpandableSection } from '@patternfly/react-core';
import { Field } from 'redux-form';

import PopoverHint from '../../../../common/PopoverHint';
import ReduxCheckbox from '../../../../common/ReduxFormComponents/ReduxCheckbox';
import ExternalLink from '../../../../common/ExternalLink';
import PersistentStorageDropdown from '../../../common/PersistentStorageDropdown';
import LoadBalancersDropdown from '../../../common/LoadBalancersDropdown';

import CustomerManagedEncryptionSection from '../../CreateOSDForm/FormSections/EncryptionSection/CustomerManagedKeyEncryption';
import UserWorkloadMonitoringSection from '../../../common/UserWorkloadMonitoringSection';

import { constants } from '../../CreateOSDForm/CreateOSDFormConstants';

import BasicFieldsSection from '../../CreateOSDForm/FormSections/BasicFieldsSection';
import links from '../../../../../common/installLinks.mjs';
import { normalizedProducts } from '../../../../../common/subscriptionTypes';
import { validateAWSKMSKeyARN } from '~/common/validators';

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
  isHypershiftSelected,
  formErrors,
  touch,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const onToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const isRosa = product === normalizedProducts.ROSA;
  const isGCP = cloudProviderID === 'gcp';

  const {
    key_ring: keyRingError,
    key_name: keyNameError,
    kms_service_account: kmsServiceAccountError,
    key_location: keyLocationError,
  } = formErrors;

  const gcpError = keyRingError || keyNameError || kmsServiceAccountError || keyLocationError;

  React.useEffect(() => {
    let isAdvancedEncryptionExpanded = false;
    if (customerManagedEncryptionSelected === 'true') {
      if (isGCP && gcpError) {
        isAdvancedEncryptionExpanded = true;
      }
      if (!isGCP && validateAWSKMSKeyARN(kmsKeyArn, selectedRegion)) {
        isAdvancedEncryptionExpanded = true;
        touch('CreateCluster', 'kms_key_arn');
      }
    }
    if (isAdvancedEncryptionExpanded) {
      setIsExpanded(true);
    }
  }, [customerManagedEncryptionSelected, isGCP, gcpError, kmsKeyArn, selectedRegion]);

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
          <GridItem md={6}>
            <FormGroup fieldId="etcd_encryption" id="etcdEncryption" label="etcd encryption">
              <Field
                component={ReduxCheckbox}
                name="etcd_encryption"
                label="Enable additional etcd encryption"
                extendedHelpText={
                  <>
                    {constants.enableAdditionalEtcdHint}{' '}
                    <ExternalLink
                      href={isRosa ? links.ROSA_SERVICE_ETCD_ENCRYPTION : links.OSD_ETCD_ENCRYPTION}
                    >
                      Learn more about etcd encryption
                    </ExternalLink>
                  </>
                }
              />

              <div className="ocm-c--reduxcheckbox-description">
                Add more encryption for OpenShift and Kubernetes API resources.
              </div>
            </FormGroup>
          </GridItem>
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
  isHypershiftSelected: PropTypes.bool,
  formErrors: PropTypes.object,
  touch: PropTypes.func,
};

export default ClusterSettingsScreen;
