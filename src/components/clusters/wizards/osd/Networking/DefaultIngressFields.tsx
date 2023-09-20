import React from 'react';

import { FormGroup, GridItem, Split, SplitItem } from '@patternfly/react-core';
import { Field } from 'formik';
import { CheckboxField } from 'formik-pf';

import { checkRouteSelectors, validateNamespacesList } from '~/common/validators';
import {
  RouteSelectorsHelpText,
  RouteSelectorsPopover,
} from '~/components/clusters/ClusterDetails/components/Networking/components/ApplicationIngressCard/RouteSelectorsPopover';
import {
  ExcludedNamespacesHelpText,
  ExcludedNamespacesPopover,
} from '~/components/clusters/ClusterDetails/components/Networking/components/ApplicationIngressCard/ExcludedNamespacesPopover';
import { NamespaceOwnerPolicyPopover } from '~/components/clusters/ClusterDetails/components/Networking/components/ApplicationIngressCard/NamespaceOwnerPolicyPopover';
import { WildcardPolicyPopover } from '~/components/clusters/ClusterDetails/components/Networking/components/ApplicationIngressCard/WildcardsPolicyPopover';

import { useFormState } from '../../hooks';
import { FieldId } from '../constants';

type DefaultIngressFieldsProps = {};

/* So far used in Day 1 flow only (contrary to the version 1 CreateOSDWizard */
export const DefaultIngressFields: React.FC<DefaultIngressFieldsProps> = () => {
  const { setFieldValue, getFieldMeta, getFieldProps } = useFormState();

  const routeSelectorFieldMeta = getFieldMeta(FieldId.DefaultRouterSelectors);
  const excludedNamespacesFieldMeta = getFieldMeta(FieldId.DefaultRouterExcludedNamespacesFlag);
  return (
    <>
      <GridItem span={9}>
        <FormGroup
          label="Route selector"
          labelIcon={<RouteSelectorsPopover />}
          helperText={RouteSelectorsHelpText}
          helperTextInvalid={routeSelectorFieldMeta.error}
          validated={routeSelectorFieldMeta.error ? 'error' : 'default'}
        >
          <Field
            name={FieldId.DefaultRouterSelectors}
            type="text"
            validate={checkRouteSelectors}
            className="pf-u-w-100"
            input={{
              ...getFieldProps(FieldId.DefaultRouterSelectors),
              onChange: (value: string) =>
                setFieldValue(FieldId.DefaultRouterSelectors, value, false),
            }}
          />
        </FormGroup>
      </GridItem>

      <GridItem span={9}>
        <FormGroup
          label="Excluded namespaces"
          labelIcon={<ExcludedNamespacesPopover />}
          helperText={ExcludedNamespacesHelpText}
          helperTextInvalid={excludedNamespacesFieldMeta.error}
          validated={excludedNamespacesFieldMeta.error ? 'error' : 'default'}
        >
          <Field
            name={FieldId.DefaultRouterExcludedNamespacesFlag}
            type="text"
            validate={validateNamespacesList}
            className="pf-u-w-100"
            input={{
              ...getFieldProps(FieldId.DefaultRouterExcludedNamespacesFlag),
              onChange: (value: string) =>
                setFieldValue(FieldId.DefaultRouterExcludedNamespacesFlag, value, false),
            }}
          />
        </FormGroup>
      </GridItem>

      <Split hasGutter className="pf-u-mb-0">
        <SplitItem>
          <CheckboxField
            name={FieldId.IsDefaultRouterNamespaceOwnershipPolicyStrict}
            label="Use strict namespace ownership policy"
          />
        </SplitItem>
        <SplitItem>
          <NamespaceOwnerPolicyPopover />
        </SplitItem>
      </Split>

      <Split hasGutter className="pf-u-mb-0">
        <SplitItem>
          <CheckboxField
            name={FieldId.IsDefaultRouterWildcardPolicyAllowed}
            label="Allow router wildcard policy"
          />
        </SplitItem>
        <SplitItem>
          <WildcardPolicyPopover />
        </SplitItem>
      </Split>
    </>
  );
};
