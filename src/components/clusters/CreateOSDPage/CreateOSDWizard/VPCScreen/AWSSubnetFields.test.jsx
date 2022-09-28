import React from 'react';
import { shallow } from 'enzyme';
import AWSSubnetFields from './AWSSubnetFields';

jest.mock('./useVPCInquiry', () => ({
  useAWSVPCInquiry: () => ({ fulfilled: true }),
}));

describe('<AWSSubnetFields />', () => {
  it('single AZ, private', () => {
    const wrapper = shallow(
      <AWSSubnetFields selectedRegion="fake-region" isMultiAz={false} privateLinkSelected />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('single AZ, private + public', () => {
    const wrapper = shallow(
      <AWSSubnetFields
        selectedRegion="fake-region"
        isMultiAz={false}
        privateLinkSelected={false}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('multi AZ, private', () => {
    const wrapper = shallow(
      <AWSSubnetFields selectedRegion="fake-region" isMultiAz privateLinkSelected />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('multi AZ, private + public', () => {
    const wrapper = shallow(
      <AWSSubnetFields selectedRegion="fake-region" isMultiAz privateLinkSelected={false} />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
