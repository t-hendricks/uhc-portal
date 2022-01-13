import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import {
  Button,
  Card,
  Form,
  Grid,
  GridItem,
  Split,
  SplitItem,
  PageSection,
  PageSectionVariants,
  Banner,
} from '@patternfly/react-core';
import config from '../../../config';
import { normalizedProducts, billingModels } from '../../../common/subscriptionTypes';
import { shouldRefetchQuota } from '../../../common/helpers';

import PageTitle from '../../common/PageTitle';
import ErrorModal from '../../common/ErrorModal';
import Breadcrumbs from '../../common/Breadcrumbs';
import CreateOSDForm from './CreateOSDForm';
import './CreateOSDPage.scss';
import Unavailable from '../../common/Unavailable';
import DebugClusterRequest from './DebugClusterRequest';

class CreateOSDPage extends React.Component {
  state = {
    hasShownBYOCModal: false,
  }

  constructor(props) {
    super(props);
    this.getMarketplaceQuota = this.getMarketplaceQuota.bind(this);
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

    document.title = `Create an OpenShift Dedicated cluster | Red Hat OpenShift Cluster Manager | OpenShift Dedicated on
    ${cloudProviderID.toUpperCase()}`;

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

  componentDidUpdate(prevProps) {
    const { hasShownBYOCModal } = this.state;

    const {
      createClusterResponse,
      isErrorModalOpen,
      clustersQuota,
      openModal,
      change,
      getOrganizationAndQuota,
      cloudProviderID,
      billingModel,
    } = this.props;
    if (createClusterResponse.error && !isErrorModalOpen) {
      openModal('osd-create-error');
    }

    const hasBYOCQuota = !!get(clustersQuota, `${cloudProviderID}.byoc.totalAvailable`);
    const hasRhInfraQuota = !!get(clustersQuota, `${cloudProviderID}.rhInfra.totalAvailable`);

    const hasMarketplaceBYOCQuota = this.getMarketplaceQuota('byoc', cloudProviderID);
    const hasMarketplaceRhInfraQuota = this.getMarketplaceQuota('rhInfra', cloudProviderID);
    const selectedMarketplaceBilling = billingModel === billingModels.MARKETPLACE;

    if (prevProps.isBYOCModalOpen && !hasShownBYOCModal) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ hasShownBYOCModal: true });
    }

    // if user has only BYOC quota
    if (!prevProps.isBYOCModalOpen
     && ((!hasRhInfraQuota && hasBYOCQuota)
      || (selectedMarketplaceBilling && !hasMarketplaceRhInfraQuota && hasMarketplaceBYOCQuota))
     && !hasShownBYOCModal) {
      // open BYOC modal
      openModal('customer-cloud-subscription');
      // set byoc field value to true
      change('byoc', 'true');
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ hasShownBYOCModal: true });
    }

    if (createClusterResponse.fulfilled && !prevProps.createClusterResponse.fulfilled) {
      getOrganizationAndQuota(); // re-fetch quota on successful cluster creation
    }
  }

  componentWillUnmount() {
    this.reset();
  }

  getMarketplaceQuota(infra, cloudProviderID) {
    const { clustersQuota } = this.props;
    return !!get(
      clustersQuota, `marketplace.${cloudProviderID}.${infra}.totalAvailable`,
    );
  }

  reset() {
    const { resetResponse, resetForm } = this.props;
    resetResponse();
    resetForm();
  }

  render() {
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
      privateLinkSelected,
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

    if (orgWasFetched
     && !clustersQuota.hasProductQuota
     && !clustersQuota.hasMarketplaceProductQuota) {
      return (
        <Redirect to="/create" />
      );
    }

    if (orgWasFetched) {
      if ((cloudProviderID === 'gcp' && !clustersQuota.hasGcpQuota) || (cloudProviderID === 'aws' && !clustersQuota.hasAwsQuota)) {
        return (<Redirect to="/create/osd" />);
      }
      const noTrialQuota = selectedOSDTrial && (!clustersQuota.hasProductQuota || !osdTrialFeature);
      if (noTrialQuota) {
        return (
          <Redirect to="/create?trial=expired" />
        );
      }
    }

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
      { label: cloudProviderID === 'aws' ? 'Amazon Web Services' : 'Google Cloud Platform' },
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
          <PageSection>
            <Unavailable
              errors={
                requests
                  .filter(request => request.data.error)
                  .map(request => ({
                    key: request.name,
                    message: `Error while loading required form data (${request.name})`,
                    response: request.data,
                  }))
              }
            />
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
          <Card>
            <div className="ocm-page">
              <PageSection variant={PageSectionVariants.light}>
                {creationErrorModal}
                {/* Form */}
                <Form onSubmit={handleSubmit}>
                  <Grid hasGutter>
                    {config.fakeOSD && (
                      <>
                        <GridItem span={8}>
                          <Banner variant="warning">
                            On submit, a fake OSD cluster will be created.
                          </Banner>
                        </GridItem>
                        <GridItem span={4} />
                      </>
                    )}
                    <CreateOSDForm
                      pending={createClusterResponse.pending}
                      change={change}
                      isBYOCModalOpen={isBYOCModalOpen}
                      openModal={openModal}
                      closeModal={closeModal}
                      clustersQuota={clustersQuota}
                      cloudProviderID={cloudProviderID}
                      privateClusterSelected={privateClusterSelected}
                      product={product}
                      isAutomaticUpgrade={isAutomaticUpgrade}
                      canEnableEtcdEncryption={canEnableEtcdEncryption}
                      selectedRegion={selectedRegion}
                      installToVPCSelected={installToVPCSelected}
                      privateLinkSelected={privateLinkSelected}
                      customerManagedEncryptionSelected={customerManagedEncryptionSelected}
                      canAutoScale={canAutoScale}
                      autoscalingEnabled={autoscalingEnabled}
                      autoScaleMinNodesValue={autoScaleMinNodesValue}
                      autoScaleMaxNodesValue={autoScaleMaxNodesValue}
                      billingModel={billingModel}
                      getMarketplaceQuota={this.getMarketplaceQuota}
                    />
                    {/* Form footer */}
                    {config.fakeOSD && (
                      // TODO: sync props with submitOSDRequest() call.
                      //   Note mapStateToProps gives us product = selectedProduct || ownProps.product;
                      <DebugClusterRequest product={product} cloudProviderID={cloudProviderID} />
                    )}
                    <GridItem>
                      <Split hasGutter className="create-osd-form-button-split">
                        <SplitItem>
                          <Button
                            variant="primary"
                            type="submit"
                            onClick={handleSubmit}
                            isDisabled={createClusterResponse.pending}
                            isLoading={createClusterResponse.peneding}
                          >
                            Create cluster
                          </Button>
                        </SplitItem>
                        <SplitItem>
                          <Link to="/">
                            <Button variant="secondary" isDisabled={createClusterResponse.pending}>
                              Cancel
                            </Button>
                          </Link>
                        </SplitItem>
                        <SplitItem>
                          {createClusterResponse.pending && (<div className="form-loading-text">Do not refresh this page. This request may take a moment...</div>)}
                        </SplitItem>
                      </Split>
                    </GridItem>
                  </Grid>
                </Form>
              </PageSection>
            </div>
          </Card>
        </PageSection>
      </>
    );
  }
}

