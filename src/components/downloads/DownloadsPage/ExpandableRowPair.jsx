import React from 'react';
import PropTypes from 'prop-types';

import { ExpandableRowContent, Tbody, Td, Tr } from '@patternfly/react-table';

import { expandKeys } from '../downloadsStructure';

/** An expandable pair of table rows. */
const ExpandableRowPair = ({ expanded, setExpanded, expandKey, cells, description, toolRefs }) => {
  const isExpanded = !!expanded[expandKey];
  const onToggle = (event, rowIndex, newOpen) => {
    setExpanded({ ...expanded, [expandKey]: newOpen });
  };
  return (
    <Tbody
      isExpanded={isExpanded}
      ref={toolRefs?.expandKey}
      data-testid={`expandable-row-${expandKey}`}
    >
      <Tr>
        <Td expand={{ isExpanded, onToggle, rowIndex: 0 }} />
        {cells}
      </Tr>
      <Tr isExpanded={isExpanded} data-testid={`expanded-row-${expandKey}`}>
        <Td colSpan={1 + cells.length}>
          <ExpandableRowContent>{description}</ExpandableRowContent>
        </Td>
      </Tr>
    </Tbody>
  );
};

ExpandableRowPair.propTypes = {
  // { [expandKey]: boolean }
  expanded: PropTypes.object,
  // callback to replace whole `expanded` map
  setExpanded: PropTypes.func,
  // { [expandKey]: ref } - to allow referring to specific row pairs
  toolRefs: PropTypes.object,
  // tool or other key for `expanded` array
  expandKey: PropTypes.oneOf(Object.values(expandKeys)),
  // array of `<Td>` cells for first row
  cells: PropTypes.arrayOf(PropTypes.node),
  // content for full-width description cell
  description: PropTypes.node,
};

export default ExpandableRowPair;
