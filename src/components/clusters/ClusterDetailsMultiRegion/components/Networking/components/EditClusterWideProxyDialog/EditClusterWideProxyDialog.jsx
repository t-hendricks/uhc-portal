import React, { useCallback } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { arrayToString, stringToArray } from '~/common/helpers';
import { modalActions } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import shouldShowModal from '~/components/common/Modal/ModalSelectors';
import { useEditCluster } from '~/queries/ClusterDetailsQueries/useEditCluster';
import { invalidateClusterDetailsQueries } from '~/queries/ClusterDetailsQueries/useFetchClusterDetails';
import { useGlobalState } from '~/redux/hooks';

import EditClusterWideProxyForm from './EditClusterWideProxyForm';

const OnlyRetunValueIfChanged = (newValue, oldValue) =>
  newValue !== oldValue ? newValue : undefined;

const EditClusterWideProxyDialog = ({ cluster, region }) => {
  const dispatch = useDispatch();
  const isOpen = useGlobalState((state) => shouldShowModal(state, modals.EDIT_CLUSTER_WIDE_PROXY));

  const {
    isPending: isClusterEditPending,
    isError: isClusterEditError,
    error: clusterEditError,
    mutate: mutateClusterEdit,
    reset: resetEditClusterResponse,
  } = useEditCluster(cluster.id, region);

  const initialValues = {
    clusterID: cluster.id,
    http_proxy_url: cluster.proxy?.http_proxy,
    https_proxy_url: cluster.proxy?.https_proxy,
    no_proxy_domains: stringToArray(cluster.proxy?.no_proxy),
  };

  const handleClose = useCallback(() => {
    dispatch(modalActions.closeModal());
    resetEditClusterResponse();
    invalidateClusterDetailsQueries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isOpen ? (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        const clusterProxyBody = {
          proxy: {
            http_proxy: OnlyRetunValueIfChanged(
              values.http_proxy_url,
              initialValues.http_proxy_url,
            ),
            https_proxy: OnlyRetunValueIfChanged(
              values.https_proxy_url,
              initialValues.https_proxy_url,
            ),
            no_proxy: OnlyRetunValueIfChanged(
              arrayToString(values.no_proxy_domains),
              arrayToString(initialValues.no_proxy_domains),
            ),
          },
          additional_trust_bundle: OnlyRetunValueIfChanged(
            values.additional_trust_bundle,
            initialValues.additional_trust_bundle,
          ),
        };

        mutateClusterEdit(clusterProxyBody, {
          onSuccess: () => handleClose(),
        });
      }}
    >
      {({ submitForm }) => (
        <EditClusterWideProxyForm
          submitForm={submitForm}
          isClusterEditPending={isClusterEditPending}
          isClusterEditError={isClusterEditError}
          clusterEditError={clusterEditError?.error}
          handleClose={handleClose}
        />
      )}
    </Formik>
  ) : null;
};

EditClusterWideProxyDialog.propTypes = {
  cluster: PropTypes.object,
  region: PropTypes.string,
};

export default EditClusterWideProxyDialog;
