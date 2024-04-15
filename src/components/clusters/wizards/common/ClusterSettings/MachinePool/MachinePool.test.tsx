import * as React from 'react';
import { Formik } from 'formik';

import { FieldId } from '~/components/clusters/wizards/common';
import { render, screen, waitFor } from '~/testUtils';

import { MachinePool } from './MachinePool';

describe('<MachinePool />', () => {
  it('should open nodes labels section by default if node labels are set', async () => {
    render(
      <Formik
        initialValues={{
          [FieldId.NodeLabels]: [{ key: 'test-key', value: 'test-value' }],
          [FieldId.MachineType]: 'test',
          [FieldId.MachineTypeForceChoice]: 'test',
          [FieldId.BillingModel]: 'marketplace-aws',
          [FieldId.Product]: 'ROSA',
          [FieldId.CloudProvider]: 'aws',
        }}
        onSubmit={() => {}}
      >
        <MachinePool />
      </Formik>,
    );

    await waitFor(() => {
      const sectionToggle = screen.getByRole('button', { name: 'Add node labels' });
      expect(sectionToggle).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
