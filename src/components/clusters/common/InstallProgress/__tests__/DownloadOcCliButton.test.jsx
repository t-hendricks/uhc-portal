import React from 'react';
import * as ReactRedux from 'react-redux';

import { render, screen } from '@testUtils';

import * as DownloadUtils from '../../../../downloads/DownloadsPage/DownloadsPage';
import DownloadOcCliButton from '../DownloadOcCliButton';

describe('DownloadOcCliButton', () => {
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

  it('renders download link when href is defined', () => {
    detectOsSpy.mockReturnValueOnce('windows');
    render(<DownloadOcCliButton />);

    expect(screen.getByRole('link', { name: 'Download OC CLI' })).toBeVisible();
  });

  it('does not render download link when unable to detect an OS', () => {
    detectOsSpy.mockReturnValueOnce(null);
    render(<DownloadOcCliButton />);

    expect(screen.queryByRole('link', { name: 'Download OC CLI' })).toBeNull();
  });

  it('does not render download link when no githubReleases are found in store', () => {
    useSelectorSpy.mockReturnValueOnce(null);
    render(<DownloadOcCliButton />);

    expect(screen.queryByRole('link', { name: 'Download OC CLI' })).toBeNull();
  });

  it('does not render download link when unable to detect an OS architecture', () => {
    osArchitecturesSpy.mockReturnValueOnce(null);
    render(<DownloadOcCliButton />);

    expect(screen.queryByRole('link', { name: 'Download OC CLI' })).toBeNull();
  });
});
