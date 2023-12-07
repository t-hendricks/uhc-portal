import { CloudVPC } from '~/types/clusters_mgmt.v1';

import { renderHook } from '@testing-library/react';
import { VPCResponse } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesReducer';
import { vpcList } from '~/components/clusters/common/__test__/vpcs.fixtures';

import * as vpcInquiries from '../useVPCInquiry';

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: jest.fn().mockImplementation((selector) => selector()),
}));

// Mocks for the v1 case (ROSA wizard)
jest.mock('~/components/clusters/CreateOSDPage/CreateOSDWizard/VPCScreen/v1VpcSelectors', () => ({
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

describe('useVPCInquiry', () => {
  describe('filterOutRedHatManagedVPCs', () => {
    it('filters out VPCs which are managed by Red Hat', () => {
      const filteredVPCs = vpcInquiries.filterOutRedHatManagedVPCs(vpcList);
      expect(filteredVPCs).toHaveLength(4);

      const remainingVPCNames = filteredVPCs.map((vpc: CloudVPC) => vpc.name);
      expect(remainingVPCNames).not.toContain('jaosorior-8vns4-vpc');
      expect(remainingVPCNames).toContain('lz-p2-318-z6fst-vpc');
    });
  });

  describe('useAWSVPCInquiry', () => {
    describe('when isOSD=false', () => {
      it('builds the request from the redux-form (v1) state', () => {
        const inquiryHook = renderHook(() => vpcInquiries.useAWSVPCInquiry(false));
        const { requestParams } = inquiryHook.result.current as {
          requestParams: { region: string };
        };
        expect(requestParams.region).toEqual('us-west-2-v1');
      });

      it('returns the vpcsResponse from the redux store', () => {
        const inquiryHook = renderHook(() => vpcInquiries.useAWSVPCInquiry(false));
        const { vpcs } = inquiryHook.result.current as { vpcs: VPCResponse };
        expect(vpcs.data.items[0].id).toEqual(vpcList[0].id);
      });
    });

    describe('when isOSD=true', () => {
      it('builds the request from the Formik (v2) state', () => {
        const inquiryHook = renderHook(() => vpcInquiries.useAWSVPCInquiry(true));
        const { requestParams } = inquiryHook.result.current as {
          requestParams: { region: string };
        };
        expect(requestParams.region).toEqual('us-west-2-v2');
      });

      it('returns the vpcsResponse from the redux store', () => {
        const inquiryHook = renderHook(() => vpcInquiries.useAWSVPCInquiry(true));
        const { vpcs } = inquiryHook.result.current as { vpcs: VPCResponse };
        expect(vpcs.data.items[0].id).toEqual(vpcList[0].id);
      });
    });
  });
});
