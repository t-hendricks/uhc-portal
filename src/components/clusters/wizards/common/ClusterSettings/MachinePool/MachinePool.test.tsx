import * as React from 'react';
import { Formik } from 'formik';
import { render, screen } from '~/testUtils';
import { FieldId } from '~/components/clusters/wizards/common';
import { MachinePool } from './MachinePool';

const inputMetaProps = {
  input: {
    onChange: () => {},
    value: 'test',
  },
  meta: {
    invalid: false,
    error: null,
    touched: false,
  },
};

describe('<MachinePool />', () => {
  it('should open nodes labels section by default if node labels are set', async () => {
    render(
      <Formik
        initialValues={{
          [FieldId.NodeLabels]: [{ key: 'test-key', value: 'test-value' }],
          [FieldId.MachineType]: inputMetaProps,
          [FieldId.MachineTypeForceChoice]: inputMetaProps,
        }}
        onSubmit={() => {}}
      >
        <MachinePool />
      </Formik>,
    );
    const sectionToggle = screen.getByRole('button', { name: 'Add node labels' });
    expect(sectionToggle).toHaveAttribute('aria-expanded', 'true');
  });
});
