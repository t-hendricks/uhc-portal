import React from 'react';

import { checkAccessibility, render, screen, waitFor } from '~/testUtils';

import AWSAccountSelection from '../AWSAccountSelection';

import { defaultProps } from './AWSAccountSelection.fixtures';

describe('AWSAccountSelection tests', () => {
  afterEach(() => {
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

    expect(await screen.findByPlaceholderText(/Filter by account id/i)).toBeInTheDocument();

    // // type something into search
    const searchbox = screen.getByPlaceholderText(/Filter by account id/i);
    await user.clear(searchbox);
    await user.type(searchbox, '74');

    // click option
    expect(
      await screen.findByRole('option', {
        name: /74 3358436160/i,
      }),
    ).toBeInTheDocument();

    const option = screen.getByRole('option', {
      name: /74 3358436160/i,
    });
    user.click(option);

    // value won't be in component until redux action stuffs it back in here
    await waitFor(() => expect(onChangeMock.mock.calls[0][0]).toBe('743358436160'));

    // Assert
    await checkAccessibility(container);
  });

  it('field is required if required prop is set to true', () => {
    const onChangeMock = jest.fn();

    defaultProps.input.onChange = onChangeMock;
    const newProps = {
      ...defaultProps,
      isBillingAccount: true,
      label: 'AWS billing account',
      required: true,
    };
    const { container } = render(<AWSAccountSelection {...newProps} />);

    // Unfortunately the only way to tell if the field is required is to find the hidden "*" in the label tag
    expect(container.querySelector('label')?.textContent).toEqual('AWS billing account *');
  });

  it('field is not required if required prop is set to false', () => {
    const onChangeMock = jest.fn();

    defaultProps.input.onChange = onChangeMock;
    const newProps = {
      ...defaultProps,
      isBillingAccount: true,
      label: 'AWS billing account',
      required: false,
    };
    const { container } = render(<AWSAccountSelection {...newProps} />);

    // Unfortunately the only way to tell if the field is required is to find the hidden "*" in the label tag
    expect(container.querySelector('label')?.textContent).toEqual('AWS billing account *');
  });

  it('field is required if required prop is not set (aka default to required)', () => {
    const onChangeMock = jest.fn();

    defaultProps.input.onChange = onChangeMock;
    const newProps = {
      ...defaultProps,
      isBillingAccount: true,
      label: 'AWS billing account',
    };
    expect(newProps.required).toBeUndefined();
    const { container } = render(<AWSAccountSelection {...newProps} />);

    // Unfortunately the only way to tell if the field is required is to find the hidden "*" in the label tag
    expect(container.querySelector('label')?.textContent).toEqual('AWS billing account *');
  });
});
