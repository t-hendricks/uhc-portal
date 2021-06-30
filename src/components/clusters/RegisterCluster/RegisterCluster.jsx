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
  Tooltip,
  TooltipPosition,
} from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import ReduxVerticalFormGroup from '../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import ErrorModal from '../../common/ErrorModal';
import Breadcrumbs from '../../common/Breadcrumbs';
import {
  checkClusterDisplayName,
  checkClusterUUID,
  checkDisconnectedConsoleURL,
} from '../../../common/validators';
import constants from './RegisterClusterHelper';

import EditSubscriptionFields from '../common/EditSubscriptionSettingsDialog/EditSubscriptionSettingsFields';
import Unavailable from '../../common/Unavailable';
import {
  knownProducts,
  subscriptionStatuses,
  subscriptionSupportLevels,
} from '../../../common/subscriptionTypes';
import validateSubscriptionSettings from './validateSubscriptionSettings';

const {
  EVAL,
} = subscriptionSupportLevels;

class RegisterCluster extends React.Component {
  state = { settings: { } }

  initialSettings = { support_level: EVAL, isValid: true }

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

  handleSettingsChange = (newSettings) => {
    this.setState({ settings: newSettings });
  }

  handleSubmit = (values) => {
    const { onSubmit } = this.props;
    const { settings } = this.state;
    const {
      request,
      isValid,
    } = validateSubscriptionSettings(settings);
    if (isValid) {
      const registrationRequest = {
        cluster_uuid: values.cluster_id,
        plan_id: knownProducts.OCP,
        status: subscriptionStatuses.DISCONNECTED,
        display_name: values.display_name,
        console_url: values.web_console_url,
      };
      onSubmit(registrationRequest, request);
    }
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

    if (registerClusterResponse.fulfilled) {
      return (
        // TODO 'cluster' here is actually subscription, should be renamed
        <Redirect to={`/details/s/${registerClusterResponse.cluster.id}`} />
      );
    }

    const errorModal = isOpen && (
      <ErrorModal
        title="Error Registering Cluster"
        errorResponse={registerClusterResponse}
        resetResponse={resetResponse}
      />
    );

    const topText = 'Register clusters that are not connected to OpenShift Cluster Manager. Existing cluster owners or admins can edit existing cluster subscriptions from the cluster details page.';

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

    const { settings } = this.state;
    const { isValid } = validateSubscriptionSettings(settings);
    const editSubscriptionSettings = (
      <EditSubscriptionFields
        initialSettings={this.initialSettings}
        onSettingsChange={this.handleSettingsChange}
        canSubscribeStandardOCP={canSubscribeOCP}
        canSubscribeMarketplaceOCP={false}
      />
    );

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
                <GridItem sm={12} md={8} lg={8}>
                  <TextContent id="register-cluster-top-text">
                    <Text component={TextVariants.p}>{topText}</Text>
                  </TextContent>
                  { quotaResponse.fulfilled
                    ? (
                      <Form onSubmit={handleSubmit(this.handleSubmit)} className="subscription-settings form">
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
                        {canSubscribeOCP ? editSubscriptionSettings : (
                          <Tooltip
                            content="You cannot edit subscription settings because your organization does not have any OpenShift subscriptions. Contact sales to purchase OpenShift."
                            position={TooltipPosition.auto}
                          >
                            <div>{editSubscriptionSettings}</div>
                          </Tooltip>
                        )}
                      </Form>
                    )
                    : <Spinner />}
                </GridItem>
              </Grid>
            </CardBody>
            <CardFooter>
              <Button variant="primary" type="submit" onClick={handleSubmit(this.handleSubmit)} isDisabled={registerClusterResponse.pending || !isValid}>Register cluster</Button>
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
  onSubmit: PropTypes.func.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  canSubscribeOCP: PropTypes.bool.isRequired,
  quotaResponse: PropTypes.object.isRequired,
};

export default RegisterCluster;
