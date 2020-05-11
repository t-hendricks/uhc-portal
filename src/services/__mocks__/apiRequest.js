const mockApiRequest = jest.fn();
mockApiRequest.mockRejectedValue({ status: 500 });
export default mockApiRequest;
