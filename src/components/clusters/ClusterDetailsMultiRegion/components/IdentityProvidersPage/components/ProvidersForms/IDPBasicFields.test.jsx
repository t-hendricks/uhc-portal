import React from 'react';
import { reduxForm } from 'redux-form';

import { render, screen } from '~/testUtils';

import IDPBasicFields from './IDPBasicFields';

describe('IDPBasicFields', () => {
  const wizardConnector = (component) => reduxForm({ form: 'IDPBasicFields' })(component);
  const ConnectedIDPBasicFields = wizardConnector(IDPBasicFields);

  it('shows disabled inputs while loading', () => {
    render(<ConnectedIDPBasicFields isPending />);
    expect(screen.getByLabelText('Client ID *')).toBeDisabled();
    expect(screen.getByLabelText('Client secret *')).toBeDisabled();
  });

  it('check properties when isPending false', () => {
    render(<ConnectedIDPBasicFields isPending={false} />);
    expect(screen.getByLabelText('Client ID *').getAttribute('disabled')).toBe(null);
    expect(screen.getByLabelText('Client secret *').getAttribute('disabled')).toBe(null);
  });

  it('check properties when isPending is undefined', () => {
    render(<ConnectedIDPBasicFields />);
    expect(screen.getByLabelText('Client ID *').getAttribute('disabled')).toBe(null);
    expect(screen.getByLabelText('Client secret *').getAttribute('disabled')).toBe(null);
  });
});
