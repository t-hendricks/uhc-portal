import React from 'react';
import { Chip, ChipGroup } from '@patternfly/react-core';
import { SecurityGroup } from '~/types/clusters_mgmt.v1';

// We increase Patternfly's maximum length of 16ch, due to https://github.com/patternfly/patternfly-react/issues/9690.
// The tooltip won't show when mounted but not being visible (e.g. in an ExpandableSection)
const SECURITY_GROUPS_NAME_MAX_WIDTH = '50ch';

const SecurityGroupsViewList = ({
  securityGroups,
  isReadOnly,
  emptyMessage,
  onClickItem,
}: {
  securityGroups: SecurityGroup[];
  isReadOnly: boolean;
  emptyMessage?: string;
  onClickItem?: (groupId: string) => void;
}) => {
  const itemCount = securityGroups.length;
  if (itemCount === 0) {
    return emptyMessage ? (
      <div className="pf-u-font-size-sm pf-u-disabled-color-100">{emptyMessage}</div>
    ) : null;
  }
  return (
    <ChipGroup className="pf-u-mb-lg" numChips={itemCount}>
      {securityGroups.map((sg) => {
        const { id = '' } = sg;
        const onClick = onClickItem ? () => onClickItem(id) : undefined;
        return (
          <Chip
            id={id}
            key={id}
            isReadOnly={isReadOnly}
            onClick={onClick}
            textMaxWidth={SECURITY_GROUPS_NAME_MAX_WIDTH}
          >
            {sg.name || id}
          </Chip>
        );
      })}
    </ChipGroup>
  );
};
export default SecurityGroupsViewList;
