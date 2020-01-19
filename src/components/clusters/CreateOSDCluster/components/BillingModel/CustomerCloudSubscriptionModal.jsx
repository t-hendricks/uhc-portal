
import React from 'react';
import PropTypes from 'prop-types';

import { Title, TextContent } from '@patternfly/react-core';

import { billingModelConstants } from '../../CreateOSDClusterHelper';
import Modal from '../../../../common/Modal/Modal';

function CustomerCloudSubscriptionModal({ closeModal }) {
  return (
    <Modal
      className="ccsModal"
      title="Customer Cloud Subscription"
      onClose={closeModal}
      primaryText="Close"
      onPrimaryClick={closeModal}
      showSecondery={false}
    >
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
            <li>Your AWS account has an Enterprise Support Plan attached.</li>
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
            Refer to the
          {' '}
          <a href={billingModelConstants.scpDocumentationLink} rel="noreferrer noopener" target="_blank">documentation</a>
          {' '}
            for more detail around the requirements for Customer Cloud
            Subscription.
        </TextContent>
      </>
    </Modal>
  );
}

CustomerCloudSubscriptionModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default CustomerCloudSubscriptionModal;
