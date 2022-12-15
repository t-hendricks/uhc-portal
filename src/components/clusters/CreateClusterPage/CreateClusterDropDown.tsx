import React from 'react';
import {
  Button,
  ButtonVariant,
  Dropdown,
  DropdownToggle,
  DropdownItem,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';

const CreateClusterDropDown = () => {
  const [isOpen, setOpen] = React.useState(false);
  const dropDownRef = React.useRef<HTMLButtonElement>(null);

  const onDropDownFocus = () => {
    dropDownRef.current?.focus();
  };

  const onDropDownSelect = () => {
    setOpen(false);
    onDropDownFocus();
  };

  const dropdownItems = [
    <DropdownItem
      key="getstarted"
      component={<Link to="/create/rosa/getstarted">With CLI </Link>}
    />,

    <DropdownItem
      key="wizard"
      component={<Link to="/create/rosa/wizard">With web interface</Link>}
    />,
  ];

  return (
    <>
      <Dropdown
        onSelect={onDropDownSelect}
        toggle={
          <DropdownToggle
            ref={dropDownRef}
            toggleVariant={ButtonVariant.primary}
            onToggle={setOpen}
            className="create-button"
          >
            Create cluster
          </DropdownToggle>
        }
        isOpen={isOpen}
        dropdownItems={dropdownItems}
      />
      <br />
      <Button
        variant="link"
        className="create-button"
        component={(props: any) => <Link {...props} to="/create/rosa/getstarted" />}
      >
        Prerequisites
      </Button>
    </>
  );
};

export default CreateClusterDropDown;
