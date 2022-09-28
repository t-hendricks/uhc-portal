import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Modal } from '@patternfly/react-core';
import { find } from 'lodash';
import { ReduxFormRadioGroup } from '../../../../../common/ReduxFormComponents';
import ErrorTriangle from '../../../../common/ErrorTriangle';
import './ClusterLogsDownload.scss';

class ClusterLogsDownload extends React.Component {
  options = [
    {
      label: 'JSON',
      value: 'json',
      isChecked: true,
    },
    { label: 'CSV', value: 'csv' },
  ];

  state = {
    isOpen: false,
  };

  closeModal = () => {
    this.setState((state) => ({
      isOpen: !state.isOpen,
    }));
  };

  handleChange = () => {
    this.options.forEach((option, index) => {
      this.options[index].isChecked = !option.isChecked;
    });
    this.handleClick(false);
  };

  getFormat = () => {
    const option = find(this.options, ['isChecked', true]);
    const format = option.value;
    return format;
  };

  handleClick = (withModal) => {
    const { externalClusterID, downloadClusterLogs, viewOptions } = this.props;

    downloadClusterLogs(
      externalClusterID,
      {
        ...viewOptions,
        currentPage: 1, // Start from beginning
        pageSize: -1, // All data, no pagination
      },
      this.getFormat(),
    );
    if (withModal) {
      this.setState((state) => ({
        isOpen: !state.isOpen,
      }));
    }
  };

  renderDownloadButton() {
    const {
      clusterLogs: { externalClusterID, data },
    } = this.props;

    let url;
    let download;
    const timestamp = moment().format('YYYY-MM-DD HHmm');

    const format = this.getFormat();
    if (format === 'json') {
      const json = JSON.stringify(data);
      const blob = new Blob([json], { type: 'octet/stream' });
      url = window.URL.createObjectURL(blob);
      download = `${externalClusterID}.${timestamp}.json`;
    } else if (format === 'csv') {
      const blob = new Blob([data], { type: 'octet/stream' });
      url = window.URL.createObjectURL(blob);
      download = `${externalClusterID}.${timestamp}.csv`;
    } else {
      return `Unsupported format ${format}`;
    }

    return [
      <Button
        id="cluster-logs-download-button"
        key="download"
        variant="primary"
        component="a"
        href={url}
        target="_blank"
        download={download}
        onClick={() => this.closeModal()}
        isDisabled={!data}
      >
        Download
      </Button>,
      <Button key="close" variant="link" onClick={() => this.closeModal()}>
        Cancel
      </Button>,
    ];
  }

  render() {
    const {
      clusterLogs: {
        requestDownloadState: { error },
      },
    } = this.props;
    const { isOpen } = this.state;
    return (
      <>
        <Button variant="primary" onClick={() => this.handleClick(true)}>
          Download history
        </Button>
        <Modal
          variant="small"
          title="Download cluster history"
          isOpen={isOpen}
          onClose={() => this.closeModal()}
          actions={[this.renderDownloadButton()]}
        >
          <ReduxFormRadioGroup
            name="export_history"
            fieldId="export_history"
            label="Choose a file type"
            items={this.options}
            onChange={this.handleChange}
          />
          {error && (
            <>
              <ErrorTriangle
                item="records"
                errorMessage="Unable to download"
                className="cluster-list-warning"
              />
              Unable to download records
            </>
          )}
        </Modal>
      </>
    );
  }
}

ClusterLogsDownload.propTypes = {
  externalClusterID: PropTypes.string.isRequired,
  viewOptions: PropTypes.object.isRequired,
  clusterLogs: PropTypes.object.isRequired,
  downloadClusterLogs: PropTypes.func.isRequired,
};

export default ClusterLogsDownload;
