import React from 'react';

import { useWizardFooter } from '@patternfly/react-core/next';

import { useGlobalState } from '~/redux/hooks/useGlobalState';
import CreateClusterErrorModal from '~/components/clusters/common/CreateClusterErrorModal';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { StepId } from '~/components/clusters/wizards/osd/constants';
import { ReviewAndCreateContent } from './ReviewAndCreateContent';

interface ReviewAndCreateProps {
  track(): void;
}

export const ReviewAndCreate = ({ track }: ReviewAndCreateProps) => {
  const { submitForm } = useFormState();
  const createClusterResponse = useGlobalState((state) => state.clusters.createdCluster);
  const [isErrorModalOpen, setIsErrorModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (createClusterResponse.error && !isErrorModalOpen) {
      setIsErrorModalOpen(true);
    }
  }, [createClusterResponse.error, isErrorModalOpen]);

  useWizardFooter(
    React.useMemo(
      () => ({
        nextButtonText: 'Create cluster',
        onNext: () => {
          submitForm();
          track();
        },
      }),
      [submitForm, track],
    ),
    StepId.Review,
  );

  return (
    <div className="pf-u-mb-md">
      <ReviewAndCreateContent isPending={createClusterResponse.pending} />
      {isErrorModalOpen && <CreateClusterErrorModal onRetry={submitForm} />}
    </div>
  );
};
