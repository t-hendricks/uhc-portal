import * as React from 'react';
import { Formik } from 'formik';

import { waitFor } from '@testing-library/react';

import { acknowledgePrerequisites } from '~/common/validators';
import { checkAccessibility, render, screen } from '~/testUtils';

import { CheckboxField } from './CheckboxField';

const label =
  "I've read and completed all the prerequisites and am ready to continue creating my cluster.";
const validationError = 'Acknowledge that you have read and completed all prerequisites.';
const prepareComponent = () => (
  <Formik
    initialValues={{
      fieldName: false,
    }}
    initialTouched={{
      fieldName: true,
    }}
    validateOnChange={false}
    onSubmit={() => {}}
  >
    {(props) => (
      <>
        <CheckboxField name="fieldName" label={label} validate={acknowledgePrerequisites} />
        <button type="submit" onClick={() => props.handleSubmit()}>
          Submit
        </button>
      </>
    )}
  </Formik>
);

describe('<CheckboxField />', () => {
  it('is accessible', async () => {
    const { container } = render(prepareComponent());

    await checkAccessibility(container);
  });

  describe('Required Checkbox field', () => {
    it('shows a validation error if the checkbox has not been checked', async () => {
      const { user } = render(prepareComponent());

      expect(await screen.findByText(label)).toBeInTheDocument();

      expect(screen.queryByText(validationError)).not.toBeInTheDocument();

      expect(
        screen.getByRole('checkbox', {
          name: label,
        }),
      ).not.toBeChecked();

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(await screen.findByText(validationError)).toBeInTheDocument();
    });

    it('validates the field after checking it', async () => {
      const { user } = render(prepareComponent());

      expect(await screen.findByText(label)).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(await screen.findByText(validationError)).toBeInTheDocument();

      expect(
        screen.getByRole('checkbox', {
          name: label,
        }),
      ).not.toBeChecked();

      await user.click(
        screen.getByRole('checkbox', {
          name: label,
        }),
      );

      expect(
        screen.getByRole('checkbox', {
          name: label,
        }),
      ).toBeChecked();

      expect(await screen.findByText(validationError)).not.toBeInTheDocument();
    });

    it('validates the field consistently after multiple value changes', async () => {
      const { user } = render(prepareComponent());

      expect(await screen.findByText(label)).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(await screen.findByText(validationError)).toBeInTheDocument();

      await user.click(screen.getByText(label));

      expect(
        screen.getByRole('checkbox', {
          name: label,
        }),
      ).toBeChecked();

      expect(await screen.findByText(validationError)).not.toBeInTheDocument();

      await user.click(screen.getByText(label));

      expect(
        screen.getByRole('checkbox', {
          name: label,
        }),
      ).not.toBeChecked();

      expect(await screen.findByText(validationError)).toBeInTheDocument();

      await user.click(screen.getByText(label));

      expect(
        screen.getByRole('checkbox', {
          name: label,
        }),
      ).toBeChecked();

      await waitFor(() => {
        expect(screen.queryByText(validationError)).not.toBeInTheDocument();
      });
    });
  });
});
