import PropTypes from 'prop-types';
import React from 'react';

import { Redirect } from 'react-router';

import {
  Wizard,
  Grid,
  PageSection,
  EmptyState,
  Stack,
  StackItem,
} from '@patternfly/react-core';

import { Spinner } from '@redhat-cloud-services/frontend-components';

import PageTitle from '../../../common/PageTitle';
import ErrorModal from '../../../common/ErrorModal';
import ErrorBox from '../../../common/ErrorBox';
import Breadcrumbs from '../../common/Breadcrumbs';

import { normalizedProducts, billingModels } from '../../../../common/subscriptionTypes';
import { shouldRefetchQuota } from '../../../../common/helpers';

import BillingModelSection from '../CreateOSDForm/FormSections/BillingModelSection/BillingModelSection';
import BasicFieldsSection from '../CreateOSDForm/FormSections/BasicFieldsSection/BasicFieldsSection';

import wizardConnector from './WizardConnector';

const WizardBillingModelSection = wizardConnector(BillingModelSection);
const WizardBasicFieldsSection = wizardConnector(BasicFieldsSection);

class CreateOSDWizard extends React.Component {
  state = {
    currentStep: 0,
  }

  componentDidMount() {
    const {
      machineTypes,
      organization,
      cloudProviders,
      persistentStorageValues,
      loadBalancerValues,
      getMachineTypes,
      getOrganizationAndQuota,
      getCloudProviders,
      getLoadBalancers,
      getPersistentStorage,
      cloudProviderID,
    } = this.props;

    document.title = 'Create an OpenShift Dedicated cluster | Red Hat OpenShift Cluster Manager';

    if (shouldRefetchQuota(organization)) {
      getOrganizationAndQuota();
    }
    if (!machineTypes.fulfilled && !machineTypes.pending) {
      getMachineTypes();
    }
    if (!cloudProviders.fulfilled && !cloudProviders.pending) {
      getCloudProviders();
    }
    if (!persistentStorageValues.fulfilled && !persistentStorageValues.pending) {
      getPersistentStorage();
    }
    if (!loadBalancerValues.fulfilled && !loadBalancerValues.pending) {
      getLoadBalancers();
    }
  }

  render() {
    const { isValid } = this.props;
    const steps = [
      { name: 'Billing model', component: <Grid><WizardBillingModelSection isWizard /></Grid>, enableNext: isValid },
      { name: 'Cluster settings', component: <p>Step 2 content</p> },
      { name: 'Networking', component: <p>Step 3 content</p> },
      { name: 'Default machine pool', component: <p>Step 4 content</p> },
      { name: 'Review and create', component: <p>Review step content</p>, nextButtonText: 'Finish' },
    ];
    const ariaTitle = 'Create OpenShift Dedicated cluster wizard';

    const {
      handleSubmit,
      createClusterResponse,
      change,
      machineTypes,
      organization,
      cloudProviders,
      product,
      osdTrialFeature,
      loadBalancerValues,
      persistentStorageValues,
      isErrorModalOpen,
      resetResponse,
      isBYOCModalOpen,
      openModal,
      closeModal,
      clustersQuota,
      cloudProviderID,
      privateClusterSelected,
      isAutomaticUpgrade,
      canEnableEtcdEncryption,
      selectedRegion,
      installToVPCSelected,
      canAutoScale,
      autoscalingEnabled,
      autoScaleMinNodesValue,
      autoScaleMaxNodesValue,
      billingModel,
      customerManagedEncryptionSelected,
    } = this.props;

    const selectedOSDTrial = product === normalizedProducts.OSDTrial;
    const orgWasFetched = !organization.pending && organization.fulfilled;

    if (createClusterResponse.fulfilled) {
      return (
        <Redirect to={`/details/s/${createClusterResponse.cluster.subscription.id}`} />
      );
    }

    // if (orgWasFetched
    //  && !clustersQuota.hasProductQuota
    //  && !clustersQuota.hasMarketplaceProductQuota) {
    //   return (
    //     <Redirect to="/create" />
    //   );
    // }

    // if (orgWasFetched) {
    //   if ((cloudProviderID === 'gcp' && !clustersQuota.hasGcpQuota) || (cloudProviderID === 'aws' && !clustersQuota.hasAwsQuota)) {
    //     return (<Redirect to="/create/osd" />);
    //   }
    //   const noTrialQuota = selectedOSDTrial && (!clustersQuota.hasProductQuota || !osdTrialFeature);
    //   if (noTrialQuota) {
    //     return (
    //       <Redirect to="/create" />
    //     );
    //   }
    // }

    const requests = [
      {
        data: machineTypes,
        name: 'Machine types',
      },
      {
        data: organization,
        name: 'Organization & Quota',
      },
      {
        data: cloudProviders,
        name: 'Providers & Regions',
      },
      {
        data: loadBalancerValues,
        name: 'Load balancers',
      },
      {
        data: persistentStorageValues,
        name: 'Storage options',
      },
    ];
    const anyRequestPending = requests.some(request => request.data.pending);

    const breadcrumbs = [
      { label: 'Clusters' },
      { label: 'Create', path: '/create' },
      { label: 'OpenShift Dedicated', path: '/create/osd' },
    ];

    const title = (
      <PageTitle
        title="Create an OpenShift Dedicated Cluster"
        breadcrumbs={(
          <Breadcrumbs path={breadcrumbs} />
        )}
      />
    );

    if (anyRequestPending || (!organization.fulfilled && !organization.error)) {
      return (
        <>
          {title}
          <PageSection>
            <Spinner centered />
          </PageSection>
        </>
      );
    }

    const anyErrors = requests.some(request => request.data.error);

    if (anyErrors) {
      return (
        <>
          {title}
          <PageSection>
            <EmptyState variant="full">
              <Stack hasGutter>
                { requests.map(request => request.data.error && (
                <StackItem key={request.name}>
                  <ErrorBox
                    message={`Error while loading required form data (${request.name})`}
                    response={request.data}
                  />
                </StackItem>
                ))}
              </Stack>
            </EmptyState>
          </PageSection>
        </>
      );
    }

    const creationErrorModal = isErrorModalOpen && (
      <ErrorModal
        title="Error creating cluster"
        errorResponse={createClusterResponse}
        resetResponse={resetResponse}
      />
    );

    return (
      <>
        {title}
        <PageSection>
          <div className="ocm-page">
            {creationErrorModal}
            <Wizard
              navAriaLabel={`${ariaTitle} steps`}
              mainAriaLabel={`${ariaTitle} content`}
              steps={steps}
            />
          </div>
        </PageSection>
      </>
    );
  }
}

export default CreateOSDWizard;
