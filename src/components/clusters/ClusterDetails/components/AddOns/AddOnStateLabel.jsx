import React from 'react';
import PropTypes from 'prop-types';

import {
  Label,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  UnknownIcon,
  CubesIcon,
} from '@patternfly/react-icons';

import { hasRequirements } from './AddOnsHelper';

import AddOnsConstants from './AddOnsConstants';

// returns label based on current state of installed addon
function AddOnStateLabel(props) {
  const {
    addOn,
    installedAddOn,
    requirements,
  } = props;

  if (hasRequirements(addOn) && !requirements.fulfilled) {
    return (
      <Label variant="outline" color="red" icon={<CubesIcon />}>
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
        <Label variant="outline" icon={<InProgressIcon />}>
          Installing
        </Label>
      );
    case AddOnsConstants.INSTALLATION_STATE.UPDATING:
      return (
        <Label variant="outline" icon={<InProgressIcon />}>
          Updating
        </Label>
      );
    case AddOnsConstants.INSTALLATION_STATE.DELETED:
    case AddOnsConstants.INSTALLATION_STATE.DELETING:
      return (
        <Label variant="outline" icon={<InProgressIcon />}>
          Uninstalling
        </Label>
      );
    case AddOnsConstants.INSTALLATION_STATE.FAILED:
      return (
        <Label variant="outline" color="red" icon={<ExclamationCircleIcon />}>
          Add-on failed
        </Label>
      );
    case AddOnsConstants.INSTALLATION_STATE.READY:
      return (
        <Label variant="outline" color="green" icon={<CheckCircleIcon />}>
          Installed
        </Label>
      );
    default:
      return (
        <Label variant="outline" icon={<UnknownIcon />}>
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
