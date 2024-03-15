import React from 'react';
import { Button, ButtonVariant, HelperText, HelperTextItem } from '@patternfly/react-core';
import {
  Dropdown as DropdownDeprecated,
  DropdownPosition as DropdownPositionDeprecated,
  DropdownToggle as DropdownToggleDeprecated,
  DropdownItem as DropdownItemDeprecated,
} from '@patternfly/react-core/deprecated';
import { Link } from 'react-router-dom-v5-compat';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { HCP_ROSA_GETTING_STARTED_PAGE } from '~/redux/constants/featureConstants';
import { isRestrictedEnv } from '~/restrictedEnv';

interface CreateClusterDropDownProps {
  toggleId?: string;
}

const getStartedPath = '/create/rosa/getstarted';

const CreateButtonLink = (props: any) => <Link {...props} to={getStartedPath} />;

const CreateClusterDropDown = ({ toggleId }: CreateClusterDropDownProps) => {
  const [isOpen, setOpen] = React.useState(false);
  const dropDownRef = React.useRef<HTMLButtonElement>(null);
  const showHCPDirections = useFeatureGate(HCP_ROSA_GETTING_STARTED_PAGE) && !isRestrictedEnv();

  const onDropDownFocus = () => {
    dropDownRef.current?.focus();
  };

  const onDropDownSelect = () => {
    setOpen(false);
    onDropDownFocus();
  };

  const dropdownItems = [
    <DropdownItemDeprecated
      key="getstarted"
      component={
        <Link id="with-cli" to={getStartedPath}>
          With CLI
          {showHCPDirections ? (
            <HelperText data-testid="cli-helper">
              <HelperTextItem variant="indeterminate">
                Supports ROSA with Hosted Control Plane and Classic.
              </HelperTextItem>
            </HelperText>
          ) : null}
        </Link>
      }
    />,

    <DropdownItemDeprecated
      key="wizard"
      component={
        <Link id="with-web" to="/create/rosa/wizard">
          With web interface
          {showHCPDirections ? (
            <HelperText data-testid="wizard-helper">
              <HelperTextItem variant="indeterminate">
                Supports ROSA Classic. ROSA with Hosted Control Plane coming soon.
              </HelperTextItem>
            </HelperText>
          ) : null}
        </Link>
      }
    />,
  ];

  return (
    <>
      <DropdownDeprecated
        onSelect={onDropDownSelect}
        toggle={
          <DropdownToggleDeprecated
            id={toggleId}
            ref={dropDownRef}
            toggleVariant={ButtonVariant.primary}
            onToggle={(_event, isOpen) => setOpen(isOpen)}
            className="create-button"
          >
            Create cluster
          </DropdownToggleDeprecated>
        }
        isOpen={isOpen}
        dropdownItems={dropdownItems}
        position={DropdownPositionDeprecated.right}
        data-testid="rosa-create-cluster-button"
      />
      <br />
      <Button variant="link" className="create-button" component={CreateButtonLink}>
        Prerequisites
      </Button>
    </>
  );
};

export default CreateClusterDropDown;
