import React from 'react';
import * as ReactRedux from 'react-redux';

import { render, screen, axe } from '@testUtils';

import * as DownloadUtils from '../../../downloads/DownloadsPage/DownloadsPage';
import DownloadOcCliButton from './DownloadOcCliButton';

const downloadButtonText = 'Download OC CLI';

describe('<DownloadOcCliButton />', () => {
  const useSelectorSpy = jest.spyOn(ReactRedux, 'useSelector');
  const detectOsSpy = jest.spyOn(DownloadUtils, 'detectOS');
  const osArchitecturesSpy = jest.spyOn(DownloadUtils, 'architecturesForToolOS');

  beforeAll(() => {
    useSelectorSpy.mockReturnValue(() => ({
      githubReleases: {
        'openshift-online/ocm-cli': {
          error: false,
          errorDetails: null,
          errorMessage: '',
          fulfilled: false,
          pending: false,
        },
      },
    }));
  });

  it('shows download link when OS is detected and is accessible', async () => {
    // Arrange
    detectOsSpy.mockReturnValueOnce('windows');
    const { container } = render(<DownloadOcCliButton />);

    // Assert
    expect(screen.getByRole('link', { name: downloadButtonText })).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('hides download link when unable to detect an OS', () => {
    // Arrange
    detectOsSpy.mockReturnValueOnce(null);
    render(<DownloadOcCliButton />);

    // Assert
    expect(screen.queryByRole('link', { name: downloadButtonText })).not.toBeInTheDocument();
  });

  it('hides download link when no githubReleases are found in store', () => {
    // Arrange
    useSelectorSpy.mockReturnValueOnce(null);
    render(<DownloadOcCliButton />);

    // Assert
    expect(screen.queryByRole('link', { name: downloadButtonText })).not.toBeInTheDocument();
  });

  it('hides download link when unable to detect an OS architecture', () => {
    // Arrange
    osArchitecturesSpy.mockReturnValueOnce(null);
    render(<DownloadOcCliButton />);

    // Assert
    expect(screen.queryByRole('link', { name: downloadButtonText })).not.toBeInTheDocument();
  });
});
