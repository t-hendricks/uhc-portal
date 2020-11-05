import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';
import {
  Card,
  CardFooter,
  Grid,
  GridItem,
  Form,
  CardBody,
  Button,
  PageSection,
  TextContent,
  Text,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle, Spinner } from '@redhat-cloud-services/frontend-components';
import ReduxVerticalFormGroup from '../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import ErrorModal from '../../common/ErrorModal';
import Breadcrumbs from '../common/Breadcrumbs';
import {
  checkClusterDisplayName,
  checkClusterUUID,
  checkDisconnectedConsoleURL,
} from '../../../common/validators';
import constants from './RegisterClusterHelper';

import EditSubscriptionFields from '../common/EditSubscriptionSettingsDialog/EditSubscriptionSettingsDialog';
import Unavailable from '../../common/Unavailable';

class RegisterCluster extends React.Component {
  state = {
    supportLevel: 'Eval',
  }

  componentDidMount() {
    const { getOrganizationAndQuota } = this.props;
    this.reset();
    getOrganizationAndQuota();
  }

  componentDidUpdate() {
    const { registerClusterResponse, openModal, isOpen } = this.props;
    if (registerClusterResponse.error && !isOpen) {
      openModal('register-cluster-error');
    }
  }

  componentWillUnmount() {
    this.reset();
  }

  onChangeUnitsNumericInput = (unitsFieldName, newValue) => {
    const { change } = this.props;
    change(unitsFieldName, newValue);
  }

  onChangeSupportLevel = (newValue) => {
    this.setState({ supportLevel: newValue });
  }

  reset() {
    const { resetResponse, resetForm } = this.props;
    resetResponse();
    resetForm();
  }

  render() {
    const {
      handleSubmit,
      registerClusterResponse,
      isOpen,
      resetResponse,
      canSubscribeOCP,
      quotaResponse,
    } = this.props;

    const { supportLevel } = this.state;

    if (registerClusterResponse.fulfilled) {
      return (
        <Redirect to={`/details/${registerClusterResponse.cluster.cluster_id}`} />
      );
    }

    const errorModal = isOpen && (
      <ErrorModal
        title="Error Registering Cluster"
        errorResponse={registerClusterResponse}
        resetResponse={resetResponse}
      />
    );

    const topText = 'Use this form to register clusters that are not connected to OpenShift Cluster Manager. To edit subscription settings for clusters that are already connected to OpenShift Cluster Manager, the cluster owner or organization administrator should choose the "Edit subscription settings" action for that cluster.';

    if (quotaResponse.error) {
      return (
        <PageSection>
          <Unavailable
            message="Error retrieving quota"
            response={quotaResponse}
          />
        </PageSection>
      );
    }

    return (
      <>
        <PageHeader>
          <Breadcrumbs path={[
            { label: 'Clusters' },
            { label: 'Register disconnected cluster' },
          ]}
          />
          <PageHeaderTitle title="Register disconnected cluster" />
        </PageHeader>
        <PageSection>
          {errorModal}
          <Card id="register-cluster">
            <CardBody>
              <Grid>
                <GridItem sm={12} md={8} lg={5}>
                  <TextContent id="register-cluster-top-text">
                    <Text component={TextVariants.p}>{topText}</Text>
                  </TextContent>
                  { quotaResponse.fulfilled
                    ? (
                      <Form onSubmit={handleSubmit} className="subscription-settings form">
                        <Field
                          component={ReduxVerticalFormGroup}
                          name="cluster_id"
                          label="Cluster ID"
                          type="text"
                          extendedHelpText={constants.clusterIDHint}
                          disabled={registerClusterResponse.pending}
                          validate={checkClusterUUID}
                          isRequired
                        />
                        <Field
                          component={ReduxVerticalFormGroup}
                          name="display_name"
                          label="Display name"
                          type="text"
                          disabled={registerClusterResponse.pending}
                          validate={checkClusterDisplayName}
                        />
                        <Field
                          component={ReduxVerticalFormGroup}
                          name="web_console_url"
                          label="Web console URL"
                          validate={checkDisconnectedConsoleURL}
                          disabled={registerClusterResponse.pending}
                          type="text"
                        />
                        <Title headingLevel="h4" size="xl">Subscription settings</Title>
                        <TextContent>
                          <Text component={TextVariants.p}>
                        Editing the subscription settings will help ensure that
                        you receive the level of support that you expect, and that
                        your cluster is consuming the correct type of subscription.
                          </Text>
                        </TextContent>
                        <EditSubscriptionFields
                          isDialog={false}
                          subscription={{ support_level: supportLevel }}
                          onChangeNumericInputCallback={this.onChangeUnitsNumericInput}
                          onChangeSupportLevelCallback={this.onChangeSupportLevel}
                          hideSubscriptionSettings={!canSubscribeOCP}
                        />
                      </Form>
                    )
                    : <Spinner />}
                </GridItem>
              </Grid>
            </CardBody>
            <CardFooter>
              <Button variant="primary" type="submit" onClick={handleSubmit} isDisabled={registerClusterResponse.pending}>Register cluster</Button>
              <Link to="/">
                <Button variant="secondary" isDisabled={registerClusterResponse.pending}>Cancel</Button>
              </Link>
            </CardFooter>
          </Card>
        </PageSection>
      </>
    );
  }
}

RegisterCluster.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  registerClusterResponse: PropTypes.object.isRequired,
  openModal: PropTypes.func,
  resetResponse: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  resetForm: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  canSubscribeOCP: PropTypes.bool.isRequired,
  quotaResponse: PropTypes.object.isRequired,
};

export default RegisterCluster;
