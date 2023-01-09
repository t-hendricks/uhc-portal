import React from 'react';
import {
  FormGroup,
  GridItem,
  Split,
  SplitItem,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import { Field } from 'formik';

import { useFormState } from '~/components/osd/hooks';
import { FieldId } from '~/components/osd/constants';
import PopoverHint from '~/components/common/PopoverHint';
import { constants } from '~/components/clusters/CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { MAX_NODES } from '~/components/clusters/common/NodeCountInput/NodeCountInput';
import { required, validateNumericInput } from '~/common/validators';
import { NodesInput } from './NodesInput';
import getMinNodesAllowed from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/ScaleSection/AutoScaleSection/AutoScaleHelper';
import { CheckboxField } from '~/components/osd/common/form';

interface AutoScaleProps {
  autoscalingEnabled: boolean;
  isMultiAz: boolean;
  autoScaleMinNodesValue: string;
  autoScaleMaxNodesValue: string;
  product: string;
  isBYOC: boolean;
  isDefaultMachinePool: boolean;
}

export const AutoScale = ({
  autoscalingEnabled,
  isDefaultMachinePool,
  product,
  isBYOC,
  isMultiAz,
  autoScaleMinNodesValue,
  autoScaleMaxNodesValue,
}: AutoScaleProps) => {
  const {
    setFieldValue,
    getFieldProps,
    getFieldMeta,
    values: { [FieldId.MinReplicas]: minReplicas },
  } = useFormState();
  const [minErrorMessage, setMinErrorMessage] = React.useState<string>();
  const [maxErrorMessage, setMaxErrorMessage] = React.useState<string>();

  React.useEffect(() => {
    const minAllowed = getMinNodesAllowed({
      isDefaultMachinePool,
      product,
      isBYOC,
      isMultiAz,
    });

    if (minAllowed) {
      setFieldValue(
        FieldId.MinReplicas,
        isMultiAz ? (minAllowed / 3).toString() : minAllowed.toString(),
      );
    }
  }, [autoscalingEnabled, isBYOC, isDefaultMachinePool, isMultiAz, product, setFieldValue]);

  const minNodes = () => {
    const minNodesAllowed = getMinNodesAllowed({
      isDefaultMachinePool,
      product,
      isBYOC,
      isMultiAz,
    });

    if (minNodesAllowed) {
      return minNodesAllowed / (isMultiAz ? 3 : 1);
    }

    return undefined;
  };

  const validateNodes = (value: string) => {
    const requiredError = required(value?.toString());
    const minNodesError = validateNumericInput(value, { min: minNodes(), allowZero: true });
    const maxNodesError = validateNumericInput(value, {
      max: isMultiAz ? MAX_NODES / 3 : MAX_NODES,
      allowZero: true,
    });

    return requiredError || minNodesError || maxNodesError || undefined;
  };

  const validateMaxNodes = (value: string) => {
    const nodesError = validateNodes(value);

    if (nodesError) {
      return nodesError;
    }

    if (minReplicas && parseInt(value, 10) < parseInt(minReplicas, 10)) {
      return 'Max nodes cannot be less than min nodes.';
    }

    return undefined;
  };

  const minField = (
    <Field
      component={NodesInput}
      name={FieldId.MinReplicas}
      type="text"
      ariaLabel="Minimum nodes"
      validate={validateNodes}
      displayError={(_: string, error: string) => setMinErrorMessage(error)}
      hideError={() => setMinErrorMessage(undefined)}
      limit="min"
      min={minNodes()}
      max={isMultiAz ? MAX_NODES / 3 : MAX_NODES}
      input={{
        ...getFieldProps(FieldId.MinReplicas),
        onChange: (value: string) => setFieldValue(FieldId.MinReplicas, value),
      }}
      meta={getFieldMeta(FieldId.MinReplicas)}
    />
  );

  const maxField = (
    <Field
      component={NodesInput}
      name={FieldId.MaxReplicas}
      type="text"
      ariaLabel="Maximum nodes"
      validate={validateMaxNodes}
      displayError={(_: string, error: string) => setMaxErrorMessage(error)}
      hideError={() => setMaxErrorMessage(undefined)}
      limit="max"
      min={minNodes()}
      max={isMultiAz ? MAX_NODES / 3 : MAX_NODES}
      input={{
        ...getFieldProps(FieldId.MaxReplicas),
        onChange: (value: string) => setFieldValue(FieldId.MaxReplicas, value),
      }}
      meta={getFieldMeta(FieldId.MaxReplicas)}
    />
  );

  const errorText = (message: string) => (
    <HelperTextItem variant="error" hasIcon>
      {message}
    </HelperTextItem>
  );
  const helpText = (message: string) => <HelperTextItem>{message}</HelperTextItem>;

  const isRosa = product === normalizedProducts.ROSA;
  const autoScalingUrl = isRosa ? links.ROSA_AUTOSCALING : links.APPLYING_AUTOSCALING;

  const azFormGroups = (
    <>
      <Split hasGutter className="autoscaling__container">
        <SplitItem>
          <FormGroup
            label={isMultiAz ? 'Minimum nodes per zone' : 'Minimum node count'}
            isRequired
            fieldId="nodes_min"
            className="autoscaling__nodes-formGroup"
            helperText={
              <HelperText>
                {isMultiAz &&
                  helpText(`x 3 zones = ${parseInt(autoScaleMinNodesValue, 10) || 0 * 3}`)}
                {minErrorMessage && errorText(minErrorMessage)}
              </HelperText>
            }
          >
            {minField}
          </FormGroup>
        </SplitItem>
        <SplitItem>
          <FormGroup
            label={isMultiAz ? 'Maximum nodes per zone' : 'Maximum node count'}
            isRequired
            fieldId="nodes_max"
            className="autoscaling__nodes-formGroup"
            helperText={
              <HelperText>
                {isMultiAz &&
                  helpText(`x 3 zones = ${parseInt(autoScaleMaxNodesValue, 10) || 0 * 3}`)}
                {maxErrorMessage && errorText(maxErrorMessage)}
              </HelperText>
            }
            labelIcon={
              <PopoverHint
                hint={
                  <>
                    {constants.computeNodeCountHint}
                    <br />
                    {isRosa ? (
                      <>
                        <ExternalLink href={links.ROSA_WORKER_NODE_COUNT}>
                          Learn more about worker/compute node count
                        </ExternalLink>
                        <br />
                      </>
                    ) : null}
                  </>
                }
              />
            }
          >
            {maxField}
          </FormGroup>
        </SplitItem>
      </Split>
    </>
  );

  return (
    <>
      <GridItem id="autoscaling">
        <FormGroup
          fieldId="autoscaling"
          label="Autoscaling"
          labelIcon={
            <PopoverHint
              hint={
                <>
                  {constants.autoscaleHint}{' '}
                  <ExternalLink href={autoScalingUrl}>
                    Learn more about autoscaling
                    {isRosa ? ' with ROSA' : ''}
                  </ExternalLink>
                </>
              }
            />
          }
        />

        <CheckboxField name={FieldId.AutoscalingEnabled} label="Enable autoscaling" />
        {autoscalingEnabled && azFormGroups}
      </GridItem>
    </>
  );
};
