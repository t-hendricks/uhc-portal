import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeaderMain,
  CardTitle,
} from '@patternfly/react-core';

import AddOnStateLabel from '../AddOnStateLabel';

import './AddOnsCard.scss';

class AddOnsCard extends Component {
  // reduce card description to 60 chars for uniform cards
  reduceCardDescription = (addOn) => {
    const descriptionLength = 60;
    return addOn.description.length > descriptionLength
      ? `${addOn.description.substring(0, descriptionLength - 3)}...`
      : addOn.description;
  };

  render() {
    const { addOn, installedAddOn, requirements, activeCard, onClick } = this.props;

    return (
      <Card
        isHoverable
        isSelectable
        isSelected={activeCard === addOn.id}
        key={addOn.id}
        ouiaId={`card-addon-${addOn.id}`}
        onClick={onClick}
        className="ocm-c-addons__card"
      >
        <CardHeader className="ocm-c-addons__card--header">
          <CardHeaderMain>
            {addOn.icon && <img alt={addOn.name} src={`data:image/png;base64,${addOn.icon}`} />}
          </CardHeaderMain>
        </CardHeader>
        <CardTitle>{addOn.name}</CardTitle>
        <CardBody className="ocm-c-addons__card--body">
          {this.reduceCardDescription(addOn)}
        </CardBody>
        <CardFooter>
          <AddOnStateLabel
            addOn={addOn}
            requirements={requirements}
            installedAddOn={installedAddOn}
          />
        </CardFooter>
      </Card>
    );
  }
}

AddOnsCard.propTypes = {
  addOn: PropTypes.object.isRequired,
  installedAddOn: PropTypes.object,
  requirements: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  activeCard: PropTypes.string,
};

export default AddOnsCard;
