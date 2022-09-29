import React from 'react';
import PropTypes from 'prop-types';

import './AddOnsDrawer.scss';

import { Button, FlexItem, Popover } from '@patternfly/react-core';

import { PencilAltIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

import { hasParameters, parameterAndValue } from '../AddOnsHelper';

import AddOnsParametersModal from '../AddOnsParametersModal';

function AddOnsParameterList(props) {
  const { installedAddOn, activeCard, activeCardID, cluster, openModal } = props;

  // render addon parameters list and link to configuration of parameters
  if (installedAddOn && activeCard && hasParameters(activeCard)) {
    // get addon installation parameter object
    const paramObjects = parameterAndValue(installedAddOn, activeCard, cluster);
    const paramItems = Object.entries(paramObjects.parameters).map(([key, param]) => (
      <p key={key}>
        <b className="parameter-list-key">{param.name}</b>{' '}
        <Popover
          aria-label="param-popover"
          headerContent={<div>{param.name}</div>}
          bodyContent={<div>{param.description}</div>}
        >
          <Button
            isInline
            variant="link"
            icon={<OutlinedQuestionCircleIcon className="ocm-addons-tab--parameter-tooltip-icon" />}
          />
        </Popover>{' '}
        {param.value}
      </p>
    ));

    // return list of parameters and configure link
    return (
      <FlexItem>
        <p className="ocm-addons-tab--configuration-title">
          Configuration
          <Button
            ouiaId={`update-addon-${activeCardID}`}
            variant="link"
            isDisabled={!cluster.canEdit}
            icon={<PencilAltIcon className="ocm-addons-tab--configuration-title-icon" />}
            onClick={() =>
              openModal('add-ons-parameters-modal', {
                clusterID: cluster.id,
                addOn: activeCard,
                addOnInstallation: installedAddOn,
                isUpdateForm: true,
              })
            }
          />
        </p>
        {paramItems}
        <AddOnsParametersModal clusterID={cluster.id} />
      </FlexItem>
    );
  }
  return '';
}

AddOnsParameterList.propTypes = {
  installedAddOn: PropTypes.object,
  activeCard: PropTypes.object,
  activeCardID: PropTypes.string,
  cluster: PropTypes.object,
  openModal: PropTypes.func.isRequired,
};

export default AddOnsParameterList;
