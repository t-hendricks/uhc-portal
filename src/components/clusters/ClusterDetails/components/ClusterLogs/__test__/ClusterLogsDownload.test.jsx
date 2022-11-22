import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@patternfly/react-core';
import ClusterLogsDownload from '../toolbar/ClusterLogsDownload';
import fixtures from './ClusterLogs.fixtures';

const mockDownloadClusterLogs = jest.fn();

const mockProps = {
  externalClusterID: fixtures[0].cluster_uuid,
  viewOptions: {},
  clusterLogs: {
    data: fixtures,
    requestDownloadState: {
      error: null,
    },
  },
  downloadClusterLogs: mockDownloadClusterLogs,
};

window.URL = {
  createObjectURL: () => jest.fn(),
};

describe('<ClusterLogsDownload />', () => {
  it('Renders modal with download button', () => {
    // So snapshots are not changed since the Download button uses moment() to get a timestamp
    Date.now = jest.fn(() => new Date(Date.UTC(2017, 7, 9, 8)).valueOf());

    const component = shallow(<ClusterLogsDownload {...mockProps} />);
    expect(component).toMatchSnapshot();
  });

  it('Returns externalClusterId and data on Download click', () => {
    const component = shallow(<ClusterLogsDownload {...mockProps} />);
    component.simulate('click');

    const downloadButton = component.find(Button).at(0);
    downloadButton.simulate('click');
    expect(mockDownloadClusterLogs).toBeCalledWith(
      fixtures[0].cluster_uuid,
      {
        currentPage: 1,
        pageSize: -1,
      },
      'json',
    );
  });
});
