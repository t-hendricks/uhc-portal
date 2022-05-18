import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { resetCreatedClusterResponse } from '../../../../redux/actions/clustersActions';
import ErrorModal from '../../../common/ErrorModal';
import MissingPrereqErrorModal from '../MissingPrereqErrorModal';

const ErrorKey = {
  AwsCredsNotOsdCcsAdmin: 'AWSCredsNotOSDCCSAdmin',
};

const CreateClusterErrorModal = ({ onRetry }) => {
  const dispatch = useDispatch();
  const createClusterResponse = useSelector(state => state.clusters.createdCluster);
  const resetResponse = () => dispatch(resetCreatedClusterResponse());
  const { error: createClusterError } = createClusterResponse;

  if (createClusterError) {
    const errorResponseDetails = createClusterResponse.errorDetails?.[0];

    switch (errorResponseDetails?.Error_Key) {
      case ErrorKey.AwsCredsNotOsdCcsAdmin:
        return <MissingPrereqErrorModal onRetry={onRetry} onClose={resetResponse} />;
      default:
        return (
          <ErrorModal
            title="Error creating cluster"
            errorResponse={createClusterResponse}
            resetResponse={resetResponse}
          />
        );
    }
  }

  return null;
};

CreateClusterErrorModal.propTypes = {
  onRetry: PropTypes.func,
};

export default CreateClusterErrorModal;
