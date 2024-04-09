import React from 'react';
import { Formik } from 'formik';

import { render } from '~/testUtils';

import { initialValues } from '../../rosa/constants';

import { BillingModel } from './BillingModel';

const buildTestComponent = () => (
  <Formik
    initialValues={{
      ...initialValues,
    }}
    initialTouched={{}}
    onSubmit={() => {}}
  >
    <BillingModel />
  </Formik>
);

describe('<BillingModel />', () => {
  describe('check initial state', () => {
    it('is default infrastructure type ok?', () => {
      const { container } = render(buildTestComponent());
      const byocRadioCCSOption = container.querySelector('#form-radiobutton-byoc-true-field');
      expect(byocRadioCCSOption).toBeInTheDocument();
      expect(byocRadioCCSOption).toHaveAttribute('checked');
    });
  });
});
