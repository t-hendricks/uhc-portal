import React, { useState, useEffect } from 'react';
import { Field, FieldProps, useField } from 'formik';
import { Select, SelectOption, FormGroup, SelectOptionObject } from '@patternfly/react-core';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { billingModels, normalizedProducts } from '~/common/subscriptionTypes';
import { CloudProviderType } from '~/components/clusters/wizards/common/constants';
import { HelperTextInvalid } from '~/components/clusters/wizards/form/TextInputField';

export interface MarketplaceSelectFieldProps {
  hasGcpQuota: boolean;
  hasRhmQuota: boolean;
}

export const MarketplaceSelectField = ({
  hasGcpQuota,
  hasRhmQuota,
}: MarketplaceSelectFieldProps) => {
  const [input] = useField(FieldId.MarketplaceSelection);
  const {
    values: {
      // Selected radio button: standard-trial | standard | marketplace | marketplace-gcp
      [FieldId.BillingModel]: billingModel,
      // Selected marketplace: marketplace | marketplace-gcp
      [FieldId.MarketplaceSelection]: selectedMarketplace,
    },
    setFieldValue,
    setFieldTouched,
    validateField,
  } = useFormState();
  const reset = () => {
    setFieldValue(FieldId.MarketplaceSelection, null, false);
    setFieldValue(FieldId.CloudProvider, CloudProviderType.Aws, false);
  };

  useEffect(() => {
    // reset if we select a radio button other than the parent radio
    if (!billingModel.startsWith(billingModels.MARKETPLACE)) {
      reset();
    }
  }, [billingModel]);

  useEffect(() => {
    if (billingModel.startsWith(billingModels.MARKETPLACE)) {
      validateField(FieldId.MarketplaceSelection);
    }
  }, [billingModel, selectedMarketplace]);

  const [isOpen, setIsOpen] = useState(false);
  const marketplaceOptions = [
    {
      label: 'Select your marketplace',
      value: 'placeholder',
      isPlaceholder: true,
    },
    {
      label: 'Google Cloud Marketplace',
      value: billingModels.MARKETPLACE_GCP,
      isDisabled: !hasGcpQuota,
      description: !hasGcpQuota
        ? 'You do not currently have a Google Cloud Platform subscription.'
        : null,
    },
    {
      label: 'Red Hat Marketplace',
      value: billingModels.MARKETPLACE,
      isDisabled: !hasRhmQuota,
      description: !hasRhmQuota
        ? 'You do not currently have a Red Hat Marketplace subscription.'
        : null,
    },
  ];

  const onToggle = (isExpanded: boolean) => {
    setIsOpen(isExpanded);
  };

  const onSelect = (
    _event: React.ChangeEvent<Element> | React.MouseEvent<Element, MouseEvent> | any,
    value: string | SelectOptionObject,
  ) => {
    setFieldTouched(FieldId.MarketplaceSelection, true, false);
    if (!value || value === 'placeholder') {
      reset();
    } else {
      setFieldValue(FieldId.MarketplaceSelection, value, false);
      setFieldValue(
        FieldId.CloudProvider,
        value === billingModels.MARKETPLACE_GCP ? CloudProviderType.Gcp : CloudProviderType.Aws,
        false,
      );

      // it's possible the select was used before the parent radio button was selected
      // ensure the parent radio button is selected and the correct values are set
      setFieldValue(FieldId.BillingModel, value, false);
      setFieldValue(FieldId.Byoc, 'true', false);
      setFieldValue(FieldId.Product, normalizedProducts.OSD, false);
    }

    setIsOpen(false);
  };

  const validate = (value: string): string | undefined => {
    if ((!value || value === 'placeholder') && billingModel.startsWith(billingModels.MARKETPLACE)) {
      return 'A selection is required.';
    }
    return undefined;
  };

  return (
    <Field name={FieldId.MarketplaceSelection} validate={validate}>
      {({ field, form, meta }: FieldProps) => (
        <FormGroup
          {...input}
          fieldId={field.name}
          validated={
            meta.touched && meta.error && billingModel.startsWith(billingModels.MARKETPLACE)
              ? 'error'
              : 'default'
          }
          helperTextInvalid={<HelperTextInvalid meta={meta} className="pf-u-w-100" />}
          isRequired
          isInline
          className="pf-u-mt-sm"
        >
          <Select
            isOpen={isOpen}
            selections={selectedMarketplace}
            onToggle={onToggle}
            onSelect={onSelect}
            isDisabled={!hasGcpQuota && !hasRhmQuota}
          >
            {marketplaceOptions.map(({ label, value, isDisabled, description, isPlaceholder }) => (
              <SelectOption
                className="pf-c-dropdown__menu-item"
                isSelected={selectedMarketplace === value}
                value={value}
                key={value}
                isDisabled={isDisabled}
                description={description}
                isPlaceholder={isPlaceholder}
              >
                {label}
              </SelectOption>
            ))}
          </Select>
        </FormGroup>
      )}
    </Field>
  );
};
