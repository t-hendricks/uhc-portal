import { renderHook } from '@testing-library/react';

import { vpcList } from '~/components/clusters/common/__tests__/vpcs.fixtures';
import * as vpcInquiries from '~/components/clusters/common/useVPCInquiry';
import { VPCResponse } from '~/redux/reducers/ccsInquiriesReducer';

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: jest.fn().mockImplementation((selector) => selector()),
}));

// Mocks for the v1 case (ROSA wizard)
jest.mock('~/components/clusters/common/v1VpcSelectors', () => ({
  isVpcInquiryValidSelector: jest.fn().mockImplementation(() => false),
  vpcInquiryRequestSelector: jest.fn().mockImplementation(() => ({
    cloudProviderID: 'aws',
    region: 'us-west-2-v1',
    credentials: 'fake-credentials',
  })),
  vpcsSelector: jest.fn().mockImplementation(() => ({
    data: { items: vpcList },
    fulfilled: true,
    pending: false,
    error: false,
  })),
}));

// Mocks for the v2 case (OSD wizard)
jest.mock('~/components/clusters/wizards/hooks', () => ({
  useFormState: () => ({
    values: {
      region: 'us-west-2-v2',
    },
  }),
}));

describe('useAWSVPCInquiry', () => {
  describe('when isOSD=false', () => {
    it('builds the request from the redux-form (v1) state', () => {
      const view = renderHook(() => vpcInquiries.useAWSVPCInquiry(false));
      const { requestParams } = view.result.current as {
        requestParams: { region: string };
      };
      expect(requestParams.region).toEqual('us-west-2-v1');
    });

    it('returns the vpcsResponse from the redux store', () => {
      const view = renderHook(() => vpcInquiries.useAWSVPCInquiry(false));
      const { vpcs } = view.result.current as { vpcs: VPCResponse };
      expect(vpcs.data.items[0].id).toEqual(vpcList[0].id);
    });
  });

  describe('when isOSD=true', () => {
    it('builds the request from the Formik (v2) state', () => {
      const view = renderHook(() => vpcInquiries.useAWSVPCInquiry(true));
      const { requestParams } = view.result.current as {
        requestParams: { region: string };
      };
      expect(requestParams.region).toEqual('us-west-2-v2');
    });

    it('returns the vpcsResponse from the redux store', () => {
      const view = renderHook(() => vpcInquiries.useAWSVPCInquiry(true));
      const { vpcs } = view.result.current as { vpcs: VPCResponse };
      expect(vpcs.data.items[0].id).toEqual(vpcList[0].id);
    });
  });
});
