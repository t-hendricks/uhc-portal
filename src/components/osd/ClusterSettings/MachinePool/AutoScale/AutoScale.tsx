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
  onChange?(): void;
}

export const AutoScale = ({
  autoscalingEnabled,
  isDefaultMachinePool,
  product,
  isBYOC,
  isMultiAz,
  autoScaleMinNodesValue = '0',
  autoScaleMaxNodesValue = '0',
  onChange,
}: AutoScaleProps) => {
  const { setFieldValue } = useFormState();
  const [minErrorMessage, setMinErrorMessage] = React.useState<string>();
  const [maxErrorMessage, setMaxErrorMessage] = React.useState<string>();

  React.useEffect(() => {
    const minAllowed = getMinNodesAllowed({
      isDefaultMachinePool,
      product,
      isBYOC,
      isMultiAz,
      autoScaleMinNodesValue,
    });

    if (minAllowed) {
      setFieldValue(
        FieldId.MinReplicas,
        isMultiAz ? (minAllowed / 3).toString() : minAllowed.toString(),
      );
    }
  }, [
    autoScaleMinNodesValue,
    autoscalingEnabled,
    isBYOC,
    isDefaultMachinePool,
    isMultiAz,
    product,
    setFieldValue,
  ]);

  const minNodes = () => {
    const minNodesAllowed = getMinNodesAllowed({
      isDefaultMachinePool,
      product,
      isBYOC,
      isMultiAz,
      autoScaleMinNodesValue,
    });

    if (minNodesAllowed) {
      return minNodesAllowed / (isMultiAz ? 3 : 1);
    }

    return undefined;
  };

  const validateMinNodes = (value: string) => {
    const minNodesAllowed = minNodes();
    return validateNumericInput(value, { min: minNodesAllowed, allowZero: true });
  };

  const validateMaxLessMinNodes = (value: string, allValues: Record<string, any>) => {
    if (parseInt(value, 10) < parseInt(allValues.min_replicas, 10)) {
      return 'Max nodes cannot be less than min nodes.';
    }
    return undefined;
  };

  const validateMaxNodes = (val: string) =>
    validateNumericInput(val, {
      max: isMultiAz ? MAX_NODES / 3 : MAX_NODES,
      allowZero: true,
    });

  const minField = (
    <Field
      component={NodesInput}
      name={FieldId.MinReplicas}
      type="text"
      ariaLabel="Minimum nodes"
      validate={[validateMinNodes, validateMaxNodes, required]}
      displayError={(_: string, error: string) => setMinErrorMessage(error)}
      hideError={() => setMinErrorMessage(undefined)}
      limit="min"
      min={minNodes()}
      max={isMultiAz ? MAX_NODES / 3 : MAX_NODES}
    />
  );

  const maxField = (
    <Field
      component={NodesInput}
      name={FieldId.MaxReplicas}
      type="text"
      ariaLabel="Maximum nodes"
      validate={[validateMinNodes, validateMaxLessMinNodes, validateMaxNodes, required]}
      displayError={(_: string, error: string) => setMaxErrorMessage(error)}
      hideError={() => setMaxErrorMessage(undefined)}
      limit="max"
      min={minNodes()}
      max={isMultiAz ? MAX_NODES / 3 : MAX_NODES}
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
                {isMultiAz && helpText(`x 3 zones = ${parseInt(autoScaleMinNodesValue, 10) * 3}`)}
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
                {isMultiAz && helpText(`x 3 zones = ${parseInt(autoScaleMaxNodesValue, 10) * 3}`)}
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

                    <ExternalLink href={autoScalingUrl}>
                      Learn more about autoscaling
                      {isRosa ? ' with ROSA' : ''}
                    </ExternalLink>
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
                  <ExternalLink href={autoScalingUrl}>Learn more about autoscaling</ExternalLink>
                </>
              }
            />
          }
        />

        <CheckboxField
          name={FieldId.AutoscalingEnabled}
          label="Enable autoscaling"
          input={{ onChange }}
        />
        {autoscalingEnabled && azFormGroups}
      </GridItem>
    </>
  );
};
