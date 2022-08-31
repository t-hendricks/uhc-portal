import axios from 'axios';

jest.mock('axios');

const mockApiRequest = axios as unknown as jest.Mocked<typeof axios> & jest.Mock;
mockApiRequest.mockRejectedValue({ status: 500 });
mockApiRequest.get.mockRejectedValue({ status: 500 });
mockApiRequest.post.mockRejectedValue({ status: 500 });
mockApiRequest.put.mockRejectedValue({ status: 500 });
mockApiRequest.patch.mockRejectedValue({ status: 500 });

export default mockApiRequest;
