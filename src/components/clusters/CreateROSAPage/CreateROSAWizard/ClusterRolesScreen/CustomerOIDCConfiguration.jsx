import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Button,
  ClipboardCopy,
  Flex,
  FlexItem,
  FormGroup,
  GridItem,
  Popover,
  Select,
  SelectOption,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';

import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import ExternalLink from '~/components/common/ExternalLink';
import PopoverHint from '~/components/common/PopoverHint';
import validators from '../../../../../common/validators';
import links from '../../../../../common/installLinks.mjs';

function CreateOIDCProviderInstructions() {
  return (
    <Popover
      aria-label="oidc-creation-instructions"
      position="top"
      maxWidth="22rem"
      style={{ '--pf-c-popover--c-button--sibling--PaddingRight': '2rem' }}
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
        create a new OIDC provider
      </Button>
    </Popover>
  );
}

function CustomerOIDCConfiguration({
  getUserOidcConfigurations,
  byoOidcConfigID,
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
      getUserOidcConfigurations().then(({ action }) => {
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
      setIsLoading(false);
    }
  }, [byoOidcConfigID, onParentSelect]);

  const onSelect = (_, configId) => {
    const selectedConfig = oidcConfigs.find((config) => config.id === configId);
    setIsDropdownOpen(false);
    onParentSelect(selectedConfig);
  };

  useEffect(() => {
    refreshOidcConfigs();
  }, []);

  let placeholderOptionText = 'Select the OIDC provider';
  if (oidcConfigs.length === 0) {
    placeholderOptionText = isLoading
      ? 'Loading OIDC configurations...'
      : 'No OIDC provider configurations have been found';
  }

  return (
    <>
      <TextContent className="ocm-alert-text">
        <Text component={TextVariants.p}>
          Select your existing OIDC provider or <CreateOIDCProviderInstructions />.
        </Text>
      </TextContent>

      <GridItem sm={12} md={7}>
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
          validated={error ? 'error' : undefined}
          helperTextInvalid={touched && error}
          isRequired
        >
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <Select
                {...inputProps}
                onToggle={setIsDropdownOpen}
                onSelect={onSelect}
                selections={byoOidcConfigID ? [byoOidcConfigID] : []}
                isDisabled={oidcConfigs.length === 0}
                isOpen={isDropdownOpen}
              >
                <SelectOption value="NO_SELECTION" isSelected isPlaceholder isDisabled>
                  {placeholderOptionText}
                </SelectOption>
                {oidcConfigs.map((oidcConfig) => (
                  <SelectOption
                    key={oidcConfig.id}
                    value={oidcConfig.id}
                    description={
                      oidcConfig.issuer_url ? `Issuer URL: ${oidcConfig.issuer_url}` : undefined
                    }
                  >
                    {oidcConfig.id}
                  </SelectOption>
                ))}
              </Select>
            </FlexItem>
            <FlexItem>
              <Button variant="secondary" className="pf-u-mt-md" onClick={refreshOidcConfigs}>
                Refresh
              </Button>
            </FlexItem>
          </Flex>
        </FormGroup>
      </GridItem>

      <GridItem sm={12} md={7}>
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
                You can specify a custom prefix for the cluster-specific Operator IAM roles to use.{' '}
                <br />
                See examples in{' '}
                <ExternalLink href={links.ROSA_AWS_OPERATOR_ROLE_PREFIX}>
                  Defining a custom Operator IAM role prefix
                </ExternalLink>
              </Text>
            </TextContent>
          }
          showHelpTextOnError={false}
        />
      </GridItem>
    </>
  );
}

CustomerOIDCConfiguration.propTypes = {
  getUserOidcConfigurations: PropTypes.func.isRequired,
  byoOidcConfigID: PropTypes.string,
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
