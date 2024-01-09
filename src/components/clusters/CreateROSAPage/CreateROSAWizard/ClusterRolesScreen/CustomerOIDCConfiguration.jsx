import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Button,
  ClipboardCopy,
  ClipboardCopyVariant,
  Flex,
  FlexItem,
  FormGroup,
  Popover,
  Text,
  TextContent,
  TextVariants,
  Skeleton,
} from '@patternfly/react-core';
import ExternalLink from '~/components/common/ExternalLink';
import PopoverHint from '~/components/common/PopoverHint';
import Instruction from '~/components/common/Instruction';
import Instructions from '~/components/common/Instructions';
import FuzzySelect from '~/components/common/FuzzySelect';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import validators from '../../../../../common/validators';
import links from '../../../../../common/installLinks.mjs';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

function CreateOIDCProviderInstructions() {
  return (
    <Popover
      aria-label="oidc-creation-instructions"
      position="top"
      maxWidth="22rem"
      style={{ '--pf-v5-c-popover--c-button--sibling--PaddingRight': '2rem' }}
      bodyContent={
        <TextContent>
          <p>
            Create a new OIDC config ID by running the following command in your CLI. Then, refresh
            and select the new config ID from the dropdown.
          </p>
          <ClipboardCopy isReadOnly>rosa create oidc-config</ClipboardCopy>
        </TextContent>
      }
    >
      <Button variant="link" isInline>
        create a new OIDC config id
      </Button>
    </Popover>
  );
}

function CustomerOIDCConfiguration({
  awsAccountID,
  getUserOidcConfigurations,
  byoOidcConfigID,
  operatorRolesCliCommand,
  onSelect: onParentSelect,
  input: {
    // Redux Form's onBlur interferes with Patternfly's Select footer onClick handlers.
    onBlur: _onBlur,
    ...inputProps
  },
  meta: { error, touched },
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oidcConfigs, setOidcConfigs] = useState([]);

  const refreshOidcConfigs = React.useCallback(() => {
    setIsLoading(true);
    try {
      getUserOidcConfigurations(awsAccountID).then(({ action }) => {
        const currentConfigs = action.payload;
        setOidcConfigs(currentConfigs);

        const isSelectedConfigDeleted =
          byoOidcConfigID &&
          currentConfigs.find((config) => config.id === byoOidcConfigID) === undefined;
        if (isSelectedConfigDeleted) {
          onParentSelect(null);
        }
      });
    } finally {
      // Because the response can be so quick, this ensures the user will see that something has happened
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [byoOidcConfigID, onParentSelect]);

  const onSelect = (_, configId) => {
    const selected = oidcConfigs.find((config) => config.id === configId);
    setIsDropdownOpen(false);
    onParentSelect(selected);
  };

  useEffect(() => {
    const isValidSelection = oidcConfigs?.some((item) => item?.id === byoOidcConfigID);
    if (oidcConfigs?.length > 0 && byoOidcConfigID && !isValidSelection) {
      onParentSelect(null);
    }
  }, [byoOidcConfigID, oidcConfigs, onParentSelect]);

  useEffect(() => {
    refreshOidcConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectionData = useMemo(
    () =>
      oidcConfigs.map((oidcConfig) => ({
        entryId: oidcConfig.id,
        label: oidcConfig.id,
        description: oidcConfig.issuer_url ? `Issuer URL: ${oidcConfig.issuer_url}` : undefined,
      })),
    [oidcConfigs],
  );

  return (
    <>
      <Instructions wide>
        <Instruction simple>
          <TextContent className="pf-v5-u-pb-md">
            <Text component={TextVariants.p}>
              Select your existing OIDC config id or <CreateOIDCProviderInstructions />.
            </Text>
          </TextContent>

          <FormGroup
            label="Config ID"
            labelIcon={
              <PopoverHint
                hint={
                  <span>
                    The OIDC configuration ID created by running the command{' '}
                    <pre>rosa create oidc-config</pre>
                  </span>
                }
              />
            }
            isRequired
          >
            <Flex>
              <FlexItem grow={{ default: 'grow' }}>
                <FuzzySelect
                  {...inputProps}
                  label="Config ID"
                  aria-label="Config ID"
                  isOpen={isDropdownOpen}
                  onToggle={(_ev, isOpen) => setIsDropdownOpen(isOpen)}
                  onSelect={onSelect}
                  selectedEntryId={byoOidcConfigID}
                  selectionData={selectionData}
                  isDisabled={oidcConfigs.length === 0 || isLoading}
                  placeholderText={
                    oidcConfigs.length > 0 ? 'Select a config id' : 'No OIDC configurations found'
                  }
                  inlineFilterPlaceholderText="Filter by config ID"
                />
              </FlexItem>
              <FlexItem>
                <Button
                  variant="secondary"
                  className="pf-v5-u-mt-md"
                  onClick={refreshOidcConfigs}
                  isLoading={isLoading}
                  isDisabled={isLoading}
                >
                  Refresh
                </Button>
              </FlexItem>
            </Flex>

            <FormGroupHelperText touched={touched} error={error} />
          </FormGroup>
        </Instruction>

        <Instruction simple>
          <TextContent className="pf-v5-u-pb-md">
            <Text component={TextVariants.p}>Enter an Operator role prefix.</Text>
          </TextContent>

          <Field
            component={ReduxVerticalFormGroup}
            name="custom_operator_roles_prefix"
            label="Operator roles prefix"
            type="text"
            isRequired
            // eslint-disable-next-line import/no-named-as-default-member
            validate={validators.checkCustomOperatorRolesPrefix}
            helpText={`Maximum ${validators.MAX_CUSTOM_OPERATOR_ROLES_PREFIX_LENGTH} characters.  Changing the cluster name will regenerate this value.`}
            extendedHelpText={
              <TextContent>
                <Text component={TextVariants.p}>
                  You can specify a custom prefix for the cluster-specific Operator IAM roles to
                  use. <br />
                  See examples in{' '}
                  <ExternalLink href={links.ROSA_AWS_OPERATOR_ROLE_PREFIX}>
                    Defining a custom Operator IAM role prefix
                  </ExternalLink>
                </Text>
              </TextContent>
            }
            showHelpTextOnError={false}
            disabled={!byoOidcConfigID}
          />
        </Instruction>

        <Instruction simple>
          <TextContent className="pf-v5-u-pb-md">
            <Text component={TextVariants.p}>Run the command to create a new Operator Roles.</Text>
          </TextContent>
          {operatorRolesCliCommand ? (
            <ClipboardCopy
              textAriaLabel="Copyable ROSA create operator-roles"
              variant={ClipboardCopyVariant.expansion}
              isReadOnly
            >
              {operatorRolesCliCommand}
            </ClipboardCopy>
          ) : (
            <Skeleton fontSize="md" />
          )}
        </Instruction>
      </Instructions>
    </>
  );
}

CustomerOIDCConfiguration.propTypes = {
  awsAccountID: PropTypes.string,
  getUserOidcConfigurations: PropTypes.func.isRequired,
  byoOidcConfigID: PropTypes.string,
  operatorRolesCliCommand: PropTypes.string,
  onSelect: PropTypes.func,
  input: PropTypes.shape({
    value: PropTypes.string,
    onBlur: PropTypes.func,
  }),
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};

export default CustomerOIDCConfiguration;
