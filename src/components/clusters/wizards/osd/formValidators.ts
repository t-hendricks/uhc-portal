import { FormikValues } from 'formik';
import { FieldId } from '~/components/clusters/wizards/osd/constants';

interface MinMaxField {
  min: string | number;
  max: string | number;
}

const addMinMaxError = (
  errors: Record<string, MinMaxField>,
  minMaxItem: MinMaxField,
  fieldName: string,
) => {
  if (minMaxItem.min > minMaxItem.max) {
    // eslint-disable-next-line no-param-reassign
    errors[fieldName] = {
      min: 'The minimum cannot be above the maximum value.',
      max: 'The minimum cannot be above the maximum value.',
    };
  }
};

const osdWizardFormValidator = (values: FormikValues) => {
  const autoScaler = values[FieldId.ClusterAutoscaling];
  if (!autoScaler) {
    return {};
  }

  const { cores, memory } = autoScaler.resource_limits;

  const resourceLimitErrors: Record<string, MinMaxField> = {};
  addMinMaxError(resourceLimitErrors, cores, 'cores');
  addMinMaxError(resourceLimitErrors, memory, 'memory');

  if (Object.keys(resourceLimitErrors).length === 0) {
    return {};
  }
  return {
    cluster_autoscaling: {
      resource_limits: resourceLimitErrors,
    },
  };
};

export { osdWizardFormValidator };
