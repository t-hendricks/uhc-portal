import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, GridItem } from '@patternfly/react-core';
import { Field } from 'redux-form';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import ReduxCheckbox from '../../../../../common/ReduxFormComponents/ReduxCheckbox';
import { constants } from '../../CreateOSDFormConstants';
import AWSCustomerManagedEncryption from './AWSCustomerManagedEncryption';

import './encryptionSection.scss';

function EtcdEncryptionSection({
  isRosa,
  isHypershiftSelected,
  isEtcdEncryptionSelected,
  selectedRegion,
  etcdKeyArn,
}) {
  const needsCustomEtcdKey = isEtcdEncryptionSelected && isHypershiftSelected;
  return (
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
        {needsCustomEtcdKey && (
          <GridItem>
            <AWSCustomerManagedEncryption
              fieldName="etcd_key_arn"
              region={selectedRegion}
              keyArn={etcdKeyArn}
            />
          </GridItem>
        )}
      </FormGroup>
    </GridItem>
  );
}

EtcdEncryptionSection.propTypes = {
  isRosa: PropTypes.bool.isRequired,
  isHypershiftSelected: PropTypes.bool.isRequired,
  isEtcdEncryptionSelected: PropTypes.bool.isRequired,
  selectedRegion: PropTypes.string,
  etcdKeyArn: PropTypes.string,
};

export default EtcdEncryptionSection;
