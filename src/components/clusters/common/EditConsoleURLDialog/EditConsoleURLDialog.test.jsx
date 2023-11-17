import React from 'react';

import { screen, render, checkAccessibility, fireEvent, within } from '~/testUtils';

import EditConsoleURLDialog from './EditConsoleURLDialog';

describe('<EditConsoleURLDialog />', () => {
  const closeModal = jest.fn();
  const onClose = jest.fn();
  const submit = jest.fn();
  const resetResponse = jest.fn();

  const defaultProps = {
    isOpen: true,
    closeModal,
    onClose,
    submit,
    resetResponse,
    clusterID: 'my-cluster-id',
    subscriptionID: 'my-subscription-id',
    consoleURL: 'http://www.consoleURL.com',
    editClusterResponse: { errorMessage: '', error: false, fulfilled: false },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = render(<EditConsoleURLDialog {...defaultProps} />);
    await checkAccessibility(container);
  });

  it('when cancelled, calls closeModal but not onClose ', async () => {
    const { user } = render(<EditConsoleURLDialog {...defaultProps} />);
    expect(closeModal).not.toBeCalled();
    expect(resetResponse).not.toBeCalled();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(closeModal).toBeCalled();
    expect(resetResponse).toBeCalled();
    expect(onClose).not.toBeCalled();
  });

  it('submits when user clicks on  Save button', async () => {
    const { user } = render(<EditConsoleURLDialog {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('aria-disabled', 'true');

    // user.type doesn't trigger validation
    // await user.type(screen.getByRole('textbox'), 'http://www.my-new-console-ulr.com');
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'http://www.my-new-console-url.com' },
    });
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('aria-disabled', 'false');

    expect(submit).not.toBeCalled();

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(submit).toBeCalledWith(
      'my-cluster-id',
      'my-subscription-id',
      'http://www.my-new-console-url.com',
    );
  });

  it('shows error box when an error occurs', () => {
    const newProps = {
      ...defaultProps,
      editClusterResponse: { error: true, errorMessage: 'this is an error' },
    };

    render(<EditConsoleURLDialog {...newProps} />);

    expect(
      within(screen.getByRole('alert', { name: 'Danger Alert' })).getByText('this is an error'),
    ).toBeInTheDocument();
  });
});
