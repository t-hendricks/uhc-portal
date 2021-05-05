const selfResourceReview = jest.fn();
selfResourceReview.mockResolvedValue({});

const selfAccessReview = jest.fn();
selfAccessReview.mockResolvedValue({});

const authorizationsService = {
  selfResourceReview,
  selfAccessReview,
};

export default authorizationsService;
