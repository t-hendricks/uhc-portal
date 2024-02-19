import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { useParams, Navigate, Link } from 'react-router-dom-v5-compat';
import { useDispatch } from 'react-redux';
import { reset } from 'redux-form';
import {
  PageSection,
  Card,
  Grid,
  GridItem,
  CardBody,
  CardFooter,
  Button,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { AppPage } from '~/components/App/AppPage';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import { isValid } from '../../../../../common/helpers';
import Breadcrumbs from '../../../../common/Breadcrumbs';
import IDPForm from './components/IDPForm';
import Unavailable from '../../../../common/Unavailable';
import getClusterName from '../../../../../common/getClusterName';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';
import { fetchClusterDetails } from '../../../../../redux/actions/clustersActions';
import { IDPTypeNames, singularFormIDP } from './IdentityProvidersHelper';
import { setGlobalError } from '../../../../../redux/actions/globalErrorActions';
import {
  resetCreatedClusterIDPResponse,
  getClusterIdentityProviders,
} from './IdentityProvidersActions';

const PAGE_TITLE = 'Red Hat OpenShift Cluster Manager';

const IdentityProvidersPage = (props) => {
  const {
    clusterIDPs,
    handleSubmit,
    clusterDetails,
    submitIDPResponse,
    selectedMappingMethod,
    change,
    clearFields,
    IDPList,
    initialValues,
    idpEdited,
    editedType,
    isEditForm,
    selectedIDP,
    pristine,
    invalid,
    HTPasswdErrors,
  } = props;

  const params = useParams();
  const dispatch = useDispatch();
  const { cluster } = clusterDetails;

  const prevClusterDetails = React.useRef(clusterDetails);

  React.useEffect(() => {
    document.title = 'Red Hat OpenShift Cluster Manager';

    const subscriptionID = params.id;
    if (isValid(subscriptionID) && get(cluster, 'subscription.id', '') !== subscriptionID) {
      dispatch(fetchClusterDetails(subscriptionID));
    } else if (get(cluster, 'subscription.id', '') === subscriptionID) {
      dispatch(getClusterIdentityProviders(cluster.id));
    }

    return () => {
      dispatch(resetCreatedClusterIDPResponse());
      dispatch(reset('CreateIdentityProvider'));
    };
    // should run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const subscriptionID = params.id;

    if (get(prevClusterDetails.current, 'cluster.subscription.id') === subscriptionID) {
      const clusterName = getClusterName(clusterDetails.cluster);
      document.title = `${clusterName} | Red Hat OpenShift Cluster Manager`;
    }
    if (
      !prevClusterDetails.current?.cluster?.id &&
      clusterDetails.fulfilled &&
      clusterDetails?.cluster?.id
    ) {
      /* we only know the Cluster Service `cluster_id` after the subscription request has returned.
      only then we can fetch Cluster Service specific data */
      const { cluster } = clusterDetails;
      const clusterID = get(cluster, 'id');
      const isManaged = get(clusterDetails, 'cluster.managed', false);
      const subscriptionStatus = get(cluster, 'subscription.status');
      if (
        isValid(clusterID) &&
        subscriptionStatus !== subscriptionStatuses.DEPROVISIONED &&
        isManaged
      ) {
        dispatch(getClusterIdentityProviders(clusterID));
      }
      prevClusterDetails.current = clusterDetails;
    }
  }, [dispatch, params.id, clusterDetails]);

  if (submitIDPResponse.fulfilled) {
    return <Navigate to={`/details/s/${cluster.subscription.id}#accessControl`} />;
  }

  const requestedSubscriptionID = params.id;

  const clusterPending =
    get(cluster, 'subscription.id') !== requestedSubscriptionID && !clusterDetails.error;
  const idpsPending = get(clusterIDPs, 'pending', false);

  if ((clusterPending || idpsPending) && !clusterDetails.error) {
    return (
      <AppPage title={PAGE_TITLE}>
        <div id="clusterdetails-content">
          <div className="cluster-loading-container">
            <Spinner centered />
          </div>
        </div>
      </AppPage>
    );
  }

  const errorState = () => (
    <AppPage title={PAGE_TITLE}>
      <Unavailable message="Error retrieving IDP page" response={clusterDetails} />
      {clusterPending && <Spinner />}
    </AppPage>
  );

  if (
    clusterDetails.error &&
    (!cluster || get(cluster, 'subscription.id') !== requestedSubscriptionID)
  ) {
    if (clusterDetails.errorCode === 404 || clusterDetails.errorCode === 403) {
      dispatch(
        setGlobalError(
          <>
            Cluster with subscription ID <b>{requestedSubscriptionID}</b> was not found, it might
            have been deleted or you don&apos;t have permission to see it.
          </>,
          'identityProvidersPage',
          clusterDetails.errorMessage,
        ),
      );
      return <Navigate replace to="/" />;
    }
    return errorState();
  }

  const isManaged = get(clusterDetails, 'cluster.managed', false);
  if (!isManaged) {
    dispatch(
      setGlobalError(
        <>
          Cluster with subscription ID <b>{requestedSubscriptionID}</b> is not a managed cluster.
        </>,
        'identityProvidersPage',
        "Go to the cluster's console to see and edit identity providers.",
      ),
    );
    return <Navigate replace to="/" />;
  }

  if (
    (!isEditForm && !selectedIDP && !params.idpTypeName) ||
    (isEditForm && clusterIDPs.fulfilled && !editedType)
  ) {
    return <Navigate to={`/details/s/${cluster.subscription.id}#accessControl`} />;
  }
  const idpTypeName = IDPTypeNames[selectedIDP];
  const title = isEditForm
    ? `Edit identity provider: ${idpEdited.name}`
    : `Add identity provider: ${idpTypeName}`;
  const clusterName = getClusterName(clusterDetails.cluster);
  const secondaryTitle = isEditForm
    ? title
    : `Add ${singularFormIDP[selectedIDP]} identity provider`;
  return (
    <AppPage title={PAGE_TITLE}>
      <PageHeader>
        <Breadcrumbs
          path={[
            { label: 'Clusters' },
            { label: clusterName, path: `/details/s/${cluster.subscription.id}` },
            {
              label: 'Access control',
              path: `/details/s/${cluster.subscription.id}#accessControl`,
            },
            { label: title },
          ]}
        />
        <PageHeaderTitle title={title} />
      </PageHeader>
      <PageSection>
        <Card>
          <CardBody>
            <Grid>
              <GridItem md={8}>
                {clusterIDPs.fulfilled ? (
                  <IDPForm
                    selectedIDP={selectedIDP}
                    idpTypeName={idpTypeName}
                    formTitle={secondaryTitle}
                    submitIDPResponse={submitIDPResponse}
                    selectedMappingMethod={selectedMappingMethod}
                    clusterUrls={{
                      console: get(cluster, 'console.url'),
                      api: get(cluster, 'api.url'),
                    }}
                    change={change}
                    clearFields={clearFields}
                    IDPList={IDPList}
                    isEditForm={isEditForm}
                    idpEdited={idpEdited}
                    idpName={initialValues.name}
                    isHypershift={isHypershiftCluster(cluster)}
                    HTPasswdErrors={HTPasswdErrors}
                  />
                ) : (
                  <Spinner />
                )}
              </GridItem>
            </Grid>
          </CardBody>
          <CardFooter>
            <Split hasGutter>
              <SplitItem>
                <Button
                  variant="primary"
                  type="submit"
                  isDisabled={pristine || invalid}
                  onClick={handleSubmit}
                >
                  {isEditForm ? 'Save' : 'Add'}
                </Button>
              </SplitItem>
              <SplitItem>
                <Link to={`/details/s/${cluster.subscription.id}#accessControl`}>
                  <Button variant="secondary">Cancel</Button>
                </Link>
              </SplitItem>
            </Split>
          </CardFooter>
        </Card>
      </PageSection>
    </AppPage>
  );
};

IdentityProvidersPage.propTypes = {
  isEditForm: PropTypes.bool,
  clusterIDPs: PropTypes.object.isRequired,
  clusterDetails: PropTypes.shape({
    cluster: PropTypes.object,
    error: PropTypes.bool,
    errorCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
    fulfilled: PropTypes.bool,
    pending: PropTypes.bool,
  }),
  handleSubmit: PropTypes.func.isRequired,
  selectedMappingMethod: PropTypes.string,
  change: PropTypes.func.isRequired,
  clearFields: PropTypes.func.isRequired,
  IDPList: PropTypes.array.isRequired,
  idpEdited: PropTypes.object,
  editedType: PropTypes.string,
  initialValues: PropTypes.shape({
    idpId: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  selectedIDP: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  HTPasswdErrors: PropTypes.object.isRequired,
  submitIDPResponse: PropTypes.object,
};

IdentityProvidersPage.defaultProps = {
  clusterDetails: {
    cluster: null,
    error: false,
    errorMessage: '',
    fulfilled: false,
  },
  isEditForm: false,
};

export default IdentityProvidersPage;
