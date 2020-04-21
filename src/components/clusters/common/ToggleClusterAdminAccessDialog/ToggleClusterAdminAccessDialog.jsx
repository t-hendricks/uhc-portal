import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../../../common/Modal/Modal';
import ErroBox from '../../../common/ErrorBox';

class ToggleClusterAdminAccessDialog extends React.Component {
  componentDidUpdate() {
    const {
      toggleClusterAdminResponse, clearToggleClusterAdminResponse, closeModal,
    } = this.props;

    if (toggleClusterAdminResponse.fulfilled) {
      clearToggleClusterAdminResponse();
      closeModal();
    }
  }

  render() {
    const {
      toggleClusterAdminAccess,
      toggleClusterAdminResponse,
      isOpen,
      closeModal,
      modalData,
      clusterGroupUsers,
    } = this.props;

    const errorContainer = toggleClusterAdminResponse.error && (
    <ErroBox message="Error deleting cluster" response={toggleClusterAdminResponse} />
    );

    const isPending = toggleClusterAdminResponse.pending;

    const submit = () => {
      toggleClusterAdminAccess(modalData.id, !!(modalData.cluster_admin_enabled));
    };

    const hasClusterAdmins = () => {
      const anyClusterAdmin = clusterGroupUsers.find((user) => {
        // parse the url to get the user group
        const userHrefPathSections = user.href.match(/[^/?]*[^/?]/g);
        const userGroup = userHrefPathSections[6];

        return userGroup === 'cluster-admins';
      });
      return !!anyClusterAdmin;
    };

    const getModalTitleAndText = () => {
      if (modalData.cluster_admin_enabled) {
        if (hasClusterAdmins()) {
          return {
            title: 'Cannot disable cluster-admin access.',
            text:
  <>
            You cannot disable cluster-admin access because that role has been assigned to users.
            Delete all cluster-admin users and try again.
  </>,
          };
        }
        return {
          title: 'Remove cluster-admin access?',
          text:
  <>
                  You will not be able to assign cluster-admin role,
                  and no one from your organization will have cluster-admin access.
  </>,
        };
      }
      return {
        title: 'Allow cluster-admin access?',
        text:
  <>
        Users with this level of access privilege can cause irreparable damage to the cluster.
        Per the
    <a href="https://www.redhat.com/en/about/agreements" target="_blank" rel="noopener noreferrer">Terms of Service</a>
        &nbsp;Red Hat is not responsible for problems caused by cluster-admin users.
  </>,
      };
    };

    const modalStrings = getModalTitleAndText();

    return isOpen && (
    <Modal
      title={modalStrings.title}
      onClose={closeModal}
      primaryText={!modalData.cluster_admin_enabled ? 'Allow access' : 'Remove access'}
      secondaryText="cancel"
      onPrimaryClick={() => submit()}
      onSecondaryClick={closeModal}
      isPrimaryDisabled={isPending || (modalData.cluster_admin_enabled && hasClusterAdmins())}
      isPending={isPending}
    >
      <>
        {errorContainer}
        {modalStrings.text}
      </>
    </Modal>
    );
  }
}

ToggleClusterAdminAccessDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  modalData: PropTypes.object,
  toggleClusterAdminAccess: PropTypes.func.isRequired,
  toggleClusterAdminResponse: PropTypes.object,
  clearToggleClusterAdminResponse: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  clusterGroupUsers: PropTypes.array.isRequired,
};


export default ToggleClusterAdminAccessDialog;
