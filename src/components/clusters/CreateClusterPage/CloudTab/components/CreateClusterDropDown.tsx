import React, { useRef } from 'react';
import { Link } from 'react-router-dom-v5-compat';

import {
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuItemProps,
  MenuToggle,
} from '@patternfly/react-core';

interface CreateClusterDropDownProps {
  toggleId?: string;
}

const getStartedPath = '/create/rosa/getstarted';

const CreateButtonLink = (props: any) => <Link {...props} to={getStartedPath} />;

const CreateClusterDropDown = ({ toggleId }: CreateClusterDropDownProps) => {
  const [isDropDownOpen, setIsDropDownOpen] = React.useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const dropDownRef = React.useRef<HTMLButtonElement>(null);

  const cliItem: MenuItemProps['component'] = (props) => (
    <Link {...props} id="with-cli" to={getStartedPath}>
      With CLI
    </Link>
  );

  const wizardItem: MenuItemProps['component'] = (props) => (
    <Link {...props} id="with-web" to="/create/rosa/wizard">
      With web interface
    </Link>
  );

  const newDropdownItems = (
    <DropdownList>
      <DropdownItem key="action" component={cliItem} />
      <DropdownItem key="wizard" component={wizardItem} />
    </DropdownList>
  );

  const onToggleClick = () => {
    setIsDropDownOpen(!isDropDownOpen);
    dropDownRef.current?.focus();
  };
  const onSelect = () => {
    setIsDropDownOpen(false);
    dropDownRef.current?.focus();
  };

  return (
    <>
      <Dropdown
        ref={dropDownRef}
        isOpen={isDropDownOpen}
        onSelect={onSelect}
        onOpenChange={(isOpen) => setIsDropDownOpen(isOpen)}
        popperProps={{ appendTo: () => document.body }}
        toggle={{
          toggleRef: menuToggleRef,
          toggleNode: (
            <MenuToggle
              id={toggleId}
              ref={menuToggleRef}
              onClick={onToggleClick}
              isExpanded={isDropDownOpen}
              variant={ButtonVariant.primary}
              className="create-button"
              data-testid="rosa-create-cluster-button"
            >
              Create cluster
            </MenuToggle>
          ),
        }}
      >
        {newDropdownItems}
      </Dropdown>

      <br />
      <Button variant="link" className="create-button" component={CreateButtonLink}>
        Prerequisites
      </Button>
    </>
  );
};

export default CreateClusterDropDown;
