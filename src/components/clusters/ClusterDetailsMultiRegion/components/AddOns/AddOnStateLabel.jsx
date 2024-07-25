import React from 'react';
import PropTypes from 'prop-types';

import { Label } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { InProgressIcon } from '@patternfly/react-icons/dist/esm/icons/in-progress-icon';
import { UnknownIcon } from '@patternfly/react-icons/dist/esm/icons/unknown-icon';

import AddOnsConstants from './AddOnsConstants';
import { hasRequirements } from './AddOnsHelper';

// returns label based on current state of installed addon
function AddOnStateLabel(props) {
  const { addOn, installedAddOn, requirements } = props;

  if (hasRequirements(addOn) && !requirements.fulfilled) {
    return (
      <Label variant="outline" color="red" icon={<CubesIcon data-icon="cubes" />}>
        Prerequisites not met
      </Label>
    );
  }

  if (!installedAddOn) {
    return '';
  }

  switch (installedAddOn.state) {
    case undefined:
      return '';
    case AddOnsConstants.INSTALLATION_STATE.PENDING:
    case AddOnsConstants.INSTALLATION_STATE.INSTALLING:
      return (
        <Label variant="outline" icon={<InProgressIcon data-icon="inProgress" />}>
          Installing
        </Label>
      );
    case AddOnsConstants.INSTALLATION_STATE.UPDATING:
      return (
        <Label variant="outline" icon={<InProgressIcon data-icon="inProgress" />}>
          Updating
        </Label>
      );
    case AddOnsConstants.INSTALLATION_STATE.DELETED:
    case AddOnsConstants.INSTALLATION_STATE.DELETING:
    case AddOnsConstants.INSTALLATION_STATE.DELETE_PENDING:
      return (
        <Label variant="outline" icon={<InProgressIcon data-icon="inProgress" />}>
          Uninstalling
        </Label>
      );
    case AddOnsConstants.INSTALLATION_STATE.FAILED:
      return (
        <Label
          variant="outline"
          color="red"
          icon={<ExclamationCircleIcon data-icon="exclamationCircle" />}
        >
          Add-on failed
        </Label>
      );
    case AddOnsConstants.INSTALLATION_STATE.READY:
      return (
        <Label variant="outline" color="green" icon={<CheckCircleIcon data-icon="checkCircle" />}>
          Installed
        </Label>
      );
    default:
      return (
        <Label variant="outline" icon={<UnknownIcon data-icon="unknown" />}>
          Unknown
        </Label>
      );
  }
}

AddOnStateLabel.propTypes = {
  addOn: PropTypes.object,
  installedAddOn: PropTypes.object,
  requirements: PropTypes.object,
};

export default AddOnStateLabel;
