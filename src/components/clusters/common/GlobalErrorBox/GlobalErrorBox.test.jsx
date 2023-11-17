import React from 'react';
import { screen, render, checkAccessibility, within } from '~/testUtils';
import GlobalErrorBox from './GlobalErrorBox';

describe('<GlobalErrorBox />', () => {
  const clearGlobalError = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays error when an error title is provided', async () => {
    const { container } = render(
      <GlobalErrorBox errorTitle="I am an error title" clearGlobalError={clearGlobalError} />,
    );
    await checkAccessibility(container);

    expect(within(screen.getByRole('alert')).getByText('I am an error title')).toBeInTheDocument();
  });

  it('calls clearGlobalError when alert is closed', async () => {
    const { user } = render(
      <GlobalErrorBox errorTitle="I am an error title" clearGlobalError={clearGlobalError} />,
    );

    expect(clearGlobalError).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole('button', { name: 'Close Danger alert: alert: I am an error title' }),
    );
    expect(clearGlobalError).toHaveBeenCalled();
  });

  it('should not render when errorMessage is empty', () => {
    const { container } = render(<GlobalErrorBox clearGlobalError={clearGlobalError} />);

    expect(container).toBeEmptyDOMElement();
  });
});
