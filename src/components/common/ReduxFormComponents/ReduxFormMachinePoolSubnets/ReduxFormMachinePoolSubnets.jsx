import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Alert, Button, Grid, GridItem } from '@patternfly/react-core';
import { PlusCircleIcon, MinusCircleIcon } from '@patternfly/react-icons';

import { validateMultipleMachinePoolsSubnets } from '~/common/validators';
import { SubnetSelectField } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/NetworkScreen/SubnetSelectField';

import './ReduxFormMachinePoolSubnets.scss';

const ReduxFormMachinePoolSubnets = ({ fields, selectedVPCID, meta: { warning } }) => (
  <Grid hasGutter>
    {warning && (
      <GridItem>
        <Alert variant="warning" isPlain isInline title={warning} />
      </GridItem>
    )}
    <GridItem span={2} className="pf-c-form__label pf-c-form__label-text">
      Machine pool
    </GridItem>
    <GridItem span={4} className="pf-c-form__label pf-c-form__label-text">
      Private subnet ID
    </GridItem>
    <GridItem span={6} />

    {fields.map((fieldName, index) => {
      const isRemoveDisabled = fields.length === 1;
      return (
        /* Adding index to fix issue when machine pool entries with same subnets are removed */
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={`${fields.get(index).subnet_id}_${index}`}>
          <GridItem span={2}>Machine pool {index + 1}</GridItem>
          <GridItem span={4}>
            <Field
              component={SubnetSelectField}
              name={`${fieldName}`}
              validate={validateMultipleMachinePoolsSubnets}
              isRequired
              privacy="private"
              selectedVPC={selectedVPCID}
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
        onClick={() => fields.push({ subnet_id: '', availability_zone: '' })}
        icon={<PlusCircleIcon />}
        variant="link"
        isInline
        className="reduxFormMachinePoolSubnets-addBtn"
        isDisabled={!selectedVPCID}
      >
        Add machine pool
      </Button>
    </GridItem>
  </Grid>
);

ReduxFormMachinePoolSubnets.propTypes = {
  fields: PropTypes.array.isRequired,
  selectedVPCID: PropTypes.string,
  meta: PropTypes.shape({
    warning: PropTypes.string,
  }),
};

export default ReduxFormMachinePoolSubnets;
