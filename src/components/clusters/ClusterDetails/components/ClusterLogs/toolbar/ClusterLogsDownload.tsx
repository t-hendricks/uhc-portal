import React from 'react';
import moment from 'moment';
import { Alert, Button, FormGroup, Modal, Radio, Stack, StackItem } from '@patternfly/react-core';
import { serviceLogService } from '~/services';
import { createServiceLogQueryObject } from '~/common/queryHelpers';
import { Cluster } from '~/types/clusters_mgmt.v1';
import { ViewOptions } from '~/types/types';

type ClusterLogsDownloadProps = {
  externalClusterID: Cluster['external_id'];
  clusterID: Cluster['id'];
  viewOptions: ViewOptions;
};

const ClusterLogsDownload = ({
  externalClusterID,
  clusterID,
  viewOptions,
}: ClusterLogsDownloadProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [format, setFormat] = React.useState<'json' | 'csv'>('json');
  const [error, setError] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const close = () => {
    setIsOpen(false);
    setError(false);
  };

  const handleDowload = async () => {
    const query = createServiceLogQueryObject(
      {
        ...viewOptions,
        currentPage: 1, // Start from beginning
        pageSize: -1, // All data, no pagination
      },
      format,
    );

    try {
      setIsDownloading(true);
      setError(false);
      const { data } = await serviceLogService.getClusterHistory(
        externalClusterID,
        clusterID,
        query,
      );

      const timestamp = moment().format('YYYY-MM-DD HHmm');

      let formatted: any = data;
      if (format === 'json') {
        formatted = JSON.stringify(data);
      }
      const blob = new Blob([formatted], { type: 'octet/stream' });

      const link = document.createElement('a');
      link.setAttribute('href', window.URL.createObjectURL(blob));
      link.setAttribute('download', `${externalClusterID || clusterID}.${timestamp}.${format}`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      close();
    } catch (err) {
      setError(true);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)} data-testId="download-btn">
        Download history
      </Button>
      {isOpen && (
        <Modal
          variant="small"
          title="Download cluster history"
          isOpen
          onClose={isDownloading ? undefined : close}
          actions={[
            <Button
              data-testId="submit-btn"
              key="download"
              variant="primary"
              onClick={handleDowload}
              isDisabled={isDownloading}
              isLoading={isDownloading}
              spinnerAriaLabel="Loading cluster logs"
            >
              Download
            </Button>,
            <Button key="close" variant="link" onClick={close} isDisabled={isDownloading}>
              Cancel
            </Button>,
          ]}
        >
          <Stack hasGutter>
            <StackItem>
              <FormGroup label="Choose a file type">
                <Radio
                  id="json-format"
                  isChecked={format === 'json'}
                  name="format"
                  onChange={(checked) => checked && setFormat('json')}
                  label="JSON"
                  isDisabled={isDownloading}
                />
                <Radio
                  id="csv-format"
                  isChecked={format === 'csv'}
                  name="format"
                  onChange={(checked) => checked && setFormat('csv')}
                  label="CSV"
                  isDisabled={isDownloading}
                />
              </FormGroup>
            </StackItem>
            {error && (
              <StackItem>
                <Alert variant="danger" title="Unable to download records" isInline />
              </StackItem>
            )}
          </Stack>
        </Modal>
      )}
    </>
  );
};

export default ClusterLogsDownload;
