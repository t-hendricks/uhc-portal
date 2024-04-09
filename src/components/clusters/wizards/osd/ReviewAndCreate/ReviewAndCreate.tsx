import React from 'react';

import CreateClusterErrorModal from '~/components/clusters/common/CreateClusterErrorModal';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { useGlobalState } from '~/redux/hooks/useGlobalState';

import { ReviewAndCreateContent } from './ReviewAndCreateContent';

export const ReviewAndCreate = () => {
  const { submitForm } = useFormState();
  const createClusterResponse = useGlobalState((state) => state.clusters.createdCluster);
  const [isErrorModalOpen, setIsErrorModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (createClusterResponse.error && !isErrorModalOpen) {
      setIsErrorModalOpen(true);
    }
  }, [createClusterResponse.error, isErrorModalOpen]);

  return (
    <div className="pf-v5-u-mb-md">
      <ReviewAndCreateContent isPending={createClusterResponse.pending} />
      {isErrorModalOpen && <CreateClusterErrorModal onRetry={submitForm} />}
    </div>
  );
};
