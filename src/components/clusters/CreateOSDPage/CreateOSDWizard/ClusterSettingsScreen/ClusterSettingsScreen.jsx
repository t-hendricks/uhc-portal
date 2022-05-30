import React from 'react';
import PropTypes from 'prop-types';
import {
  Title,
  Grid,
  GridItem,
  FormGroup,
  Form,
  Alert,
} from '@patternfly/react-core';
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

function ClusterSettingsScreen({
  isByoc,
  isMultiAz,
  customerManagedEncryptionSelected,
  selectedRegion,
  cloudProviderID,
  product,
  billingModel,
  change,
}) {
  const isRosa = product === normalizedProducts.ROSA;
  const cloudProviderLearnLink = cloudProviderID === 'aws'
    ? 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/data-protection.html'
    : 'https://cloud.google.com/storage/docs/encryption/default-keys';

  return (
    <Form onSubmit={(event) => { event.preventDefault(); return false; }}>
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
        />
        { !isByoc && !isRosa && (
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
        <UserWorkloadMonitoringSection parent="create" disableUVM={false} />
        <GridItem>
          <Title headingLevel="h3">Encryption</Title>
        </GridItem>
        <FormGroup
          fieldId="etcd_encryption"
          id="etcdEncryption"
        >
          <Grid hasGutter>
            <GridItem>
              <Alert
                isInline
                variant="info"
                title="The cloud storage for your cluster is encrypted at rest."
              >
                <ExternalLink href={cloudProviderLearnLink}>Learn more</ExternalLink>
              </Alert>
            </GridItem>
            <GridItem>
              <Field
                component={ReduxCheckbox}
                name="etcd_encryption"
                label="Enable additional etcd encryption"
                extendedHelpText={(
                  <>
                    {constants.enableAdditionalEtcdHint}
                    {' '}
                    <ExternalLink href={links.OSD_ETCD_ENCRYPTION}>
                      Learn more about etcd encryption
                    </ExternalLink>
                  </>
                )}
              />
              <div className="ocm-c--reduxcheckbox-description">Additional encryption of OpenShift and Kubernetes API resources.</div>
            </GridItem>
          </Grid>
        </FormGroup>
        {isByoc && (
          <CustomerManagedEncryptionSection
            customerManagedEncryptionSelected={customerManagedEncryptionSelected}
            selectedRegion={selectedRegion}
            cloudProviderID={cloudProviderID}
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
  customerManagedEncryptionSelected: PropTypes.bool,
  product: PropTypes.string,
  billingModel: PropTypes.string,
  selectedRegion: PropTypes.string,
  change: PropTypes.func,
};

export default ClusterSettingsScreen;
