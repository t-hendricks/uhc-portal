import React from 'react';
import { screen, render, waitFor, checkAccessibility, fireEvent } from '~/testUtils';
import AWSAccountSelection, { AWSAccountSelectionProps } from './AWSAccountSelection';

describe('AWSAccountSelection tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('select aws account id', async () => {
    // render dropdown
    const onChangeMock = jest.fn();
    defaultProps.input.onChange = onChangeMock;
    const { container, user } = render(
      <AWSAccountSelection {...defaultProps} />, // get defaultProps by putting bp at top of AWSAccountSelection in dev mode and capturing the properties
    );

    // click it open
    const dropdown = screen.getByText(/select an account/i);
    user.click(dropdown);

    await waitFor(() =>
      expect(screen.getByPlaceholderText(/Filter by account id/i)).toBeInTheDocument(),
    );

    // // type something into search
    const searchbox = screen.getByPlaceholderText(/Filter by account id/i);
    fireEvent.change(searchbox, { target: { value: '74' } });

    // click option
    await waitFor(() =>
      expect(
        screen.getByRole('option', {
          name: /74 3358436160/i,
        }),
      ).toBeInTheDocument(),
    );
    const option = screen.getByRole('option', {
      name: /74 3358436160/i,
    });
    user.click(option);

    // value won't be in component until redux action stuffs it back in here
    await waitFor(() => expect(onChangeMock.mock.calls[0][0]).toBe('743358436160'));

    // Assert
    await checkAccessibility(container);
  });
});

const defaultProps: AWSAccountSelectionProps = {
  label: 'Associated AWS infrastructure account',
  refresh: {
    text: 'Refresh to view newly associated AWS accounts and account-roles.',
    onRefresh: undefined,
  },
  accounts: [
    { cloud_account_id: '193684028217', cloud_provider_id: '', contracts: [] },
    { cloud_account_id: '800455929323', cloud_provider_id: '', contracts: [] },
    { cloud_account_id: '993442462734', cloud_provider_id: '', contracts: [] },
    { cloud_account_id: '743358436160', cloud_provider_id: '', contracts: [] },
    { cloud_account_id: '804939427164', cloud_provider_id: '', contracts: [] },
    { cloud_account_id: '097740742588', cloud_provider_id: '', contracts: [] },
  ],

  isLoading: false,
  isDisabled: false,
  input: {
    value: undefined,
    onChange: jest.fn(),
    onBlur: jest.fn(),
  },
  extendedHelpText: '',
  meta: {
    touched: false,
    error: '',
  },
};
