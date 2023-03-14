import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Button } from '@patternfly/react-core';
import { TimesCircleIcon } from '@patternfly/react-icons';

import DeleteClusterDialog from '../DeleteClusterDialog';

function CancelClusterButton({ cluster }) {
  const history = useHistory();
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="link"
        icon={<TimesCircleIcon />}
        className="pf-u-mr-md"
        onClick={() => setIsCancelModalOpen(true)}
        isInline
      >
        Cancel cluster creation
      </Button>
      {isCancelModalOpen && (
        <DeleteClusterDialog
          title="Cancel cluster creation"
          titleIconVariant="warning"
          textContent="By canceling the cluster creation, you are deleting all the cluster setup and
          configuration. Once the deletion is completed, you will be redirected to the
          cluster list page."
          modalData={{
            clusterID: cluster.id,
            clusterName: cluster.name,
          }}
          onClose={() => setIsCancelModalOpen(false)}
          onSuccess={() => history.push('/')}
        />
      )}
    </>
  );
}

CancelClusterButton.propTypes = {
  cluster: PropTypes.object.isRequired,
};

export default CancelClusterButton;
