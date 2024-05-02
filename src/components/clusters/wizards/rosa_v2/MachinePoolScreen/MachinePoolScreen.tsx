import React from 'react';

import { Form, Grid } from '@patternfly/react-core';

import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '~/components/clusters/wizards/rosa_v2/constants';

import ScaleSection from './components/ScaleSection';
import MachinePoolScreenHeader from './MachinePoolScreenHeader';
import MachinePoolsSubnets from './MachinePoolsSubnets';

const MachinePoolScreen = () => {
  const {
    values: { [FieldId.Hypershift]: hypershiftValue },
  } = useFormState();

  const isHypershiftSelected = hypershiftValue === 'true';

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        return false;
      }}
    >
      <Grid hasGutter>
        <MachinePoolScreenHeader isHypershiftSelected={isHypershiftSelected} />

        {isHypershiftSelected ? <MachinePoolsSubnets /> : null}

        <ScaleSection />
      </Grid>
    </Form>
  );
};

export default MachinePoolScreen;
