import React from 'react';
import { Field } from 'redux-form';

import { FieldDefinition } from '~/components/clusters/common/EditClusterAutoScalingDialog/fieldDefinitions';
import { clusterAutoScalingValidators } from '~/common/validators';

import ReduxBooleanField from '~/components/common/ReduxFormComponents/ReduxBooleanField';
import ReduxVerticalFormGroup from '~/components/common/ReduxFormComponents/ReduxVerticalFormGroup';

const numberParser = (defaultValue: number) => (val: string) =>
  Number.isNaN(val) ? defaultValue : Number(val);

interface ClusterAutoScalingValues {
  // eslint-disable-next-line camelcase
  cluster_autoscaling: object;
}

interface Props {
  type: string;
  validate:
    | undefined
    | ((
        value: string,
        allValues: ClusterAutoScalingValues,
        props: object,
        name: string,
      ) => string | undefined);
  parse: undefined | ((val: string) => number);
}

const getFieldProps = (field: FieldDefinition) => {
  let props: Props = {
    type: 'text',
    validate: undefined,
    parse: undefined,
  };

  switch (field.type) {
    case 'time':
      props.validate = clusterAutoScalingValidators.k8sTimeParameter;
      break;
    case 'number': {
      let validate;
      if (field.name === 'scale_down.utilization_threshold') {
        validate = clusterAutoScalingValidators.k8sScaleDownUtilizationThresholdParameter;
      } else if (field.name === 'log_verbosity') {
        validate = clusterAutoScalingValidators.k8sLogVerbosityParameter;
      } else if (field.name === 'pod_priority_threshold') {
        validate = undefined;
      } else {
        validate = clusterAutoScalingValidators.k8sNumberParameter;
      }

      props = {
        type: 'number',
        parse: numberParser(field.defaultValue as number),
        validate,
      };
      break;
    }

    case 'min-max': {
      props = {
        type: 'number',
        parse: numberParser(field.defaultValue as number),
        validate: clusterAutoScalingValidators.k8sMinMaxParameter,
      };
      break;
    }
    default:
      break;
  }
  return props;
};

export const fieldItemMapper = (field: FieldDefinition, isDisabled?: boolean) => {
  if (field.type === 'boolean') {
    const fieldProps = {
      label: field.label,
      type: field.type,
      isRequired: true,
      isDisabled,
      helpText: <span className="custom-help-text">Default value: {`${field.defaultValue}`}</span>,
    };
    return (
      <ReduxBooleanField fieldName={`cluster_autoscaling.${field.name}`} fieldProps={fieldProps} />
    );
  }

  return (
    <Field
      component={ReduxVerticalFormGroup}
      name={`cluster_autoscaling.${field.name}`}
      label={field.label}
      {...getFieldProps(field)}
      isRequired
      props={{
        disabled: isDisabled || false,
      }}
      helpText={<span className="custom-help-text">Default value: {field.defaultValue}</span>}
    />
  );
};