CreateOSDPage.propTypes = {
  isErrorModalOpen: PropTypes.bool,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  clustersQuota: PropTypes.shape({
    hasStandardOSDQuota: PropTypes.bool.isRequired,
    hasProductQuota: PropTypes.bool.isRequired,
    hasProductMarketplaceQuota: PropTypes.bool,
    hasAwsQuota: PropTypes.bool.isRequired,
    hasGcpQuota: PropTypes.bool.isRequired,
    aws: PropTypes.shape({
      byoc: PropTypes.shape({
        singleAz: PropTypes.object.isRequired,
        multiAz: PropTypes.object.isRequired,
        totalAvailable: PropTypes.number.isRequired,
      }).isRequired,
      rhInfra: PropTypes.shape({
        singleAz: PropTypes.object.isRequired,
        multiAz: PropTypes.object.isRequired,
        totalAvailable: PropTypes.number.isRequired,
      }).isRequired,
    }),
    gcp: PropTypes.shape({
      rhInfra: PropTypes.shape({
        singleAz: PropTypes.object.isRequired,
        multiAz: PropTypes.object.isRequired,
        totalAvailable: PropTypes.number.isRequired,
      }).isRequired,
    }),
    hasMarketplaceProductQuota: PropTypes.bool.isRequired,
  }),
  isBYOCModalOpen: PropTypes.bool.isRequired,
  resetResponse: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  createClusterResponse: PropTypes.object,
  change: PropTypes.func.isRequired,
  machineTypes: PropTypes.object.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  persistentStorageValues: PropTypes.object.isRequired,
  loadBalancerValues: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  getLoadBalancers: PropTypes.func.isRequired,
  getPersistentStorage: PropTypes.func.isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
  billingModel: PropTypes.string,
  privateClusterSelected: PropTypes.bool.isRequired,
  isAutomaticUpgrade: PropTypes.bool,
  canEnableEtcdEncryption: PropTypes.bool,
  selectedRegion: PropTypes.string,
  installToVPCSelected: PropTypes.bool,
  privateLinkSelected: PropTypes.bool,
  canAutoScale: PropTypes.bool.isRequired,
  autoscalingEnabled: PropTypes.bool.isRequired,
  autoScaleMinNodesValue: PropTypes.string,
  autoScaleMaxNodesValue: PropTypes.string,
  osdTrialFeature: PropTypes.bool,
  customerManagedEncryptionSelected: PropTypes.bool,
};

CreateOSDPage.defaultProps = {
  autoScaleMinNodesValue: '0',
  autoScaleMaxNodesValue: '0',
};

export default CreateOSDPage;
