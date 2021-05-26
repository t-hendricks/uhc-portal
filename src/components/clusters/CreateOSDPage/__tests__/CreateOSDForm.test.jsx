import React from 'react';
import { shallow } from 'enzyme';
import CreateOSDForm from '../CreateOSDForm/CreateOSDForm';
import { normalizedProducts } from '../../../../common/subscriptionTypes';

describe('CreateOSDForm;', () => {
  it('should render', () => {
    const wrapper = shallow(<CreateOSDForm
      openModal={jest.fn()}
      closeModal={jest.fn()}
      change={jest.fn()}
      cloudProviderID="aws"
      privateClusterSelected={false}
      product={normalizedProducts.OSD}
      canAutoScale={false}
      autoscalingEnabled={false}
      hasRhInfraQuota
      hasBYOCQuota={false}
    />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with BYOC quota', () => {
    const wrapper = shallow(<CreateOSDForm
      openModal={jest.fn()}
      closeModal={jest.fn()}
      change={jest.fn()}
      cloudProviderID="aws"
      privateClusterSelected={false}
      product={normalizedProducts.OSD}
      canAutoScale={false}
      autoscalingEnabled={false}
      hasRhInfraQuota={false}
      hasBYOCQuota
    />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with etcd encryption checbox', () => {
    const wrapper = shallow(<CreateOSDForm
      openModal={jest.fn()}
      closeModal={jest.fn()}
      change={jest.fn()}
      cloudProviderID="aws"
      privateClusterSelected={false}
      product={normalizedProducts.OSD}
      canEnableEtcdEncryption
      canAutoScale={false}
      autoscalingEnabled={false}
      hasRhInfraQuota
      hasBYOCQuota={false}
    />);

    expect(wrapper.find('Field[name="etcd_encryption"]').length).toEqual(1);
  });

  it('should render OSDTrial with availability zone', () => {
    const wrapper = shallow(<CreateOSDForm
      openModal={jest.fn()}
      closeModal={jest.fn()}
      change={jest.fn()}
      cloudProviderID="aws"
      privateClusterSelected={false}
      product={normalizedProducts.OSDTrial}
      canAutoScale={false}
      autoscalingEnabled={false}
      hasRhInfraQuota
      hasBYOCQuota={false}
    />);

    expect(wrapper).toMatchSnapshot();
  });
});
