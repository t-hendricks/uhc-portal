import React from 'react';
import { shallow } from 'enzyme';
import CreateOSDForm from '../CreateOSDForm';

import { awsRhInfraGcpRhInfraClustersQuota } from '../../common/__test__/quota.fixtures';

describe('CreateOSDForm;', () => {
  it('should render', () => {
    const wrapper = shallow(<CreateOSDForm
      openModal={jest.fn()}
      closeModal={jest.fn()}
      change={jest.fn()}
      clustersQuota={awsRhInfraGcpRhInfraClustersQuota}
      cloudProviderID="aws"
      privateClusterSelected={false}
      product="OSD"
    />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with etcd encryption checbox', () => {
    const wrapper = shallow(<CreateOSDForm
      openModal={jest.fn()}
      closeModal={jest.fn()}
      change={jest.fn()}
      clustersQuota={awsRhInfraGcpRhInfraClustersQuota}
      cloudProviderID="aws"
      privateClusterSelected={false}
      product="OSD"
      canEnableEtcdEncryption
    />);

    expect(wrapper.find('Field[name="etcd_encryption"]').length).toEqual(1);
  });
});
