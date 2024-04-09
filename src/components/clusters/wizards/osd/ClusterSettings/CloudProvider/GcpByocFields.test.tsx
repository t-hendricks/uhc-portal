import * as React from 'react';
import { Formik } from 'formik';

import { billingModels } from '~/common/subscriptionTypes';
import { render, screen } from '~/testUtils';

import { FieldId, initialValues } from '../../constants';

import { GcpByocFields } from './GcpByocFields';

describe('<GcpByocFields />', () => {
  it('should not show the Google terms prerequisite if the billing model is not marketplace-gcp', async () => {
    render(
      <Formik
        initialValues={{
          ...initialValues,
          [FieldId.BillingModel]: billingModels.MARKETPLACE,
        }}
        onSubmit={() => {}}
      >
        <GcpByocFields />
      </Formik>,
    );
    expect(screen.queryByText('Have you prepared your Google account?')).not.toBeInTheDocument();
  });

  it('should show the Google terms prerequisite if the billing model is marketplace-gcp', async () => {
    render(
      <Formik
        initialValues={{
          ...initialValues,
          [FieldId.BillingModel]: billingModels.MARKETPLACE_GCP,
        }}
        onSubmit={() => {}}
      >
        <GcpByocFields />
      </Formik>,
    );
    expect(screen.queryByText('Have you prepared your Google account?')).toBeInTheDocument();
  });
});
