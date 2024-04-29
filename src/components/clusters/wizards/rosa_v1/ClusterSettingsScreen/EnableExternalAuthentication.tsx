import React from 'react';
import { Field } from 'redux-form';

import { FormGroup, GridItem } from '@patternfly/react-core';

import links from '~/common/installLinks.mjs';
import { CheckboxDescription } from '~/components/common/CheckboxDescription';
import ExternalLink from '~/components/common/ExternalLink';
import ReduxCheckbox from '~/components/common/ReduxFormComponents/ReduxCheckbox';

export const EnableExternalAuthentication = () => (
  <GridItem md={6}>
    <FormGroup
      fieldId="enable_external_authentication_field"
      id="enable_external_authentication_field"
      label="Enable external authentication!"
    >
      <Field
        component={ReduxCheckbox}
        name="enable_external_authentication"
        label="Enable external authentication"
        extendedHelpText={
          <ExternalLink href={links.UNDERSTANDING_AUTHENTICATION}>
            Learn more about external authentication
          </ExternalLink>
        }
      />

      <CheckboxDescription>
        Allow authentication to be handled by an external provider.
      </CheckboxDescription>
    </FormGroup>
  </GridItem>
);
