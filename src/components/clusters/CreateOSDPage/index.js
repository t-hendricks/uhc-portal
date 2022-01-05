import { connect } from 'react-redux';
import { reduxForm, reset, formValueSelector } from 'redux-form';
import { resetCreatedClusterResponse } from '../../../redux/actions/clustersActions';
import { getMachineTypes } from '../../../redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';
import { getCloudProviders } from '../../../redux/actions/cloudProviderActions';
import getLoadBalancerValues from '../../../redux/actions/loadBalancerActions';
import getPersistentStorageValues from '../../../redux/actions/persistentStorageActions';
import CreateOSDPage from './CreateOSDPage';
import shouldShowModal from '../../common/Modal/ModalSelectors';
import { openModal, closeModal } from '../../common/Modal/ModalActions';
import { scrollToFirstError } from '../../../common/helpers';
import { billingModels, normalizedProducts } from '../../../common/subscriptionTypes';

import { canAutoScaleOnCreateSelector } from '../ClusterDetails/components/MachinePools/MachinePoolsSelectors';
import { OSD_TRIAL_FEATURE } from '../../../redux/constants/featureConstants';

import {
  hasManagedQuotaSelector,
  hasAwsQuotaSelector,
  hasGcpQuotaSelector,
  awsQuotaSelector,
  gcpQuotaSelector,
} from '../common/quotaSelectors';

import submitOSDRequest from './submitOSDRequest';

const AWS_DEFAULT_REGION = 'us-east-1';
const GCP_DEFAULT_REGION = 'us-east1';

const reduxFormConfig = {
  form: 'CreateCluster',
  onSubmitFail: scrollToFirstError,
};

const reduxFormCreateOSDPage = reduxForm(reduxFormConfig)(CreateOSDPage);

const mapStateToProps = (state, ownProps) => {
  const { organization } = state.userProfile;
  const { cloudProviderID } = ownProps;
  const isAwsForm = cloudProviderID === 'aws';
  const defaultRegion = isAwsForm ? AWS_DEFAULT_REGION : GCP_DEFAULT_REGION;
  const { STANDARD, MARKETPLACE } = billingModels;
  const { OSD, OSDTrial } = normalizedProducts;

  const valueSelector = formValueSelector('CreateCluster');
  const privateClusterSelected = valueSelector(state, 'cluster_privacy') === 'internal';
  const customerManagedEncryptionSelected = valueSelector(state, 'customer_managed_key');

  // The user may select a different product after entering the creation page
  // thus it could differ from the product in the URL
  const selectedProduct = valueSelector(state, 'product');
  const product = selectedProduct || ownProps.product;

  const hasAwsQuota = hasAwsQuotaSelector(state, product, STANDARD)
                   || hasAwsQuotaSelector(state, product, MARKETPLACE);
  const hasGcpQuota = hasGcpQuotaSelector(state, product, STANDARD)
                   || hasGcpQuotaSelector(state, product, MARKETPLACE);

  const hasStandardOSDQuota = hasAwsQuotaSelector(state, OSD, STANDARD)
                           || hasGcpQuotaSelector(state, OSD, STANDARD);

  return ({
    createClusterResponse: state.clusters.createdCluster,
    machineTypes: state.machineTypes,
    organization,
    customerManagedEncryptionSelected,
    selectedRegion: valueSelector(state, 'region'),
    installToVPCSelected: valueSelector(state, 'install_to_vpc'),
    privateLinkSelected: valueSelector(state, 'use_privatelink'),
    isErrorModalOpen: shouldShowModal(state, 'osd-create-error'),
    isBYOCModalOpen: shouldShowModal(state, 'customer-cloud-subscription'),
    isAutomaticUpgrade: valueSelector(state, 'upgrade_policy') === 'automatic',

    cloudProviders: state.cloudProviders,
    persistentStorageValues: state.persistentStorageValues,
    loadBalancerValues: state.loadBalancerValues,

    clustersQuota: {
      hasStandardOSDQuota,
      hasProductQuota: hasManagedQuotaSelector(state, product),
      hasOSDTrialQuota: hasManagedQuotaSelector(state, OSDTrial),
      hasMarketplaceProductQuota: hasAwsQuotaSelector(state, OSD, MARKETPLACE)
                               || hasGcpQuotaSelector(state, OSD, MARKETPLACE),
      hasAwsQuota,
      hasGcpQuota,
      aws: awsQuotaSelector(state, product, STANDARD),
      gcp: gcpQuotaSelector(state, product, STANDARD),
      marketplace: {
        // RHM does not sell OSD Trial access
        aws: awsQuotaSelector(state, OSD, MARKETPLACE),
        gcp: gcpQuotaSelector(state, OSD, MARKETPLACE),
      },
    },

    privateClusterSelected,
    product,

    canAutoScale: canAutoScaleOnCreateSelector(state, product),
    autoscalingEnabled: !!valueSelector(state, 'autoscalingEnabled'),
    autoScaleMinNodesValue: valueSelector(state, 'min_replicas'),
    autoScaleMaxNodesValue: valueSelector(state, 'max_replicas'),
    osdTrialFeature: state.features[OSD_TRIAL_FEATURE],
    billingModel: valueSelector(state, 'billing_model'),

    initialValues: {
      byoc: 'false',
      name: '',
      nodes_compute: '4',
      dns_base_domain: '',
      aws_access_key_id: '',
      aws_secret_access_key: '',
      region: defaultRegion,
      multi_az: 'false',
      persistent_storage: '107374182400',
      load_balancers: '0',
      network_configuration_toggle: 'basic',
      disable_scp_checks: false,
      node_drain_grace_period: 60,
      upgrade_policy: 'manual',
      automatic_upgrade_schedule: '0 0 * * 0',
      node_labels: [{}],
      billing_model: 'standard',
      product: ownProps.product,
      enable_user_workload_monitoring: true,
    },
  });
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: submitOSDRequest(dispatch, ownProps),
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
  resetForm: () => dispatch(reset('CreateCluster')),
  openModal: (modalName) => { dispatch(openModal(modalName)); },
  closeModal: () => { dispatch(closeModal()); },
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getMachineTypes: () => dispatch(getMachineTypes()),
  getCloudProviders: () => dispatch(getCloudProviders()),
  getPersistentStorage: () => dispatch(getPersistentStorageValues()),
  getLoadBalancers: () => dispatch(getLoadBalancerValues()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateOSDPage);
