import React from 'react';
import { AxiosResponse } from 'axios';
import { serviceLogService } from '~/services';
import { ClusterLogList } from '~/types/service_logs.v1';
import { fireEvent, render, screen, waitFor } from '~/testUtils';
import { ViewOptions } from '~/types/types';
import ClusterLogsDownload from '../toolbar/ClusterLogsDownload';
import fixtures from './ClusterLogs.fixtures';

const mockLogService = () => {
  const mock = jest.spyOn(serviceLogService, 'getClusterHistory');
  mock.mockReturnValue(
    Promise.resolve({
      data: [] as any as ClusterLogList,
    } as AxiosResponse<ClusterLogList, any>),
  );
  return mock;
};

const mockProps = {
  externalClusterID: fixtures[0].cluster_uuid,
  clusterID: fixtures[0].cluster_id,
  viewOptions: { sorting: { sortField: '' } } as ViewOptions,
};

(window as any).URL = {
  createObjectURL: jest.fn(),
};

describe('<ClusterLogsDownload />', () => {
  it('Calls log service on Download click', async () => {
    const mockDownloadClusterLogs = mockLogService();
    render(<ClusterLogsDownload {...mockProps} />);
    fireEvent.click(screen.getByTestId('download-btn'));

    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => expect(screen.queryByTestId('submit-btn')).not.toBeInTheDocument());
    expect(mockDownloadClusterLogs).toBeCalledWith(
      fixtures[0].cluster_uuid,
      fixtures[0].cluster_id,
      {
        page: 1,
        page_size: -1,
        format: 'json',
        order: ' desc',
      },
    );
  });
});
