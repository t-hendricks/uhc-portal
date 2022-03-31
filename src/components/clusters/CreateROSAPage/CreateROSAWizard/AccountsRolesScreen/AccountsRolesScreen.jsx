import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import {
  Form, Grid, GridItem, Text, TextVariants, Title,
} from '@patternfly/react-core';
import { Field } from 'redux-form';

import AWSLogo from '../../../../../styles/images/AWS.png';
import RedHat from '../../../../../styles/images/Logo-RedHat-Hat-Color-RGB.png';
import Prerequisites from './Prerequisites';
import AWSAccountSelection from './AWSAccountSelection';
import ExternalLink from '../../../../common/ExternalLink';
import AssociateAWSAccountModal from './AssociateAWSAccountModal';
import AccountRolesARNsSection from './AccountRolesARNsSection';
import ErrorBox from '../../../../common/ErrorBox';
import links from '../../../../../common/installLinks';
import { required } from '../../../../../common/validators';
import { normalizedProducts } from '../../../../../common/subscriptionTypes';

function AccountsRolesScreen({
  change,
  touchARNsFields,
  organizationID,
  selectedAWSAccountID,
  openAssociateAWSAccountModal,
  getAWSAccountIDs,
  getAWSAccountIDsResponse,
  getAWSAccountRolesARNs,
  getAWSAccountRolesARNsResponse,
  clearGetAWSAccountRolesARNsResponse,
  clearGetAWSAccountIDsResponse,
}) {
  const longName = 'Red Hat OpenShift Service on AWS (ROSA)';
  const title = `Welcome to ${longName} `;

  const [AWSAccountIDs, setAWSAccountIDs] = useState([]);
  const [awsIDsErrorBox, setAwsIDsErrorBox] = useState(null);

  const hasAWSAccount = AWSAccountIDs.length > 0;

  // default product and cloud_provider form values
  useEffect(() => {
    change('cloud_provider', 'aws');
    change('product', normalizedProducts.ROSA);
    change('byoc', 'true');
  }, []);

  // default to first available aws account
  useEffect(() => {
    if (!selectedAWSAccountID && hasAWSAccount) {
      change('associated_aws_id', AWSAccountIDs[0]);
    }
  }, [hasAWSAccount, selectedAWSAccountID]);

  useEffect(() => {
    if (getAWSAccountIDsResponse.pending) {
      setAwsIDsErrorBox(null);
    } else if (getAWSAccountIDsResponse.fulfilled) {
      const awsIDs = get(getAWSAccountIDsResponse, 'data', []);
      setAWSAccountIDs(awsIDs);
      setAwsIDsErrorBox(null);
    } else if (getAWSAccountIDsResponse.error) {
      // display error
      setAwsIDsErrorBox(<ErrorBox
        message="Error getting associated AWS account id(s)"
        response={getAWSAccountIDsResponse}
      />);
    } else {
      getAWSAccountIDs(organizationID); // <--- moved from above
    }
  }, [getAWSAccountIDsResponse]);

  const onModalClose = () => {
    clearGetAWSAccountIDsResponse();
    getAWSAccountIDs(organizationID);
  };

  return (
    <Form onSubmit={() => false}>
      <Grid hasGutter className="pf-u-mt-md">
        <GridItem span={9}>
          <Title headingLevel="h2">{title}</Title>
          <Text component={TextVariants.p}>
            {longName}
            {' '}
            {/* eslint-disable-next-line max-len */}
            provides a model that allows Red Hat to deploy clusters into a customer&apos;s existing Amazon Web Service (AWS) account.
          </Text>
          <GridItem span={4}>
            <img src={RedHat} className="ocm-c-wizard-intro-image-top" aria-hidden="true" alt="" />
            <img src={AWSLogo} className="ocm-c-wizard-intro-image-bottom" aria-hidden="true" alt="" />
          </GridItem>
        </GridItem>
        <GridItem>
          <Prerequisites initiallyExpanded={!hasAWSAccount} />
        </GridItem>
        <GridItem span={8}>
          <Title headingLevel="h3">AWS account</Title>
          <Text component={TextVariants.p}>
            Use an AWS account that is linked to your Red Hat account.
          </Text>
          {!hasAWSAccount && (
            <>
              <br />
              <Text component={TextVariants.p}>
                To create a ROSA cluster, an AWS account must be configured. Create an AWS account
                and validate all prerequisites are met before continuing.
                {' '}
                <ExternalLink href="">
                  Learn more about account association
                </ExternalLink>
                .
              </Text>
            </>
          )}
        </GridItem>
        <GridItem span={4} />
        <GridItem span={5}>
          { awsIDsErrorBox }
          <Field
            component={AWSAccountSelection}
            name="associated_aws_id"
            label="Associated AWS account"
            openAssociateAWSAccountModal={openAssociateAWSAccountModal}
            validate={required}
            extendedHelpText={(
              <>
                The associated AWS account id will be used for ...
                {' '}
                <ExternalLink href={links.ENCRYPTING_ETCD}>Learn more about etcd</ExternalLink>
              </>
              )}
            AWSAccountIDs={AWSAccountIDs}
            selectedAWSAccountID={selectedAWSAccountID}
            disabled={getAWSAccountIDsResponse.pending}
          />
        </GridItem>
        <GridItem span={7} />
        {selectedAWSAccountID
        && (
        <AccountRolesARNsSection
          selectedAWSAccountID={selectedAWSAccountID}
          getAWSAccountRolesARNs={getAWSAccountRolesARNs}
          getAWSAccountRolesARNsResponse={getAWSAccountRolesARNsResponse}
          clearGetAWSAccountRolesARNsResponse={clearGetAWSAccountRolesARNsResponse}
          change={change}
          touchARNsFields={touchARNsFields}
        />
        )}
      </Grid>
      <AssociateAWSAccountModal onClose={onModalClose} />
    </Form>
  );
}

AccountsRolesScreen.propTypes = {
  change: PropTypes.func,
  touchARNsFields: PropTypes.func,
  selectedAWSAccountID: PropTypes.string,
  getAWSAccountIDs: PropTypes.func.isRequired,
  getAWSAccountIDsResponse: PropTypes.object.isRequired,
  openAssociateAWSAccountModal: PropTypes.func.isRequired,
  getAWSAccountRolesARNs: PropTypes.func.isRequired,
  getAWSAccountRolesARNsResponse: PropTypes.object.isRequired,
  clearGetAWSAccountIDsResponse: PropTypes.func.isRequired,
  clearGetAWSAccountRolesARNsResponse: PropTypes.func.isRequired,
  organizationID: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    associated_aws_id: PropTypes.string,
    installer_role_arn: PropTypes.string,
  }).isRequired,
};

export default AccountsRolesScreen;
