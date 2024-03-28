import React from 'react';
import { reduxForm } from 'redux-form';
import { render, screen, userEvent } from '~/testUtils';
import HTPasswdForm from './HTPasswdForm';

describe('HTPasswdForm', () => {
  const wizardConnector = (component) => reduxForm({ form: 'HTPasswdForm' })(component);
  const ConnectedHTPasswdBasicFields = wizardConnector(HTPasswdForm);

  it('shows disabled Add user while fields are empty', () => {
    const HTPasswdErrors = [
      {
        password: {
          emptyPassword: true,
          baseRequirements: false,
          uppercase: false,
          lowercase: false,
          numbersOrSymbols: false,
        },
        'password-confirm': 'Field is required',
      },
    ];
    render(<ConnectedHTPasswdBasicFields HTPasswdErrors={HTPasswdErrors} />);
    expect(screen.getByText('Add user')).toBeDisabled();
  });

  it('shows disabled Add user while fields have errors', async () => {
    const HTPasswdErrors = [
      {
        password: {
          emptyPassword: false,
          baseRequirements: true,
          uppercase: false,
          lowercase: true,
          numbersOrSymbols: false,
        },
        'password-confirm': 'The passwords do not match',
      },
    ];
    render(<ConnectedHTPasswdBasicFields HTPasswdErrors={HTPasswdErrors} />);
    expect(screen.getByText('Add user')).toBeDisabled();
  });

  it('shows enabled Add user while fields are populated and error free', async () => {
    render(<ConnectedHTPasswdBasicFields />);
    await userEvent.type(screen.getByLabelText('Username *'), 'test-user');
    await userEvent.type(screen.getByLabelText('Password *'), '1234faewd%Dadsfvaerwv');
    await userEvent.type(screen.getByLabelText('Confirm password *'), '1234faewd%Dadsfvaerwv');
    expect(screen.getByText('Add user').getAttribute('disabled')).toBe(null);
  });
});
