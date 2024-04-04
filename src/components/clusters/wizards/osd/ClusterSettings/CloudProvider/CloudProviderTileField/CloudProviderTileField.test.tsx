import * as React from 'react';
import { Formik, Form } from 'formik';
import { checkAccessibility, screen, waitFor, render, userEvent } from '~/testUtils';
import { FieldId, initialValues } from '~/components/clusters/wizards/osd/constants';
import { CloudProviderType } from '~/components/clusters/wizards/common';
import { CloudProviderTileField } from './CloudProviderTileField';

jest.mock('~/components/clusters/wizards/osd/BillingModel/useGetBillingQuotas', () => ({
  useGetBillingQuotas: () => ({
    gcpResources: true,
    awsResources: true,
  }),
}));

const expectCloudProviderToBe = (submitFn: jest.Mock, value: string) => {
  expect(submitFn).toHaveBeenCalledWith(
    expect.objectContaining({
      [FieldId.CloudProvider]: value,
    }),
    expect.anything(),
  );
};

describe('<CloudProviderTileField />', () => {
  const defaultValues = {
    ...initialValues,
  };

  const awsLabel = 'Amazon Web Service logo Run on Amazon Web Services';
  const gcpLabel = 'Run on Google Cloud Platform';

  it('is accessible', async () => {
    const { container } = render(
      <Formik initialValues={defaultValues} onSubmit={() => {}}>
        <CloudProviderTileField />
      </Formik>,
    );

    await checkAccessibility(container);
  });

  it('shows AWS and GCP options with AWS as default selection', async () => {
    render(
      <Formik initialValues={defaultValues} onSubmit={() => {}}>
        <Form>
          <CloudProviderTileField />
        </Form>
      </Formik>,
    );

    expect(screen.getByRole('option', { name: awsLabel, selected: true })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: gcpLabel, selected: false })).toBeInTheDocument();
  });

  it('allows changing provider', async () => {
    const handleSubmit = jest.fn();
    const { user } = render(
      <Formik initialValues={defaultValues} onSubmit={handleSubmit}>
        <Form>
          <CloudProviderTileField />
          <button type="submit">Submit</button>
        </Form>
      </Formik>,
    );

    expect(screen.getByRole('option', { name: gcpLabel, selected: false })).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: gcpLabel, selected: false }));

    expect(screen.getByRole('option', { name: gcpLabel, selected: true })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expectCloudProviderToBe(handleSubmit, CloudProviderType.Gcp));
  });

  it('allows changing provider with keyboard', async () => {
    const handleSubmit = jest.fn();
    const { user } = render(
      <Formik initialValues={defaultValues} onSubmit={handleSubmit}>
        <Form>
          <CloudProviderTileField />
          <button type="submit">Submit</button>
        </Form>
      </Formik>,
    );

    expect(screen.getByRole('option', { name: gcpLabel, selected: false })).toBeInTheDocument();

    screen.getByRole('option', { name: gcpLabel, selected: false }).focus();

    await userEvent.type(
      screen.getByRole('option', { name: gcpLabel, selected: false }),
      '{enter}',
      { skipClick: true },
    );

    expect(screen.getByRole('option', { name: gcpLabel, selected: true })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expectCloudProviderToBe(handleSubmit, CloudProviderType.Gcp));
  });
});
