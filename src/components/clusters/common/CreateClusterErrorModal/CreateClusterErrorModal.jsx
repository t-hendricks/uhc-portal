import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { resetCreatedClusterResponse } from '../../../../redux/actions/clustersActions';
import ErrorModal from '../../../common/ErrorModal';
import MissingPrereqErrorModal from '../MissingPrereqErrorModal';
import ShieldedVmErrorModal from '../ShieldedVmErrorModal';

const ErrorKey = {
  AwsCredsNotOsdCcsAdmin: 'AWSCredsNotOSDCCSAdmin',
};

const CreateClusterErrorModal = ({ onRetry }) => {
  const dispatch = useDispatch();
  const createClusterResponse = useSelector((state) => state.clusters.createdCluster);
  const resetResponse = () => dispatch(resetCreatedClusterResponse());
  const { error: createClusterError } = createClusterResponse;

  if (createClusterError) {
    const errorDetailsKey = createClusterResponse.errorDetails?.[0]?.Error_Key;
    const isAwsCredsAdminError = errorDetailsKey === ErrorKey.AwsCredsNotOsdCcsAdmin;

    if (isAwsCredsAdminError) {
      return <MissingPrereqErrorModal onRetry={onRetry} onClose={resetResponse} />;
    }

    if (createClusterResponse?.errorMessage.includes('SecureBoot feature')) {
      return (
        <ShieldedVmErrorModal
          title="Error creating cluster"
          errorResponse={createClusterResponse}
          onClose={resetResponse}
        />
      );
    }

    return (
      <ErrorModal
        title="Error creating cluster"
        errorResponse={createClusterResponse}
        resetResponse={resetResponse}
      />
    );
  }

  return null;
};

CreateClusterErrorModal.propTypes = {
  onRetry: PropTypes.func,
};

export default CreateClusterErrorModal;
