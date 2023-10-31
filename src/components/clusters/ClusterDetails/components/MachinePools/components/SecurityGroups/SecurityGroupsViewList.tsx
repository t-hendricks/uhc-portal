import React from 'react';
import { Chip, ChipGroup } from '@patternfly/react-core';
import { SecurityGroup } from '~/types/clusters_mgmt.v1';

import WithTooltip from '~/components/common/WithTooltip';

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
    <WithTooltip
      showTooltip={isReadOnly}
      content="This option cannot be edited from its original setting selection."
    >
      <ChipGroup className="pf-u-mb-lg" numChips={itemCount}>
        {securityGroups.map((sg) => {
          const { id = '' } = sg;
          const onClick = onClickItem ? () => onClickItem(id) : undefined;
          return (
            <Chip id={id} key={id} isReadOnly={isReadOnly} onClick={onClick}>
              {sg.name || id}
            </Chip>
          );
        })}
      </ChipGroup>
    </WithTooltip>
  );
};
export default SecurityGroupsViewList;
