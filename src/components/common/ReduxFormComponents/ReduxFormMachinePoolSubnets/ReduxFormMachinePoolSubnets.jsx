import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Alert, Button, Grid, GridItem } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';

import { validateMultipleMachinePoolsSubnets } from '~/common/validators';
import { SubnetSelectField } from '~/components/clusters/common/SubnetSelectField';
import { emptyAWSSubnet } from '~/components/clusters/wizards/common/createOSDInitialValues';

import './ReduxFormMachinePoolSubnets.scss';

const ReduxFormMachinePoolSubnets = ({ fields, selectedVPC, meta }) => (
  <Grid hasGutter>
    {meta?.warning && (
      <GridItem>
        <Alert variant="warning" isPlain isInline title={meta?.warning} />
      </GridItem>
    )}
    <GridItem span={2} className="pf-v5-c-form__label pf-v5-c-form__label-text">
      Machine pool
    </GridItem>
    <GridItem span={4} className="pf-v5-c-form__label pf-v5-c-form__label-text">
      Private subnet name
    </GridItem>
    <GridItem span={6} />

    {fields.map((fieldName, index) => {
      const isRemoveDisabled = fields.length === 1;
      return (
        /* Adding index to fix issue when machine pool entries with same subnets are removed */
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={`${fields.get(index).privateSubnetId}_${index}`}>
          <GridItem span={2}>Machine pool {index + 1}</GridItem>
          <GridItem span={4}>
            <Field
              component={SubnetSelectField}
              name={`${fieldName}.privateSubnetId`}
              validate={validateMultipleMachinePoolsSubnets}
              isRequired
              privacy="private"
              selectedVPC={selectedVPC}
              withAutoSelect={false}
              isNewCluster
            />
          </GridItem>
          <GridItem span={1}>
            <Button
              onClick={() => fields.remove(index)}
              icon={<MinusCircleIcon />}
              variant="link"
              isDisabled={isRemoveDisabled}
              className={
                isRemoveDisabled
                  ? 'reduxFormMachinePoolSubnets-removeBtn-disabled'
                  : 'reduxFormMachinePoolSubnets-removeBtn'
              }
            />
          </GridItem>
          <GridItem span={5} />
        </React.Fragment>
      );
    })}
    <GridItem>
      <Button
        onClick={() => fields.push(emptyAWSSubnet())}
        icon={<PlusCircleIcon />}
        variant="link"
        isInline
        className="reduxFormMachinePoolSubnets-addBtn"
        isDisabled={!selectedVPC.id}
      >
        Add machine pool
      </Button>
    </GridItem>
  </Grid>
);

ReduxFormMachinePoolSubnets.propTypes = {
  fields: PropTypes.array.isRequired,
  selectedVPC: PropTypes.object,
  meta: PropTypes.object.isRequired,
};

export default ReduxFormMachinePoolSubnets;
