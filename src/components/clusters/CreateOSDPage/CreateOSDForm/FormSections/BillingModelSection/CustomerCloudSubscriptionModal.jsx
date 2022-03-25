import React from 'react';
import PropTypes from 'prop-types';

import {
  List,
  ListItem,
  Title,
  TextContent,
} from '@patternfly/react-core';

import links from '../../../../../../common/installLinks';
import ExternalLink from '../../../../../common/ExternalLink';
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
        <Title headingLevel="h3" size="lg" className="pf-u-mt-sm">Important</Title>
        <TextContent>
          In order for the cluster provisioning to succeed, you must ensure the following:
        </TextContent>
        <TextContent>
          <List>
            <ListItem>
              Your AWS account has the necessary limits to support the desired
              cluster size.
              {' '}
              <ExternalLink noIcon href={links.OSD_CCS_AWS_LIMITS}>
                See resource requirements.
              </ExternalLink>
              {' '}
            </ListItem>
            <ListItem>
              An IAM user called “osdCcsAdmin” exists with the AdministratorAccess policy.
            </ListItem>
            <ListItem>
              An Organization Service Control Policy (SCP) is set up according to the
              {' '}
              <ExternalLink noIcon href={links.OSD_CCS_AWS_SCP}>documentation</ExternalLink>
              .
            </ListItem>
          </List>
        </TextContent>
        <TextContent>
          It is also recommended that you have at least Business Support from AWS. Refer to the
          {' '}
          <ExternalLink noIcon href={links.OSD_CCS_AWS}>documentation</ExternalLink>
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
      <Title headingLevel="h3" size="lg" className="pf-u-mt-sm">Important</Title>
      <TextContent>
        In order for the cluster provisioning to succeed, you must ensure the following:
      </TextContent>
      <TextContent>
        <List>
          <ListItem>
            Your Google Cloud account has the necessary resource quotas and limits to support
            the desired cluster size.
            {' '}
            <ExternalLink href={links.OSD_CCS_GCP_LIMITS}>See resource requirements.</ExternalLink>
            {' '}
          </ListItem>
          <ListItem>
            An IAM service account called “osd-ccs-admin” exists with the following roles attached:
            <List className="pf-u-pb-xs">
              <ListItem>DNS Administrator</ListItem>
              <ListItem>Organization Policy Viewer</ListItem>
              <ListItem>Owner</ListItem>
              <ListItem>Project IAM Admin</ListItem>
              <ListItem>Service Management Administrator</ListItem>
              <ListItem>Service Usage Admin</ListItem>
              <ListItem>Storage Admin</ListItem>
            </List>
          </ListItem>
        </List>
      </TextContent>
      <TextContent>
        It is also recommended that you have at least Production support from GCP.
        To prevent potential conflicts, we also recommend that you have no other resources
        provisioned in the project prior to provisioning OpenShift Dedicated.
        Refer to
        {' '}
        <ExternalLink noIcon href={links.OSD_CCS_GCP}>the documentation</ExternalLink>
        {' '}
        for more detail around the requirements for
        customer cloud subscription.
      </TextContent>
    </>
  );
};

function CustomerCloudSubscriptionModal({ closeModal, cloudProviderID }) {
  return (
    <Modal
      title="Customer cloud subscription"
      onClose={closeModal}
      primaryText="Close"
      onPrimaryClick={closeModal}
      showSecondary={false}
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
