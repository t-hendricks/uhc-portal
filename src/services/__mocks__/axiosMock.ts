import axios from 'axios';

jest.mock('axios');

const mockAxios = axios as unknown as jest.Mocked<typeof axios> & jest.Mock;

mockAxios.mockRejectedValue({ status: 500 });
mockAxios.get.mockRejectedValue({ status: 500 });
mockAxios.post.mockRejectedValue({ status: 500 });
mockAxios.put.mockRejectedValue({ status: 500 });
mockAxios.patch.mockRejectedValue({ status: 500 });

export default mockAxios;
