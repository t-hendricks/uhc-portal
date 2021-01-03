
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
    <>
      <TextContent>
      With this subscription option, the cluster will be provisioned in a Google Cloud account
      owned by you or your company. This allows you to pay Google Cloud directly for public
      cloud costs, leveraging your existing relationship.
      </TextContent>
      <Title headingLevel="h3" size="lg">Important</Title>
      <TextContent>
            In order for the cluster provisioning to succeed, you must ensure the following:
      </TextContent>
      <TextContent>
        <ul>
          <li>
            Your Google Cloud account has the necessary resource quotas and limits to support
            the desired cluster size. See resource requirements.
          </li>
          <li>
            A service account called “osd-ccs-admin” exists with the following roles attached:
            <ul className="unpadded-ul">
              <li>DNS Administrator</li>
              <li>Organization Policy Viewer</li>
              <li>Owner</li>
              <li>Project IAM Admin</li>
              <li>Service Management Administrator</li>
              <li>Service Usage Admin</li>
              <li>Storage Admin</li>
            </ul>
          </li>
        </ul>
      </TextContent>
      <TextContent>
      It is also recommended that you have at least Production support from GCP.
      To prevent potential conflicts, we also recommend that you have no other resources
      provisioned in the project prior to provisioning OpenShift Dedicated.
      Refer to the documentation for more detail around the requirements for
      customer cloud subscription.
      </TextContent>
    </>
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
