import React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import { Button } from '@patternfly/react-core';
import { TimesCircleIcon } from '@patternfly/react-icons/dist/esm/icons/times-circle-icon';

import DeleteClusterDialog from '../DeleteClusterDialog';

function CancelClusterButton({ cluster, defaultOpen }) {
  const navigate = useNavigate();
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(defaultOpen);

  return (
    <>
      <Button
        variant="link"
        icon={<TimesCircleIcon />}
        className="pf-v5-u-mr-md"
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
          onSuccess={() => navigate('/')}
        />
      )}
    </>
  );
}

CancelClusterButton.propTypes = {
  cluster: PropTypes.object.isRequired,
  defaultOpen: PropTypes.bool,
};
CancelClusterButton.defaultProps = {
  defaultOpen: false,
};
export default CancelClusterButton;
