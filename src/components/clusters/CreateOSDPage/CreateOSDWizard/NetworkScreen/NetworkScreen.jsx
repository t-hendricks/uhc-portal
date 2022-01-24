import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Form,
  Grid,
  GridItem,
  Title,
  Text, FormFieldGroup, FormGroup,
} from '@patternfly/react-core';
import { Field } from 'redux-form';
import { ReduxCheckbox } from '../../../../common/ReduxFormComponents';
import RadioButtons from '../../../../common/ReduxFormComponents/RadioButtons';
import { constants } from '../../CreateOSDForm/CreateOSDFormConstants';

function NetworkScreen(props) {
  const {
    change,
    privateClusterSelected,
    showClusterPrivacy,
    showVPCCheckbox,
    cloudProviderID,
    privateLinkSelected,
  } = props;

  const onClusterPrivacyChange = (_, value) => {
    if (value === 'external') {
      change('use_privatelink', false);
    }
  };

  const onPrivateLinkChange = (checked) => {
    if (checked) {
      change('install_to_vpc', true);
    }
  };

  return (
    <Form onSubmit={(event) => { event.preventDefault(); return false; }}>
      <Grid hasGutter>
        <GridItem>
          <Title headingLevel="h3">Networking configuration</Title>
        </GridItem>
        <GridItem>
          <Text>
            Configure network access for your cluster.
          </Text>
        </GridItem>

        {showClusterPrivacy && (
          <>
            <GridItem>
              <Title headingLevel="h4" size="xl" className="privacy-heading">Cluster privacy</Title>
            </GridItem>
            <GridItem>
              <Text>
                Install your cluster with  all public or all private API endpoint and
                application routes.
                You can customize these options after installation.
              </Text>
            </GridItem>
            <Field
              component={RadioButtons}
              name="cluster_privacy"
              ariaLabel="Cluster privacy"
              onChange={onClusterPrivacyChange}
              options={[
                {
                  value: 'external',
                  ariaLabel: 'Public',
                  label: (
                    <>
                      Public
                      <div className="radio-helptext">
                        Access Kubernetes API endpoint and application routes from the internet.
                      </div>
                    </>),
                },
                {
                  value: 'internal',
                  ariaLabel: 'Private',
                  label: (
                    <>
                      Private
                      <div className="radio-helptext">
                        Access Kubernetes API endpoint and application routes from
                        direct private connections only.
                      </div>
                    </>
                  ),
                },
              ]}
              disableDefaultValueHandling
            />

            {privateClusterSelected && (
              <GridItem>
                <Alert
                  className="bottom-alert"
                  variant="warning"
                  isInline
                  title="You will not be able to access your cluster until you edit network settings in your cloud provider."
                >
                  {cloudProviderID === 'aws' && (
                    <span>
                      Follow the
                      {' '}
                      <a rel="noreferrer noopener" target="_blank" href="https://docs.openshift.com/dedicated/osd_private_connections/aws-private-connections.html">
                        documentation
                      </a>
                      {' '}
                      for how to do that.
                    </span>
                  )}
                </Alert>
              </GridItem>
            )}
          </>
        )}

        {showVPCCheckbox && (
          <>
            <GridItem>
              <Title headingLevel="h4" size="xl" className="privacy-heading">
                Virtual Private Cloud (VPC)
              </Title>
              <Text>
                By default, a new VPC will be created for your cluster.
                Alternatively, you may opt to install to an existing VPC below.
              </Text>
            </GridItem>
            <GridItem>
              <FormGroup fieldId="install-to-vpc">
                <Field
                  component={ReduxCheckbox}
                  name="install_to_vpc"
                  label="Install into an existing VPC"
                  isDisabled={privateLinkSelected && privateClusterSelected}
                />
                {privateClusterSelected && cloudProviderID === 'aws' && (
                  <FormFieldGroup>
                    <FormGroup>
                      <Field
                        component={ReduxCheckbox}
                        name="use_privatelink"
                        label="Use a PrivateLink"
                        onChange={onPrivateLinkChange}
                        helpText={(
                          <>
                            {constants.privateLinkHint}
                          </>
                        )}
                      />
                    </FormGroup>
                  </FormFieldGroup>
                )}
              </FormGroup>
            </GridItem>
          </>
        )}
      </Grid>
    </Form>
  );
}

NetworkScreen.propTypes = {
  change: PropTypes.func.isRequired,
  privateClusterSelected: PropTypes.bool,
  cloudProviderID: PropTypes.string,
  showClusterPrivacy: PropTypes.bool,
  showVPCCheckbox: PropTypes.bool,
  privateLinkSelected: PropTypes.bool,
};

export default NetworkScreen;
