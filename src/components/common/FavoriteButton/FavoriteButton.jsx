import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { StarIcon } from '@patternfly/react-icons';

function FavoriteButton({ isActive, children }) {
  const starIcon = isActive
    ? (<StarIcon color="var(--pf-global--active-color--100)" />)
    : (<StarIcon color="var(--pf-global--disabled-color--100)" />);

  return (
    <Button isDisabled variant="link" icon={starIcon} className="favorite-button">
      { children }
    </Button>
  );
}

FavoriteButton.propTypes = {
  children: PropTypes.any,
  isActive: PropTypes.bool,
};

export default FavoriteButton;
