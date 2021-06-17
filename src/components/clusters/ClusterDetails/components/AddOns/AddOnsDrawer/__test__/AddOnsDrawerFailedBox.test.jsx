import React from 'react';
import { shallow } from 'enzyme';

import AddOnsFailedBox from '../AddOnsDrawerFailedBox';

describe('<AddOnsFailedBox />', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(<AddOnsFailedBox
      installedAddOn={{ state: 'failed', state_description: 'failed message' }}
    />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render alert box', () => {
    const AlertBox = wrapper.find('Alert').props();
    expect(AlertBox.title).toEqual('Add-on failed');

    const Flex = wrapper.find('Flex').props();
    expect(Flex.children[0].props.children).toEqual('failed message');

    const ExternalLink = wrapper.find('ExternalLink').props();
    expect(ExternalLink.children).toEqual('Contact support');
  });

  it('should render null if state is not failed', () => {
    wrapper.setProps({
      installedAddOn: { state: 'ready' },
    });
    expect(wrapper).toEqual({});
  });
});
