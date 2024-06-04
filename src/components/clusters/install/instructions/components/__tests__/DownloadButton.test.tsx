import React from 'react';

import { eventNames, ocmResourceType } from '~/common/analytics';
import { tools } from '~/common/installLinks.mjs';
import * as useAnalytics from '~/hooks/useAnalytics';
import { render, screen } from '~/testUtils';

import DownloadButton from '../DownloadButton';

jest.mock('~/hooks/useAnalytics');
const useAnalyticsTrackMock = jest.fn();
jest.spyOn(useAnalytics, 'default').mockImplementation(() => useAnalyticsTrackMock);

describe('DownloadButton', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('check properties', () => {
    render(
      <DownloadButton
        pendoID="pendoID"
        url="URL"
        disabled={false}
        download
        text="whatever"
        name="NAME"
        tool={tools.ARMINSTALLER}
      />,
    );
    const button = screen.getByTestId(`download-btn-${tools.ARMINSTALLER}`) as any;
    expect(button).toHaveTextContent('whatever');
    expect(button.href).toBe('http://localhost/URL');
    expect(button.className).toContain('tool-aarch64-openshift-install');
    expect(button.getAttribute('download')).toBe('');
    expect(button.getAttribute('rel')).toBe(null);
    expect(button.getAttribute('target')).toBe(null);
  });

  it('check properties with undefined values', () => {
    render(<DownloadButton pendoID="pendoID" url="URL" />);
    const button = screen.getByTestId(`download-btn-${tools.X86INSTALLER}`) as any;
    expect(button).toHaveTextContent('Download installer');
    expect(button.href).toBe('http://localhost/URL');
    expect(button.className).toContain('tool-x86_64-openshift-install');
  });

  it('name property defined, check onClick', async () => {
    const { user } = render(<DownloadButton pendoID="pendoID" url="URL" name="NAME" />);
    const button = screen.getByTestId(`download-btn-${tools.X86INSTALLER}`) as any;

    await user.click(button);
    expect(useAnalyticsTrackMock).toHaveBeenCalledTimes(1);
    expect(useAnalyticsTrackMock).toHaveBeenCalledWith('NAME', 'pendoID');
  });

  it('name property undefined, check onClick', async () => {
    const { user } = render(<DownloadButton pendoID="pendoID" url="URL" />);
    const button = screen.getByTestId(`download-btn-${tools.X86INSTALLER}`) as any;

    await user.click(button);

    expect(useAnalyticsTrackMock).toHaveBeenCalledTimes(1);
    expect(useAnalyticsTrackMock).toHaveBeenCalledWith(
      {
        deprecated_name: 'OCP-Download-X86Installer',
        event: eventNames.FILE_DOWNLOADED,
        link_name: 'ocp-installer-x86',
        ocm_resource_type: ocmResourceType.OCP,
      },
      { path: 'pendoID', url: 'URL' },
    );
  });

  it('check download true value', () => {
    render(<DownloadButton pendoID="pendoID" url="URL" download />);

    const button = screen.getByTestId(`download-btn-${tools.X86INSTALLER}`) as any;

    expect(button.getAttribute('download')).toBe('');
  });

  it('check download undefined value', () => {
    render(<DownloadButton pendoID="pendoID" url="URL" />);

    const button = screen.getByTestId(`download-btn-${tools.X86INSTALLER}`) as any;

    expect(button.getAttribute('download')).toBe('');
  });

  it('check download false value', () => {
    render(<DownloadButton pendoID="pendoID" url="URL" download={false} />);

    const button = screen.getByTestId(`download-btn-${tools.X86INSTALLER}`) as any;

    expect(button.getAttribute('download')).toBe(null);
    expect(button.getAttribute('rel')).toBe('noreferrer noopener');
    expect(button.getAttribute('target')).toBe('_blank');
  });
});
