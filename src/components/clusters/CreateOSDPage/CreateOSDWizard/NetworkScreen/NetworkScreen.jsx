import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Form,
  Grid,
  GridItem,
  Title,
  Text,
} from '@patternfly/react-core';
import { Field } from 'redux-form';
import { ReduxCheckbox } from '../../../../common/ReduxFormComponents';
import RadioButtons from '../../../../common/ReduxFormComponents/RadioButtons';

function NetworkScreen(props) {
  const {
    privateClusterSelected,
    showClusterPrivacy,
    showVPCCheckbox,
    cloudProviderID,
  } = props;

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
              defaultValue="external"
            />
            {/* TODO PrivateLink */}

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
                      <a rel="noreferrer noopener" target="_blank" href="https://docs.openshift.com/dedicated/4/cloud_infrastructure_access/dedicated-understanding-aws.html">
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
              <Field
                component={ReduxCheckbox}
                name="install_to_vpc"
                label="Install into an existing VPC"
              />
            </GridItem>
          </>
        )}
      </Grid>
    </Form>
  );
}

NetworkScreen.propTypes = {
  privateClusterSelected: PropTypes.bool,
  cloudProviderID: PropTypes.string,
  showClusterPrivacy: PropTypes.bool,
  showVPCCheckbox: PropTypes.bool,
};

export default NetworkScreen;
