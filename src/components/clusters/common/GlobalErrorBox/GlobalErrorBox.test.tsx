import React from 'react';
import { useDispatch } from 'react-redux';

import { useGlobalState } from '~/redux/hooks';
import { checkAccessibility, render, screen, within } from '~/testUtils';

import GlobalErrorBox from './GlobalErrorBox';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));
const useDispatchMock = useDispatch as any as jest.Mock;

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));
const useGlobalStateMock = useGlobalState as jest.Mock;

describe('<GlobalErrorBox />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays error when an error title is provided', async () => {
    // Arrange
    const mockGlobalError = {
      errorTitle: 'I am an error title',
      errorMessage: 'I am an error message',
    };
    useGlobalStateMock.mockReturnValue(mockGlobalError);

    // Act
    const { container } = render(<GlobalErrorBox />);
    await checkAccessibility(container);

    // Assert
    expect(within(screen.getByRole('alert')).getByText('I am an error title')).toBeInTheDocument();
    expect(
      within(screen.getByRole('alert')).getByText('I am an error message'),
    ).toBeInTheDocument();
  });

  it('calls clearGlobalError when alert is closed', async () => {
    // Arrange
    const mockGlobalError = {
      errorTitle: 'I am an error title',
      errorMessage: 'I am an error message',
    };
    useGlobalStateMock.mockReturnValue(mockGlobalError);
    const closeDispatchMock = jest.fn();
    useDispatchMock.mockReturnValue(closeDispatchMock);

    // Act
    const { user } = render(<GlobalErrorBox />);

    // Assert
    expect(closeDispatchMock).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole('button', { name: 'Close Danger alert: alert: I am an error title' }),
    );
    expect(closeDispatchMock).toHaveBeenCalled();
  });

  it('should not render when errorMessage is empty', () => {
    // Arrange
    const mockGlobalError = {};
    useGlobalStateMock.mockReturnValue(mockGlobalError);

    // Act
    const { container } = render(<GlobalErrorBox />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });
});
