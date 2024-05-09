import React from 'react';
import { Formik } from 'formik';

import { checkAccessibility, render, screen } from '~/testUtils';

import { initialValues } from '../../constants';

import { EnableExternalAuthentication } from './EnableExternalAuthentication';

const buildTestComponent = (children: any, formValues = {}) => (
  <Formik
    initialValues={{
      ...initialValues,
      ...formValues,
    }}
    initialTouched={{}}
    onSubmit={() => {}}
  >
    {children}
  </Formik>
);

describe('<EnableExternalAuthentication />', () => {
  it('is accessible ', async () => {
    const { container } = render(buildTestComponent(<EnableExternalAuthentication />));

    // Assert
    await checkAccessibility(container);
  });

  it('renders what it is expected', () => {
    render(buildTestComponent(<EnableExternalAuthentication />));
    screen.getByText(/allow authentication to be handled by an external provider\./i);
  });
});
