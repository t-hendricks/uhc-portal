import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom-v5-compat';
import { Field, reset } from 'redux-form';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Form,
  Grid,
  GridItem,
  PageSection,
  Text,
  TextContent,
  TextVariants,
  Title,
  Tooltip,
  TooltipPosition,
} from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';

import { AppPage } from '~/components/App/AppPage';
import { openModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import shouldShowModal from '~/components/common/Modal/ModalSelectors';
import {
  registerDisconnectedCluster,
  resetCreatedClusterResponse,
} from '~/redux/actions/clustersActions';
import { getOrganizationAndQuota } from '~/redux/actions/userActions';
import { useGlobalState } from '~/redux/hooks';
import { SubscriptionCreateRequest } from '~/types/accounts_mgmt.v1';
import { ErrorState } from '~/types/types';

import {
  checkClusterDisplayName,
  checkClusterUUID,
  checkDisconnectedConsoleURL,
} from '../../../common/validators';
import Breadcrumbs from '../../common/Breadcrumbs';
import ErrorModal from '../../common/ErrorModal';
import ReduxVerticalFormGroup from '../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import Unavailable from '../../common/Unavailable';

import { REGISTER_CLUSTER_FORM_KEY } from './constants';
import EditSubscriptionSettings from './EditSubscriptionSettings';
import { hasOrgLevelsubscribeOCPCapability } from './registerClusterSelectors';
import validateSubscriptionSettings from './validateSubscriptionSettings';

type RegisterClusterProps = {
  handleSubmit: (...params: any[]) => any;
};

const RegisterCluster = ({ handleSubmit }: RegisterClusterProps) => {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({});

  const { quotaResponse, registerClusterResponse, isOpen, canSubscribeOCP } = useGlobalState(
    (state) => ({
      quotaResponse: get(state, 'userProfile.organization', null),
      registerClusterResponse: state.clusters.createdCluster,
      isOpen: shouldShowModal(state, modals.REGISTER_CLUSTER_ERROR),
      canSubscribeOCP: hasOrgLevelsubscribeOCPCapability(state),
    }),
  );

  const resetResponseAndForm = useCallback(() => {
    dispatch(resetCreatedClusterResponse());
    dispatch(reset(REGISTER_CLUSTER_FORM_KEY) as any);
  }, [dispatch]);

  useEffect(() => {
    resetResponseAndForm();
    dispatch(getOrganizationAndQuota() as any);

    return () => resetResponseAndForm();
  }, [dispatch, resetResponseAndForm]);

  useEffect(() => {
    if (registerClusterResponse.error && !isOpen) {
      dispatch(openModal(modals.REGISTER_CLUSTER_ERROR));
    }
  }, [registerClusterResponse.error, isOpen, dispatch]);

  const { isValid } = useMemo(() => validateSubscriptionSettings(settings), [settings]);

  const onSubmit = (values: {
    cluster_id: string;
    display_name: string;
    web_console_url: string;
  }) => {
    const { request, isValid } = validateSubscriptionSettings(settings);
    if (isValid) {
      const registrationRequest: SubscriptionCreateRequest = {
        cluster_uuid: values.cluster_id,
        plan_id: SubscriptionCreateRequest.plan_id.OCP,
        status: SubscriptionCreateRequest.status.DISCONNECTED,
        display_name: values.display_name,
        console_url: values.web_console_url,
      };
      dispatch(registerDisconnectedCluster(registrationRequest, request) as any);
    }
  };

  if (registerClusterResponse.fulfilled) {
    return (
      // TODO 'cluster' here is actually subscription, should be renamed
      <Navigate replace to={`/details/s/${registerClusterResponse.cluster.id}`} />
    );
  }

  const errorModal = isOpen && (
    <ErrorModal
      title="Error Registering Cluster"
      errorResponse={registerClusterResponse as ErrorState}
      resetResponse={() => dispatch(resetCreatedClusterResponse())}
    />
  );

  if (quotaResponse?.error) {
    return (
      <PageSection>
        <Unavailable message="Error retrieving quota" response={quotaResponse} />
      </PageSection>
    );
  }

  return (
    <AppPage>
      <PageHeader>
        <Breadcrumbs path={[{ label: 'Clusters' }, { label: 'Register disconnected cluster' }]} />
        <PageHeaderTitle title="Register disconnected cluster" />
      </PageHeader>
      <PageSection>
        {errorModal}
        <Card id="register-cluster">
          <CardBody>
            <Grid>
              <GridItem md={8}>
                <TextContent id="register-cluster-top-text">
                  <Text component={TextVariants.p}>
                    Register clusters that are not connected to OpenShift Cluster Manager. Existing
                    cluster owners, cluster editors, or admins can edit existing cluster
                    subscriptions from the cluster details page.
                  </Text>
                </TextContent>
                {quotaResponse?.fulfilled ? (
                  <Form onSubmit={handleSubmit(onSubmit)} className="subscription-settings form">
                    <Field
                      component={ReduxVerticalFormGroup}
                      name="cluster_id"
                      label="Cluster ID"
                      type="text"
                      extendedHelpText="The cluster ID may be found on the About page of the cluster web console"
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
                    <Title headingLevel="h4" size="xl">
                      Subscription settings
                    </Title>
                    <TextContent>
                      <Text component={TextVariants.p}>
                        Editing the subscription settings will help ensure that you receive the
                        level of support that you expect, and that your cluster is consuming the
                        correct type of subscription.
                      </Text>
                    </TextContent>
                    {canSubscribeOCP ? (
                      <EditSubscriptionSettings
                        setSettings={setSettings}
                        canSubscribeOCP={canSubscribeOCP}
                      />
                    ) : (
                      <Tooltip
                        content="You cannot edit subscription settings because your organization does not have any OpenShift subscriptions. Contact sales to purchase OpenShift."
                        position={TooltipPosition.auto}
                      >
                        <div>
                          <EditSubscriptionSettings
                            setSettings={setSettings}
                            canSubscribeOCP={canSubscribeOCP}
                          />
                        </div>
                      </Tooltip>
                    )}
                  </Form>
                ) : (
                  <Spinner />
                )}
              </GridItem>
            </Grid>
          </CardBody>
          <CardFooter>
            <Button
              variant="primary"
              type="submit"
              onClick={handleSubmit(onSubmit)}
              isDisabled={registerClusterResponse.pending || !isValid}
            >
              Register cluster
            </Button>
            <Link to="/cluster-list">
              <Button variant="secondary" isDisabled={registerClusterResponse.pending}>
                Cancel
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </PageSection>
    </AppPage>
  );
};

export default RegisterCluster;
