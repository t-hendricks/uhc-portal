import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Field } from 'redux-form';
import {
  Alert, Button,
  ExpandableSection, GridItem, Text, TextVariants, Title,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import './AccountsRolesScreen.scss';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { ReduxFormDropdown } from '../../../../common/ReduxFormComponents';
import ExternalLink from '../../../../common/ExternalLink';
import ErrorBox from '../../../../common/ErrorBox';
import InstructionCommand from '../../../../common/InstructionCommand';

function AccountRolesARNsSection({
  change,
  selectedAWSAccountID,
  getAWSAccountRolesARNs,
  getAWSAccountRolesARNsResponse,
  clearGetAWSAccountRolesARNsResponse,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [accountRoles, setAccountRoles] = useState([]);
  const [installerRoleOptions, setInstallerRoleOptions] = useState([]);
  const [selectedInstallerRole, setSelectedInstallerRole] = useState('');
  const [hasAccountRoles, setHasAccountRoles] = useState(false);
  const [awsARNsErrorBox, setAwsARNsErrorBox] = useState(null);

  const NO_ROLE_DETECTED = 'No role detected';

  useEffect(() => {
    clearGetAWSAccountRolesARNsResponse();
  }, [selectedAWSAccountID]);

  useEffect(() => {
    if (selectedInstallerRole === 'No role detected') {
      change('installer_role_arn', selectedInstallerRole);
      change('support_role_arn', selectedInstallerRole);
      change('control_plane_role_arn', selectedInstallerRole);
      change('worker_role_arn', selectedInstallerRole);
    } else {
      accountRoles.forEach((role) => {
        if (role.Installer === selectedInstallerRole) {
          change('installer_role_arn', role.Installer);
          change('support_role_arn', role.Support);
          change('control_plane_role_arn', role.ControlPlane);
          change('worker_role_arn', role.Worker);
        }
      });
    }
  }, [selectedInstallerRole]);

  useEffect(() => {
    setHasAccountRoles(accountRoles.length > 0);
    const installerOptions = [];
    accountRoles.forEach((role) => {
      installerOptions.push({
        name: role.Installer,
        value: role.Installer,
      });
    });
    if (accountRoles.length > 0) {
      setSelectedInstallerRole(accountRoles[0].Installer); // default to first installer role
    } else {
      installerOptions.push({
        name: NO_ROLE_DETECTED,
        value: NO_ROLE_DETECTED,
      });
      setSelectedInstallerRole(NO_ROLE_DETECTED);
    }
    setInstallerRoleOptions(installerOptions);
    setIsExpanded(accountRoles.length === 0 || installerOptions.length > 1);
  }, [accountRoles]);

  useEffect(() => {
    if (!getAWSAccountRolesARNsResponse.pending
      && !getAWSAccountRolesARNsResponse.fulfilled
      && !getAWSAccountRolesARNsResponse.error) {
      getAWSAccountRolesARNs(selectedAWSAccountID);
    } else if (getAWSAccountRolesARNsResponse.pending) {
      setAwsARNsErrorBox(null);
    } else if (getAWSAccountRolesARNsResponse.fulfilled) {
      const accountRolesARNs = get(getAWSAccountRolesARNsResponse, 'data', []);
      setAccountRoles(accountRolesARNs);
    } else if (getAWSAccountRolesARNsResponse.error) {
      // display error
      setAwsARNsErrorBox(<ErrorBox
        message="Error getting AWS account ARNs"
        response={getAWSAccountRolesARNsResponse}
      />);
    }
  }, [selectedAWSAccountID, getAWSAccountRolesARNsResponse]);

  const onToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handInstallerRoleChange = (_, value) => {
    setSelectedInstallerRole(value);
  };

  const installerRoleARNRequired = value => (value && value !== NO_ROLE_DETECTED ? undefined : 'Field is required');

  return (
    <>
      <GridItem />
      <GridItem>
        <Title headingLevel="h3">Account roles</Title>
      </GridItem>
      {awsARNsErrorBox && (
        <GridItem>
          { awsARNsErrorBox }
        </GridItem>
      )}
      {!getAWSAccountRolesARNsResponse.pending && !hasAccountRoles && !awsARNsErrorBox && (
      <GridItem>
        <Alert
          isInline
          variant="info"
          title="Account roles were not detected. Follow the steps below to populate the ARN fields."
        >
          <br />
          <strong>Step 1:</strong>
          {' '}
          Create the account roles using the following command in the ROSA CLI
          <InstructionCommand textAriaLabel="Copyable ROSA login command">
            rosa create account-roles
          </InstructionCommand>
          <br />
          <strong>Step 2:</strong>
          {' '}
          After running the command you may need to refresh using the button below to populate the
          {' '}
          ARN fields.
          <br />
          <Button variant="secondary" onClick={() => { getAWSAccountRolesARNs(selectedAWSAccountID); }}>Refresh to populate ARNs</Button>
        </Alert>
      </GridItem>
      )}
      {getAWSAccountRolesARNsResponse.pending && (
      <>
        <div className="spinner-fit-container"><Spinner /></div>
        <div className="spinner-loading-text">Loading account roles ARNs...</div>
      </>
      )}
      {!awsARNsErrorBox && !getAWSAccountRolesARNsResponse.pending && (
      <GridItem span={6}>
        <ExpandableSection isExpanded={isExpanded} onToggle={onToggle} toggleText="Account roles ARNs">
          <GridItem span={8}>
            <Text component={TextVariants.p}>
              The following roles were detected in your AWS account.
              {' '}
              <br />
              <ExternalLink href="">
                Learn more about account roles
              </ExternalLink>
              .
              <br />
              <br />
            </Text>
          </GridItem>
          <GridItem span={4} />
          <GridItem />
          <Field
            component={ReduxFormDropdown}
            name="installer_role_arn"
            label="Installer role"
            type="text"
            options={installerRoleOptions}
            onChange={handInstallerRoleChange}
            isDisabled={!hasAccountRoles || accountRoles.length === 1}
            validate={installerRoleARNRequired}
            isRequired
            extendedHelpText="Something..."
          />
          <br />
          <Field
            component={ReduxVerticalFormGroup}
            name="support_role_arn"
            label="Support Role"
            type="text"
            isRequired
            extendedHelpText="Something..."
            isDisabled
          />
          <br />
          <Field
            component={ReduxVerticalFormGroup}
            name="worker_role_arn"
            label="Worker role"
            type="text"
            isRequired
            extendedHelpText="Something..."
            isDisabled
          />
          <br />
          <Field
            component={ReduxVerticalFormGroup}
            name="control_plane_role_arn"
            label="Control plane role"
            type="text"
            isRequired
            extendedHelpText="Something..."
            isDisabled
          />
        </ExpandableSection>
      </GridItem>
      )}
    </>
  );
}

AccountRolesARNsSection.propTypes = {
  change: PropTypes.func,
  selectedAWSAccountID: PropTypes.string,
  getAWSAccountRolesARNs: PropTypes.func.isRequired,
  getAWSAccountRolesARNsResponse: PropTypes.object.isRequired,
  clearGetAWSAccountRolesARNsResponse: PropTypes.func.isRequired,
};

export default AccountRolesARNsSection;
