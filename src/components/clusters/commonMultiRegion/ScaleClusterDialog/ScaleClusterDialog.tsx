import React from 'react';
import { Field, Formik } from 'formik';
import get from 'lodash/get';
import { useDispatch } from 'react-redux';

import { Alert, Form, FormGroup, Grid, GridItem } from '@patternfly/react-core';

import getClusterName from '~/common/getClusterName';
import { useEditCluster } from '~/queries/ClusterDetailsQueries/useEditCluster';
import { invalidateClusterDetailsQueries } from '~/queries/ClusterDetailsQueries/useFetchClusterDetails';
import { useGlobalState } from '~/redux/hooks';
import { Cluster } from '~/types/clusters_mgmt.v1';

import ErrorBox from '../../../common/ErrorBox';
import Modal from '../../../common/Modal/Modal';
import { closeModal } from '../../../common/Modal/ModalActions';
import modals from '../../../common/Modal/modals';
import {
  shouldShowLoadBalancerAlert,
  shouldShowStorageQuotaAlert,
} from '../../common/ScaleClusterDialog/ScaleClusterSelectors';
import LoadBalancersDropdown from '../LoadBalancersDropdown';
import PersistentStorageDropdown from '../PersistentStorageDropdown';

const ScaleClusterDialog = () => {
  const dispatch = useDispatch();

  const closeScaleClusterModal = () => dispatch(closeModal());

  /* Redux state */
  const showLoadBalancerAlert = useGlobalState((state) => shouldShowLoadBalancerAlert(state));
  const showPersistentStorageAlert = useGlobalState((state) => shouldShowStorageQuotaAlert(state));

  /* Cluster data */
  const modalData = useGlobalState((state) => state.modal.data) as any;

  const consoleURL = get(modalData, 'console.url', null);
  const region = get(modalData, 'rh_region_id', undefined);
  const isByoc = modalData.ccs?.enabled;
  const clusterDisplayName = getClusterName(modalData);
  // @ts-ignore
  const shouldDisplayClusterName = modalData.shouldDisplayClusterName || false;
  const cloudProviderID = get(modalData, 'cloud_provider.id', '');
  const billingModel = modalData.subscription?.cluster_billing_model;
  const product = modalData.subscription?.plan?.type;
  const isMultiAZ = modalData.multi_az;
  const clusterId = modalData.id || '';

  /* Data mutation */
  const {
    isPending: editPending,
    isError: editIsError,
    error: editError,
    mutate,
  } = useEditCluster(clusterId, region);

  const onSubmit = (formData: { load_balancers: string; persistent_storage: string }) => {
    const clusterRequest: {
      load_balancer_quota?: number | null;
      storage_quota?: { unit: string; value: number } | null;
    } = {};

    if (!isByoc) {
      clusterRequest.load_balancer_quota = formData.load_balancers
        ? parseInt(formData.load_balancers, 10)
        : null;
      // values in the passed are always in bytes.
      clusterRequest.storage_quota = formData.persistent_storage
        ? {
            unit: 'B',
            value: parseFloat(formData.persistent_storage),
          }
        : null;
    }

    mutate(clusterRequest as Cluster, {
      onSuccess: () => {
        dispatch(closeModal());
        invalidateClusterDetailsQueries();
      },
    });
  };

  const cancelEdit = () => {
    closeScaleClusterModal();
  };

  const error = editIsError ? (
    <ErrorBox message="Error editing cluster" response={editError} />
  ) : null;

  const usageLink = consoleURL ? (
    <a
      href={`${consoleURL}/k8s/ns/default/resourcequotas`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Check your usage
    </a>
  ) : (
    'Check your usage'
  );

  const scalingAlert = (
    <Alert
      variant="warning"
      isInline
      title="Scaling below the current limit can cause problems in your environment"
    >
      <div>
        <p>
          {usageLink} before proceeding to be sure you are not scaling below what is currently being
          used.
        </p>
      </div>
    </Alert>
  );

  const pending = editPending;

  const className = isByoc ? 'edit-cluster-modal' : 'edit-cluster-modal edit-cluster-modal-rhinfra';
  const title = 'Edit load balancers and persistent storage';
  return (
    <Formik
      initialValues={{
        id: modalData.id,
        nodes_compute: modalData.nodes ? modalData.nodes.compute : null,
        load_balancers: modalData.load_balancer_quota ? modalData.load_balancer_quota : 0,
        persistent_storage: modalData.storage_quota ? modalData.storage_quota.value : 107374182400,
      }}
      onSubmit={(values) => onSubmit(values)}
    >
      {({ submitForm, getFieldMeta, getFieldProps, setFieldValue, values, dirty }) => (
        <Modal
          className={className}
          title={title}
          secondaryTitle={shouldDisplayClusterName ? clusterDisplayName : undefined}
          onClose={cancelEdit}
          primaryText="Apply"
          // @ts-ignore
          onPrimaryClick={submitForm}
          onSecondaryClick={cancelEdit}
          isPrimaryDisabled={pending || !dirty}
          isPending={pending}
          isSmall
        >
          <>
            {error}

            <Form onSubmit={submitForm}>
              <Grid hasGutter>
                {!isByoc && (
                  <>
                    <GridItem span={8}>
                      <FormGroup fieldId="load_balancers" label="Load balancers">
                        {/* @ts-ignore */}
                        <Field
                          label="Load balancers"
                          name="load_balancers"
                          component={LoadBalancersDropdown}
                          input={{
                            // name, value, onBlur, onChange
                            ...getFieldProps('load_balancers'),
                            onChange: (value: string) => {
                              setFieldValue('load_balancers', value);
                            },
                          }}
                          meta={getFieldMeta('load_balancers')}
                          currentValue={values.load_balancers}
                          disabled={pending}
                          cloudProviderID={cloudProviderID}
                          billingModel={billingModel}
                          product={product}
                          isBYOC={isByoc}
                          isMultiAZ={isMultiAZ}
                          region={region}
                        />
                      </FormGroup>
                    </GridItem>
                    <GridItem span={4} />
                    {showLoadBalancerAlert && scalingAlert}
                    <GridItem span={8}>
                      <FormGroup fieldId="persistent_storage" label="Persistent storage">
                        {/* @ts-ignore */}
                        <Field
                          label="Persistent storage"
                          name="persistent_storage"
                          component={PersistentStorageDropdown}
                          input={{
                            // name, value, onBlur, onChange
                            ...getFieldProps('persistent_storage'),
                            onChange: (value: string) => {
                              setFieldValue('persistent_storage', value);
                            },
                          }}
                          meta={getFieldMeta('persistent_storage')}
                          disabled={pending}
                          currentValue={values.persistent_storage}
                          cloudProviderID={cloudProviderID}
                          billingModel={billingModel}
                          product={product}
                          isBYOC={isByoc}
                          isMultiAZ={isMultiAZ}
                          region={region}
                        />
                      </FormGroup>
                    </GridItem>
                    <GridItem span={4} />
                    {showPersistentStorageAlert && scalingAlert}
                  </>
                )}
              </Grid>
            </Form>
          </>
        </Modal>
      )}
    </Formik>
  );
};

ScaleClusterDialog.modalName = modals.SCALE_CLUSTER;

export default ScaleClusterDialog;
