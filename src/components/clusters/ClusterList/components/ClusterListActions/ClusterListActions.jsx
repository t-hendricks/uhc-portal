/*
Copyright (c) 2021 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { useState } from 'react';
import { Button, ToolbarItem, Split, SplitItem } from '@patternfly/react-core';
import {
  Dropdown as DropdownDeprecated,
  DropdownItem as DropdownItemDeprecated,
  DropdownPosition as DropdownPositionDeprecated,
  KebabToggle as KebabToggleDeprecated,
} from '@patternfly/react-core/deprecated';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isRestrictedEnv } from '~/restrictedEnv';

const useMediaQuery = (query) => {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
    return false;
  }

  const mediaQuery = window.matchMedia(query);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [match, setMatch] = React.useState(!!mediaQuery.matches);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    const handler = () => setMatch(!!mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return match;
};

const dropdownRegisterCluster = (
  <DropdownItemDeprecated
    component="button"
    key="registercluster"
    data-testid="register-cluster-item"
  >
    <div>
      <Link to="/register" className="pf-v5-c-dropdown__menu-item">
        Register disconnected cluster
      </Link>
    </div>
  </DropdownItemDeprecated>
);
const toolbarViewArchivedClusters = (
  <ToolbarItem key="archived" alignSelf="center">
    <Link to="/archived">View cluster archives</Link>
  </ToolbarItem>
);
const dropdownArchived = (
  <DropdownItemDeprecated component="button" key="archived">
    <div>
      <Link to="/archived" className="pf-v5-c-dropdown__menu-item">
        View cluster archives
      </Link>
    </div>
  </DropdownItemDeprecated>
);
const toolbarCreateCluster = (
  <ToolbarItem key="createcluster">
    <Link
      to="/create"
      role="button"
      className="pf-v5-c-button pf-m-primary"
      data-testid="create_cluster_btn"
    >
      Create cluster
    </Link>
  </ToolbarItem>
);
const toolbarRegisterCluster = (
  <ToolbarItem key="registercluster">
    <Link to="/register" rel="noopener noreferrer">
      <Button variant="secondary" data-testid="register-cluster-item">
        Register cluster
      </Button>
    </Link>
  </ToolbarItem>
);

const useItems = (isDashboardView) => {
  const wide = useMediaQuery('(min-width: 900px)');

  const toolbarItems = [];
  const dropdownItems = [];

  toolbarItems.push(toolbarCreateCluster);
  if (!isRestrictedEnv()) {
    if (isDashboardView) {
      if (wide) {
        toolbarItems.push(toolbarRegisterCluster);
        dropdownItems.push(dropdownArchived);
      } else {
        dropdownItems.push(dropdownRegisterCluster);
        dropdownItems.push(dropdownArchived);
      }
    } else if (wide) {
      toolbarItems.push(toolbarRegisterCluster);
      toolbarItems.push(toolbarViewArchivedClusters);
    } else {
      dropdownItems.push(dropdownRegisterCluster);
      dropdownItems.push(dropdownArchived);
    }
  }

  return [dropdownItems, toolbarItems];
};

const ClusterListActions = ({ className, isDashboardView }) => {
  const [isOpen, onToggle] = useState(false);
  const [dropdownItems, toolbarItems] = useItems(isDashboardView);
  if (isDashboardView) {
    return (
      <>
        <Split hasGutter>
          {toolbarItems.map((toolbarItem) => (
            <SplitItem key="toolbar">{toolbarItem}</SplitItem>
          ))}
          <SplitItem key="dropdown">
            <DropdownDeprecated
              data-testid="cluster-list-extra-actions-dropdown"
              onSelect={() => onToggle(!isOpen)}
              toggle={<KebabToggleDeprecated onToggle={(_event, value) => onToggle(value)} />}
              isOpen={isOpen}
              isPlain
              dropdownItems={dropdownItems}
              className={className}
              position={DropdownPositionDeprecated.right}
            />
          </SplitItem>
        </Split>
      </>
    );
  }
  return (
    <>
      {toolbarItems}
      {dropdownItems.length > 0 && (
        <ToolbarItem>
          <DropdownDeprecated
            onSelect={() => onToggle(!isOpen)}
            toggle={<KebabToggleDeprecated onToggle={(_event, value) => onToggle(value)} />}
            isOpen={isOpen}
            isPlain
            dropdownItems={dropdownItems}
            className={className}
            position={DropdownPositionDeprecated.right}
          />
        </ToolbarItem>
      )}
    </>
  );
};

ClusterListActions.propTypes = {
  className: PropTypes.string,
  isDashboardView: PropTypes.bool,
};

export default ClusterListActions;
