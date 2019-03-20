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
import { withRouter } from 'react-router-dom';
import {
  Brand,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  KebabToggle,
  PageHeader,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { noop } from '../../common/helpers';
import rhProductTitle from '../../styles/images/logo.png';
import config from '../../config';

class Header extends React.Component {
  state = {
    isUserDropdownOpen: false,
    isKebabDropdownOpen: false,
  };

  onUserDropdownToggle = (isUserDropdownOpen) => {
    this.setState({
      isUserDropdownOpen,
    });
  };

  onUserDropdownSelect = () => {
    this.setState(prevState => ({
      isUserDropdownOpen: !prevState.isUserDropdownOpen,
    }));
  };

  onKebabDropdownToggle = (isKebabDropdownOpen) => {
    this.setState({
      isKebabDropdownOpen,
    });
  };

  onKebabDropdownSelect = () => {
    this.setState(prevState => ({
      isKebabDropdownOpen: prevState.isKebabDropdownOpen,
    }));
  };

  render() {
    const {
      isLoggedIn, userProfile, logoutUser, history,
    } = this.props;
    const { isUserDropdownOpen, isKebabDropdownOpen } = this.state;
    let displayName = (userProfile.keycloakProfile.name
                       || userProfile.keycloakProfile.preferred_username);
    if (userProfile.organization.fulfilled && userProfile.organization.details.name) {
      displayName += ` (${userProfile.organization.details.name})`;
    }
    return (
      <PageHeader
        className="uhc_header"
        logo={<Brand src={rhProductTitle} alt="Red Hat OpenShift" />}
        logoProps={{
          onClick: () => {
            history.push('/');
          },
        }}
        toolbar={(
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
)}
      />
    );
  }
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
  userProfile: PropTypes.object.isRequired,
  logoutUser: PropTypes.func,
  history: PropTypes.object,
};

Header.defaultProps = {
  logoutUser: noop,
  isLoggedIn: false,
};

export default withRouter(Header);
