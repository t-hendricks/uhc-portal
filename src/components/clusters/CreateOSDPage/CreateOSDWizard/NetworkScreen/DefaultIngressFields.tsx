import React from 'react';
import { Field } from 'redux-form';
import { FormGroup } from '@patternfly/react-core';
import classNames from 'classnames';

import { ReduxCheckbox, ReduxVerticalFormGroup } from '~/components/common/ReduxFormComponents';
import LoadBalancerPopover from '~/components/clusters/ClusterDetails/components/Networking/components/LoadBalancerPopover';
import { LoadBalancerFlavorLabel } from '~/components/clusters/ClusterDetails/components/Networking/components/constants';
import { LoadBalancerFlavor } from '~/types/clusters_mgmt.v1';
import { WildcardPolicyPopover } from '~/components/clusters/ClusterDetails/components/Networking/components/ApplicationIngressCard/WildcardsPolicyPopover';
import { NamespaceOwnerPolicyPopover } from '~/components/clusters/ClusterDetails/components/Networking/components/ApplicationIngressCard/NamespaceOwnerPolicyPopover';
import {
  checkRouteSelectors,
  validateTlsHostname,
  validateNamespacesList,
  validateTlsSecretName,
} from '~/common/validators';
import {
  ExcludedNamespacesHelpText,
  ExcludedNamespacesPopover,
} from '~/components/clusters/ClusterDetails/components/Networking/components/ApplicationIngressCard/ExcludedNamespacesPopover';
import {
  RouteSelectorsHelpText,
  RouteSelectorsPopover,
} from '~/components/clusters/ClusterDetails/components/Networking/components/ApplicationIngressCard/RouteSelectorsPopover';

type DefaultIngressFieldsProps = {
  className?: string;
  areFieldsDisabled?: boolean;
  hasSufficientIngressEditVersion?: boolean;
  isDay2?: boolean;
};

export const DefaultIngressFields: React.FC<DefaultIngressFieldsProps> = ({
  className,
  areFieldsDisabled,
  isDay2,
  hasSufficientIngressEditVersion,
}) => (
  <>
    {isDay2 && (
      <FormGroup
        fieldId="default_router_address"
        label="Default application router"
        isStack
        isRequired
      >
        <Field
          component={ReduxVerticalFormGroup}
          name="default_router_address"
          type="text"
          disabled
          helpText="Address of application routes."
        />
        <Field
          component={ReduxCheckbox}
          name="private_default_router"
          label="Make router private"
        />
      </FormGroup>
    )}

    {hasSufficientIngressEditVersion && (
      <FormGroup className={className} label="Route selector" labelIcon={<RouteSelectorsPopover />}>
        <Field
          component={ReduxVerticalFormGroup}
          name="defaultRouterSelectors"
          type="text"
          validate={checkRouteSelectors}
          disabled={areFieldsDisabled}
          helpText={RouteSelectorsHelpText}
          showHelpTextOnError={false}
        />
      </FormGroup>
    )}

    {hasSufficientIngressEditVersion && (
      <FormGroup
        className={className}
        label="Excluded namespaces"
        labelIcon={<ExcludedNamespacesPopover />}
      >
        <Field
          component={ReduxVerticalFormGroup}
          name="defaultRouterExcludedNamespacesFlag"
          type="text"
          validate={validateNamespacesList}
          disabled={areFieldsDisabled}
          helpText={ExcludedNamespacesHelpText}
          showHelpTextOnError={false}
        />
      </FormGroup>
    )}

    {isDay2 && hasSufficientIngressEditVersion && (
      <>
        <FormGroup className={className} label="TLS Secret name">
          <Field
            component={ReduxVerticalFormGroup}
            name="clusterRoutesTlsSecretRef"
            type="text"
            validate={validateTlsSecretName}
            disabled={areFieldsDisabled}
            helpText="The name of a secret holding custom TLS certificate, in the openshift-config namespace. Optional."
            showHelpTextOnError={false}
          />
        </FormGroup>

        {/* TODO: provide link to documentation once it is written */}
        <FormGroup className={className} label="Hostname">
          <Field
            component={ReduxVerticalFormGroup}
            name="clusterRoutesHostname"
            type="text"
            validate={validateTlsHostname}
            disabled={areFieldsDisabled}
            helpText="The cluster routes hostname the TLS certificate is issued for."
            showHelpTextOnError={false}
          />
        </FormGroup>
      </>
    )}

    {hasSufficientIngressEditVersion && (
      <FormGroup
        className={className}
        fieldId="isDefaultRouterNamespaceOwnershipPolicyStrict"
        label="Namespace ownership policy"
        labelIcon={<NamespaceOwnerPolicyPopover />}
      >
        <Field
          id="isDefaultRouterNamespaceOwnershipPolicyStrict"
          component={ReduxCheckbox}
          name="isDefaultRouterNamespaceOwnershipPolicyStrict"
          disabled={areFieldsDisabled}
          label="Strict"
          labelOff="Inter-namespace ownership allowed"
          isSwitch
        />
      </FormGroup>
    )}

    {hasSufficientIngressEditVersion && (
      <FormGroup
        className={className}
        fieldId="isDefaultRouterWildcardPolicyAllowed"
        label="Wildcard policy"
        labelIcon={<WildcardPolicyPopover />}
      >
        <Field
          id="isDefaultRouterWildcardPolicyAllowed"
          component={ReduxCheckbox}
          name="isDefaultRouterWildcardPolicyAllowed"
          disabled={areFieldsDisabled}
          label="Allowed"
          labelOff="Disallowed"
          isSwitch
        />
      </FormGroup>
    )}

    {isDay2 && (
      <FormGroup
        fieldId="load_balancer_group"
        label="Load balancer type"
        className={classNames('pf-u-pb-md', className)}
        labelIcon={<LoadBalancerPopover />}
      >
        <Field
          id="load_balancer_group"
          component={ReduxCheckbox}
          name="is_nlb_load_balancer"
          disabled={!hasSufficientIngressEditVersion}
          label={LoadBalancerFlavorLabel[LoadBalancerFlavor.NLB]}
          labelOff={LoadBalancerFlavorLabel[LoadBalancerFlavor.CLASSIC]}
          isSwitch
        />
      </FormGroup>
    )}
  </>
);
