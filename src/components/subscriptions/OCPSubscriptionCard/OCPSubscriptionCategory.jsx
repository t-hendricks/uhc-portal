import PropTypes from 'prop-types';
import React from 'react';
import {
  Stack,
  StackItem,
} from '@patternfly/react-core';

import PopoverHint from '../../common/PopoverHint';


function OCPSubscriptionCategory({
  labelText,
  labelIcon,
  labelClass,
  labelHint = '',
  items,
}) {
  if (items.length === 0) { return null; }

  const categoryHeader = (
    <Stack className="status-group status-group-header">
      <StackItem className={`status-label ${labelClass}`}>
        {labelIcon}
        {labelText}
        {labelHint && <PopoverHint hint={labelHint} />}
      </StackItem>
    </Stack>
  );

  const categoryItems = items.map(item => (
    <Stack key={item.status} className="status-group">
      {item.text && (
        <StackItem>
          {item.text}
          {item.hint && <PopoverHint hint={item.hint} />}
        </StackItem>
      )}
      <StackItem>
        {item.link}
      </StackItem>
    </Stack>
  ));

  return (
    <>
      {categoryHeader}
      {categoryItems}
    </>
  );
}

OCPSubscriptionCategory.propTypes = {
  labelText: PropTypes.string.isRequired,
  labelIcon: PropTypes.element.isRequired,
  labelClass: PropTypes.string.isRequired,
  labelHint: PropTypes.string,
  items: PropTypes.array.isRequired,
};

export default OCPSubscriptionCategory;
