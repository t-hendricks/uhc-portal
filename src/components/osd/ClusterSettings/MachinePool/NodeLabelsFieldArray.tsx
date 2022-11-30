import React from 'react';
import { FieldArray } from 'formik';
import classNames from 'classnames';

import { Button, Flex, Grid, GridItem } from '@patternfly/react-core';
import { MinusCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';

import { checkLabelKey, checkLabelValue } from '~/common/validators';
import { FieldId } from '../../constants';
import { useFormState } from '../../hooks';
import { TextInputField } from '../../common/form';

interface NodeLabel {
  key: string;
  value: string;
}

export const NodeLabelsFieldArray = () => {
  const { values } = useFormState();
  const nodeLabels: NodeLabel[] = values[FieldId.NodeLabels];

  const validateNodeKey = (index: number) => (value: string) => {
    if (nodeLabels.length > 1) {
      const nodeLabelKeys = nodeLabels.reduce((acc: string[], nodeLabel, keyIndex) => {
        if (nodeLabel.key && index !== keyIndex) {
          acc.push(nodeLabel.key);
        }
        return acc;
      }, []);

      if (nodeLabelKeys.includes(value)) {
        return 'Each label must have a different key.';
      }

      return checkLabelKey(value);
    }

    return undefined;
  };

  const validateNodeValue = (value: string) => {
    if (nodeLabels.length > 1) {
      return checkLabelValue(value);
    }

    return undefined;
  };

  return (
    <Grid hasGutter>
      <GridItem span={5} className="pf-c-form__label pf-c-form__label-text">
        Key
      </GridItem>
      <GridItem span={5} className="pf-c-form__label pf-c-form__label-text">
        Value
      </GridItem>
      <FieldArray
        name={FieldId.NodeLabels}
        validateOnChange
        render={({ push, remove }) => (
          <>
            {nodeLabels?.map((_, index) => {
              const isRemoveDisabled = index === 0 && nodeLabels.length === 1;
              const name = `${FieldId.NodeLabels}.${index}`;
              const keyFieldName = `${name}.key`;
              const valueFieldName = `${name}.value`;

              return (
                <Grid hasGutter>
                  <GridItem span={5}>
                    <TextInputField name={keyFieldName} validate={validateNodeKey(index)} />
                  </GridItem>
                  <GridItem span={6}>
                    <Flex
                      alignItems={{ default: 'alignItemsCenter' }}
                      flexWrap={{ default: 'nowrap' }}
                    >
                      <TextInputField name={valueFieldName} validate={validateNodeValue} />
                      <Button
                        onClick={() => remove(index)}
                        icon={<MinusCircleIcon />}
                        variant="link"
                        isInline
                        isDisabled={isRemoveDisabled}
                        className={classNames(isRemoveDisabled && 'pf-u-disabled-color-200')}
                      />
                    </Flex>
                  </GridItem>
                </Grid>
              );
            })}
            <GridItem>
              <Button
                onClick={() => push({ key: '', value: '' })}
                icon={<PlusCircleIcon />}
                variant="link"
                isInline
              >
                Add label
              </Button>
            </GridItem>
          </>
        )}
      />
    </Grid>
  );
};
