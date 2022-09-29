import React from 'react';
import PropTypes from 'prop-types';

import './AddOnsDrawer.scss';

import { List, ListItem } from '@patternfly/react-core';

function AddOnsRequirementContent(props) {
  const { activeCardRequirements } = props;

  return (
    <List>
      {activeCardRequirements?.map((req) => (
        <ListItem key={req}>{req}</ListItem>
      ))}
    </List>
  );
}

AddOnsRequirementContent.propTypes = {
  activeCardRequirements: PropTypes.array,
};

export default AddOnsRequirementContent;
