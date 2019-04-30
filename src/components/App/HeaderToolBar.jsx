/*
Copyright (c) 2018 Red Hat, Inc.

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

import React from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  KebabToggle,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { noop } from '../../common/helpers';
import config from '../../config';

const getUserDisplayName = (keycloakProfile) => {
  // concat full name from first and last, if either exist
  const fullNameArr = [];
  if (keycloakProfile.first_name) {
    fullNameArr.push(keycloakProfile.first_name);
  }
  if (keycloakProfile.last_name) {
    fullNameArr.push(keycloakProfile.last_name);
  }
  // using an array with join makes sure there are no needless spaces if only one name exists.
  const fullName = fullNameArr.length !== 0 ? fullNameArr.join(' ') : undefined;

  // this logic allows fallsbacks for different ways to get a user's display name,
  // so no matter what they have, they'll at least see *something* useful.
  return keycloakProfile.name
         || keycloakProfile.preferred_username
         || fullName
         || keycloakProfile.username
         || keycloakProfile.email;
};

class HeaderToolBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserDropdownOpen: false,
      isKebabDropdownOpen: false,
    };
  }

  onUserDropdownToggle = (isUserDropdownOpen) => {
    this.setState({
      isUserDropdownOpen,
    });
  }

  onUserDropdownSelect = () => {
    this.setState(prevState => ({
      isUserDropdownOpen: !prevState.isUserDropdownOpen,
    }));
  }

  onKebabDropdownToggle = (isKebabDropdownOpen) => {
    this.setState({
      isKebabDropdownOpen,
    });
  }

  onKebabDropdownSelect = () => {
    this.setState(prevState => ({
      isKebabDropdownOpen: prevState.isKebabDropdownOpen,
    }));
  }


  render() {
    const {
      isLoggedIn, userProfile, logoutUser,
    } = this.props;
    const { isUserDropdownOpen, isKebabDropdownOpen } = this.state;

    let displayName = getUserDisplayName(userProfile.keycloakProfile);

    if (userProfile.organization.fulfilled && userProfile.organization.details.name) {
      displayName += ` (${userProfile.organization.details.name})`;
    }
    return (
      <Toolbar>
        {isLoggedIn && (
          <ToolbarGroup>
            {/* mobile -- kebab dropdown (| logout)] */}
            <ToolbarItem className="pf-u-hidden-on-md pf-u-mr-0">
              <Dropdown
                isPlain
                position="right"
                onSelect={this.onKebabDropdownSelect}
                toggle={<KebabToggle onToggle={this.onKebabDropdownToggle} />}
                isOpen={isKebabDropdownOpen}
                dropdownItems={[
                  <DropdownItem
                    key="profile"
                    href={`${config.configData.keycloak.url}/realms/${
                      config.configData.keycloak.realm
                    }/account`}
                    target="_blank"
                  >
                    View Profile
                  </DropdownItem>,
                  <DropdownItem key="logout" onClick={logoutUser}>
                    Logout
                  </DropdownItem>,
                ]}
              />
            </ToolbarItem>
            {/* desktop -- (user dropdown [logout]) */}
            <ToolbarItem className="pf-u-sr-only pf-u-visible-on-md">
              <Dropdown
                isPlain
                position="right"
                onSelect={this.onUserDropdownSelect}
                isOpen={isUserDropdownOpen}
                toggle={(
                  <DropdownToggle onToggle={this.onUserDropdownToggle}>
                    {displayName}
                  </DropdownToggle>
                )}
                dropdownItems={[
                  <DropdownItem
                    key="profile"
                    href={`${config.configData.keycloak.url}/realms/${
                      config.configData.keycloak.realm
                    }/account`}
                    target="_blank"
                  >
                    View Profile
                  </DropdownItem>,
                  <DropdownItem key="logout" onClick={logoutUser}>
                    Logout
                  </DropdownItem>,
                ]}
              />
            </ToolbarItem>
          </ToolbarGroup>
        )}
      </Toolbar>
    );
  }
}

HeaderToolBar.propTypes = {
  isLoggedIn: PropTypes.bool,
  userProfile: PropTypes.object.isRequired,
  logoutUser: PropTypes.func,
};

HeaderToolBar.defaultProps = {
  logoutUser: noop,
  isLoggedIn: false,
};

export default HeaderToolBar;
