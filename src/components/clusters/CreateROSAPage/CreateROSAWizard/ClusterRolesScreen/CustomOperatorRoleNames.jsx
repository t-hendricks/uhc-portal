import React from 'react';
import { Field } from 'redux-form';

import { GridItem, Text, TextContent, TextVariants, Title } from '@patternfly/react-core';

import ExternalLink from '../../../../common/ExternalLink';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import validators from '../../../../../common/validators';
import links from '../../../../../common/installLinks.mjs';

function CustomOperatorRoleNames() {
  return (
    <>
      <GridItem>
        <Title headingLevel="h3">Name operator roles</Title>
      </GridItem>
      <GridItem span={10}>
        <Text component={TextVariants.p}>
          To easily identify the Operator IAM roles for a cluster in your AWS account, the Operator
          role names are prefixed with your cluster name and a random 4-digit hash. You can
          optionally replace this prefix.
        </Text>
      </GridItem>
      <GridItem span={6}>
        <Field
          component={ReduxVerticalFormGroup}
          name="custom_operator_roles_prefix"
          label="Custom operator roles prefix"
          type="text"
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

export default CustomOperatorRoleNames;
