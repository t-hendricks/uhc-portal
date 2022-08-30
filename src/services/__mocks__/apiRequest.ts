import axios from 'axios';

jest.mock('axios');
const mockApiRequest = axios;
mockApiRequest.mockRejectedValue({ status: 500 });
export default mockApiRequest;
