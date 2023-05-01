import React from 'react';
import {
  Button,
  ButtonVariant,
  Dropdown,
  DropdownPosition,
  DropdownToggle,
  DropdownItem,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { HCP_ROSA_GETTING_STARTED_PAGE } from '~/redux/constants/featureConstants';

interface CreateClusterDropDownProps {
  toggleId?: string;
}

const getStartedPath = '/create/rosa/getstarted';

const CreateClusterDropDown = ({ toggleId }: CreateClusterDropDownProps) => {
  const [isOpen, setOpen] = React.useState(false);
  const dropDownRef = React.useRef<HTMLButtonElement>(null);
  const showHCPDirections = useFeatureGate(HCP_ROSA_GETTING_STARTED_PAGE);

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
      component={
        <Link id="with-cli" to={getStartedPath}>
          With CLI
          {showHCPDirections ? (
            <HelperText>
              <HelperTextItem variant="indeterminate">
                Supports ROSA with Hosted Control Plane (HCP) and Classic.
              </HelperTextItem>
            </HelperText>
          ) : null}
        </Link>
      }
    />,

    <DropdownItem
      key="wizard"
      component={
        <Link id="with-web" to="/create/rosa/wizard">
          With web interface
          {showHCPDirections ? (
            <HelperText>
              <HelperTextItem variant="indeterminate">
                Supports ROSA Classic. ROSA with HCP coming soon.
              </HelperTextItem>
            </HelperText>
          ) : null}
        </Link>
      }
    />,
  ];

  return (
    <>
      <Dropdown
        onSelect={onDropDownSelect}
        toggle={
          <DropdownToggle
            id={toggleId}
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
        position={DropdownPosition.right}
      />
      <br />
      <Button
        variant="link"
        className="create-button"
        component={(props: any) => <Link {...props} to={getStartedPath} />}
      >
        Prerequisites
      </Button>
    </>
  );
};

export default CreateClusterDropDown;
