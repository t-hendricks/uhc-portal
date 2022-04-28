import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Field } from 'redux-form';
import {
  Alert, Button,
  ExpandableSection, Grid, GridItem, Text, TextVariants, Title,
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
  touchARNsFields,
  selectedAWSAccountID,
  getAWSAccountRolesARNs,
  getAWSAccountRolesARNsResponse,
  clearGetAWSAccountRolesARNsResponse,
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [accountRoles, setAccountRoles] = useState([]);
  const [installerRoleOptions, setInstallerRoleOptions] = useState([]);
  const [selectedInstallerRole, setSelectedInstallerRole] = useState('');
  const [allARNsFound, setAllARNsFound] = useState(false);
  const [awsARNsErrorBox, setAwsARNsErrorBox] = useState(null);

  const NO_ROLE_DETECTED = 'No role detected';

  useEffect(() => {
    // this is required to show any validation error messages for the 4 disabled ARNs fields
    touchARNsFields();
  }, [touchARNsFields]);

  useEffect(() => {
    clearGetAWSAccountRolesARNsResponse();
  }, [selectedAWSAccountID]);

  useEffect(() => {
    accountRoles.forEach((role) => {
      if (role.Installer === selectedInstallerRole) {
        setAllARNsFound(role.Installer && role.Support && role.ControlPlane && role.Worker);
        change('installer_role_arn', role.Installer || NO_ROLE_DETECTED);
        change('support_role_arn', role.Support || NO_ROLE_DETECTED);
        change('control_plane_role_arn', role.ControlPlane || NO_ROLE_DETECTED);
        change('worker_role_arn', role.Worker || NO_ROLE_DETECTED);
      }
    });
  }, [selectedInstallerRole]);

  // update installer role dropdown everytime accountRoles change
  useEffect(() => {
    const installerOptions = [];
    if (accountRoles.length === 0) {
      installerOptions.push({
        name: NO_ROLE_DETECTED,
        value: NO_ROLE_DETECTED,
      });
      change('installer_role_arn', NO_ROLE_DETECTED);
      change('support_role_arn', NO_ROLE_DETECTED);
      change('control_plane_role_arn', NO_ROLE_DETECTED);
      change('worker_role_arn', NO_ROLE_DETECTED);
      setSelectedInstallerRole(NO_ROLE_DETECTED);
      setAllARNsFound(false);
    } else {
      accountRoles.forEach((role) => {
        installerOptions.push({
          name: role.Installer,
          value: role.Installer,
        });
      });
      setSelectedInstallerRole(accountRoles[0].Installer); // default to first installer role
    }
    setInstallerRoleOptions(installerOptions);
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

  const roleARNRequired = value => (value && value !== NO_ROLE_DETECTED ? undefined : 'ARN field is required.');

  const refreshARNs = () => {
    clearGetAWSAccountRolesARNsResponse();
    setSelectedInstallerRole('');
    getAWSAccountRolesARNs(selectedAWSAccountID);
  };

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
      {!getAWSAccountRolesARNsResponse.pending && !allARNsFound && !awsARNsErrorBox && (
      <GridItem>
        <Alert
          isInline
          variant="info"
          title="All account roles ARNs were not detected. Follow the steps below to populate the ARN fields."
        >
          <br />
          Create the account roles using the following command in the ROSA CLI
          <InstructionCommand textAriaLabel="Copyable ROSA login command">
            rosa create account-roles
          </InstructionCommand>
          <br />
          After running the command, you may need to refresh using the
          {' '}
          <strong>Refresh ARNs</strong>
          {' '}
          button below to populate the ARN fields.
        </Alert>
      </GridItem>
      )}
      {getAWSAccountRolesARNsResponse.pending && (
      <GridItem>
        <div className="spinner-fit-container"><Spinner /></div>
        <div className="spinner-loading-text">Loading account roles ARNs...</div>
      </GridItem>
      )}
      {!getAWSAccountRolesARNsResponse.pending && (
      <GridItem span={12}>
        <ExpandableSection
          isExpanded={!awsARNsErrorBox && isExpanded}
          onToggle={onToggle}
          toggleText="Account roles ARNs"
        >
          <Text component={TextVariants.p}>
            The following roles were detected in your AWS account.
            {' '}
            <ExternalLink href="">
              Learn more about account roles
            </ExternalLink>
            .
          </Text>
          <br />
          <Button variant="secondary" onClick={refreshARNs}>Refresh ARNs</Button>
          <br />
          <br />
          <Grid>
            <GridItem span={8}>
              <Field
                component={ReduxFormDropdown}
                name="installer_role_arn"
                label="Installer role"
                type="text"
                options={installerRoleOptions}
                onChange={handInstallerRoleChange}
                isDisabled={installerRoleOptions.length <= 1}
                validate={roleARNRequired}
                isRequired
                helpText=""
                extendedHelpText="Something..."
              />
              <br />
              <Field
                component={ReduxVerticalFormGroup}
                name="support_role_arn"
                label="Support Role"
                type="text"
                validate={roleARNRequired}
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
                validate={roleARNRequired}
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
                validate={roleARNRequired}
                isRequired
                extendedHelpText="Something..."
                isDisabled
              />
            </GridItem>
          </Grid>
          <GridItem span={4} />
        </ExpandableSection>
      </GridItem>
      )}
    </>
  );
}

AccountRolesARNsSection.propTypes = {
  change: PropTypes.func,
  touchARNsFields: PropTypes.func,
  selectedAWSAccountID: PropTypes.string,
  getAWSAccountRolesARNs: PropTypes.func.isRequired,
  getAWSAccountRolesARNsResponse: PropTypes.object.isRequired,
  clearGetAWSAccountRolesARNsResponse: PropTypes.func.isRequired,
};

export default AccountRolesARNsSection;
