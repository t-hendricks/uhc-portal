
import React from 'react';
import PropTypes from 'prop-types';

import { Title, TextContent } from '@patternfly/react-core';

import { billingModelConstants } from '../../CreateOSDFormConstants';
import Modal from '../../../../../common/Modal/Modal';

const contentByCloudProvider = (cloudProviderID) => {
  if (cloudProviderID === 'aws') {
    return (
      <>
        <TextContent>
        With this subscription option, the cluster will be provisioned in an AWS account
        owned by you or your company. This allows you to pay AWS directly for public cloud costs,
        leveraging your existing relationship.
        </TextContent>
        <Title headingLevel="h3" size="lg">Important</Title>
        <TextContent>
            In order for the cluster provisioning to succeed, you must ensure the following:
        </TextContent>
        <TextContent>
          <ul>
            <li>Your AWS account has no services deployed in it. </li>
            <li>
                  Your AWS account has the necessary limits to support the desired
                  cluster size.
              {' '}
              <a href={billingModelConstants.resourceRequirementsLink} rel="noreferrer noopener" target="_blank"> See resource requirements.</a>
              {' '}
            </li>
            <li>An IAM user called “osdCcsAdmin” exists with the AdministratorAccess policy.</li>
            <li>
                  An Organization Service Control Policy (SCP) is set up according to the
              {' '}
              <a href={billingModelConstants.scpDocumentationLink} rel="noreferrer noopener" target="_blank">
                {' '}
                documentation.
              </a>
            </li>
          </ul>
        </TextContent>
        <TextContent>
        It is also recommended that you have at least Business Support from AWS. Refer to the
          {' '}
          <a href={billingModelConstants.scpDocumentationLink} rel="noreferrer noopener" target="_blank">documentation</a>
          {' '}
            for more detail around the requirements for customer cloud
            subscription.
        </TextContent>
      </>
    );
  } return (
    <TextContent>
    GCP modal - content TBD
    </TextContent>
  );
};

function CustomerCloudSubscriptionModal({ closeModal, cloudProviderID }) {
  return (
    <Modal
      className="ccsModal"
      title="Customer cloud subscription"
      onClose={closeModal}
      primaryText="Close"
      onPrimaryClick={closeModal}
      showSecondery={false}
    >
      {contentByCloudProvider(cloudProviderID)}
    </Modal>
  );
}

CustomerCloudSubscriptionModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
};

export default CustomerCloudSubscriptionModal;
