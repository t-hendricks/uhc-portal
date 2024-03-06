import { AxiosHeaders, AxiosResponse } from 'axios';
import { MachineConfigurationProps } from '~/components/clusters/common/MachineConfiguration';
import { KubeletConfig } from '~/types/clusters_mgmt.v1';

export const existingConfigResponse: AxiosResponse<KubeletConfig> = {
  status: 200,
  statusText: '',
  headers: {},
  data: {
    href: '/api/clusters_mgmt/v1/clusters/12345/kubelet_config',
    kind: 'KubeletConfig',
    pod_pids_limit: 6000,
  },
  config: { headers: new AxiosHeaders() },
};

export const defaultProps: MachineConfigurationProps = {
  clusterID: '12345',
  onClose: jest.fn(),
  getMachineConfiguration: () =>
    new Promise<AxiosResponse<KubeletConfig>>((resolve) => {
      resolve(existingConfigResponse);
    }),
  createMachineConfiguration: jest.fn(),
  updateMachineConfiguration: jest.fn(),
  canBypassPIDsLimit: false,
};

export const ResponseError404 = {
  status: 404,
  statusText: '',
  config: {},
  headers: {},
  data: {
    kind: 'Error',
    id: '404',
    href: '/api/clusters_mgmt/v1/errors/404',
    code: 'CLUSTERS-MGMT-404',
    reason: "KubeletConfig for cluster with ID '12345' is not found",
    operation_id: '1fca1997-d505-48d8-bc7a-a179ea28c6d3',
  },
};
