import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Link, Redirect } from 'react-router-dom';
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
import { isValid, scrollToTop } from '../../../../../common/helpers';
import Breadcrumbs from '../../../../common/Breadcrumbs';
import IDPForm from './components/IDPForm';
import Unavailable from '../../../../common/Unavailable';
import getClusterName from '../../../../../common/getClusterName';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';
import { IDPTypeNames, singularFormIDP } from './IdentityProvidersHelper';
import { isHypershiftCluster } from '../../clusterDetailsHelper';

class IdentityProvidersPage extends React.Component {
  componentDidMount() {
    const { fetchDetails, clusterDetails, getClusterIDPs, match } = this.props;
    const { cluster } = clusterDetails;

    document.title = 'Red Hat OpenShift Cluster Manager';
    scrollToTop();

    const subscriptionID = match.params.id;
    if (isValid(subscriptionID) && get(cluster, 'subscription.id', '') !== subscriptionID) {
      fetchDetails(subscriptionID);
    } else if (get(cluster, 'subscription.id', '') === subscriptionID) {
      getClusterIDPs(cluster.id);
    }
  }

  componentDidUpdate(prevProps) {
    const { match, clusterDetails, getClusterIDPs } = this.props;
    const subscriptionID = match.params.id;

    if (get(clusterDetails, 'cluster.subscription.id') === subscriptionID) {
      const clusterName = getClusterName(clusterDetails.cluster);
      document.title = `${clusterName} | Red Hat OpenShift Cluster Manager`;
    }
    if (
      !prevProps.clusterDetails?.cluster?.id &&
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
        getClusterIDPs(clusterID);
      }
    }
  }

  componentWillUnmount() {
    const { resetResponse, resetForm } = this.props;
    resetResponse();
    resetForm();
  }

  render() {
    const {
      clusterDetails,
      match,
      clusterIDPs,
      setGlobalError,
      handleSubmit,
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
      HtPasswdErrors,
    } = this.props;
    const { cluster } = clusterDetails;

    if (submitIDPResponse.fulfilled) {
      return <Redirect to={`/details/s/${cluster.subscription.id}#accessControl`} />;
    }
    const requestedSubscriptionID = match.params.id;

    const clusterPending =
      get(cluster, 'subscription.id') !== requestedSubscriptionID && !clusterDetails.error;
    const idpsPending = get(clusterIDPs, 'pending', false);

    if ((clusterPending || idpsPending) && !clusterDetails.error) {
      return (
        <div id="clusterdetails-content">
          <div className="cluster-loading-container">
            <Spinner centered />
          </div>
        </div>
      );
    }

    const errorState = () => (
      <>
        <Unavailable message="Error retrieving IDP page" response={clusterDetails} />
        {clusterPending && <Spinner />}
      </>
    );

    if (
      clusterDetails.error &&
      (!cluster || get(cluster, 'subscription.id') !== requestedSubscriptionID)
    ) {
      if (clusterDetails.errorCode === 404 || clusterDetails.errorCode === 403) {
        setGlobalError(
          <>
            Cluster with subscription ID <b>{requestedSubscriptionID}</b> was not found, it might
            have been deleted or you don&apos;t have permission to see it.
          </>,
          'identityProvidersPage',
          clusterDetails.errorMessage,
        );
        return <Redirect to="/" />;
      }
      return errorState();
    }

    const isManaged = get(clusterDetails, 'cluster.managed', false);
    if (!isManaged) {
      setGlobalError(
        <>
          Cluster with subscription ID <b>{requestedSubscriptionID}</b> is not a managed cluster.
        </>,
        'identityProvidersPage',
        "Go to the cluster's console to see and edit identity providers.",
      );
      return <Redirect to="/" />;
    }

    if ((!isEditForm && !selectedIDP) || (isEditForm && clusterIDPs.fulfilled && !editedType)) {
      return <Redirect to={`/details/s/${cluster.subscription.id}#accessControl`} />;
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
      <>
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
                      HtPasswdErrors={HtPasswdErrors}
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
      </>
    );
  }
}

IdentityProvidersPage.propTypes = {
  match: PropTypes.object.isRequired,
  fetchDetails: PropTypes.func.isRequired,
  getClusterIDPs: PropTypes.func.isRequired,
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
  setGlobalError: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitIDPResponse: PropTypes.object,
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
  HtPasswdErrors: PropTypes.object.isRequired,
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
