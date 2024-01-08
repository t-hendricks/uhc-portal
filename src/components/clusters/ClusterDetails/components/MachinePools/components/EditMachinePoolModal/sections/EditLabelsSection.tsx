import { Button, FormGroup, Grid, GridItem, Text, TextVariants } from '@patternfly/react-core';
import { FieldArray, useField } from 'formik';
import * as React from 'react';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import TextField from '~/components/common/formik/TextField';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';

import { EditMachinePoolValues } from '../hooks/useMachinePoolFormik';
import FieldArrayRemoveButton from '../components/FieldArrayRemoveButton';

import './EditLabelsSection.scss';

const EditLabelsSection = () => {
  const [input] = useField<EditMachinePoolValues['labels']>('labels');
  return (
    <GridItem>
      <FormGroup fieldId="labels" label="Node labels">
        <FormGroupHelperText>
          <div className="uhc-labels-section__description">
            Labels help you organize and select resources. Adding labels below will let you query
            for objects that have similar, overlapping or dissimilar labels.
          </div>
        </FormGroupHelperText>
      </FormGroup>
      <FieldArray
        name="labels"
        render={({ push, remove }) => (
          <>
            <Grid hasGutter>
              <GridItem span={4}>
                <Text component={TextVariants.small}>Key</Text>
              </GridItem>
              <GridItem span={8}>
                <Text component={TextVariants.small}>Value</Text>
              </GridItem>
            </Grid>
            <Grid hasGutter>
              {input.value.map((_, index) => {
                const keyField = `labels[${index}].key`;
                const valueField = `labels[${index}].value`;

                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <React.Fragment key={index}>
                    <GridItem span={4}>
                      <TextField fieldId={keyField} />
                    </GridItem>
                    <GridItem span={4}>
                      <TextField fieldId={valueField} />
                    </GridItem>
                    <GridItem span={4}>
                      <FieldArrayRemoveButton
                        input={input}
                        index={index}
                        onRemove={remove}
                        onPush={() => push({ key: '', value: '' })}
                      />
                    </GridItem>
                  </React.Fragment>
                );
              })}
              <GridItem span={6}>
                <Button
                  icon={<PlusCircleIcon />}
                  onClick={() => push({ key: '', value: '' })}
                  variant="link"
                  isInline
                >
                  Add label
                </Button>
              </GridItem>
            </Grid>
          </>
        )}
      />
    </GridItem>
  );
};

export default EditLabelsSection;
