import React from 'react';
import { shallow } from 'enzyme';

import IDPSection from './IDPSection';
import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';

const baseIDPs = {
  clusterIDPList: [],
  pending: false,
  fulfilled: true,
  error: false,
};

describe('<IDPSection />', () => {
  it('should render (no IDPs)', () => {
    const openModal = jest.fn();
    const wrapper = shallow(<IDPSection
      canEdit={false}
      clusterID="fake id"
      identityProviders={baseIDPs}
      clusterHibernating={false}
      openModal={openModal}
      clusterConsoleURL="http://example.com/"
    />);
    expect(wrapper).toMatchSnapshot();
    wrapper.find(ButtonWithTooltip).simulate('click');
    expect(openModal).toBeCalledWith('create-identity-provider');
  });

  it('should render (IDPs pending)', () => {
    const IDPs = {
      ...baseIDPs,
      pending: true,
      fulfilled: false,
    };

    const wrapper = shallow(<IDPSection
      canEdit={false}
      clusterHibernating={false}
      clusterID="fake id"
      identityProviders={IDPs}
      openModal={jest.fn()}
      clusterConsoleURL="http://example.com/"
    />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render (with IDPs)', () => {
    const IDPs = {
      ...baseIDPs,
      clusterIDPList: [
        {
          name: 'hello',
          type: 'GithubIdentityProvider',
          id: 'id',
        },
        {
          name: 'hi',
          type: 'GoogleIdentityProvider',
          id: 'id',
        },
      ],
      fulfilled: true,
    };

    const openModal = jest.fn();
    const wrapper = shallow(<IDPSection
      canEdit={false}
      clusterID="fake id"
      identityProviders={IDPs}
      clusterHibernating={false}
      openModal={openModal}
      clusterConsoleURL="http://example.com/"
    />);
    expect(wrapper).toMatchSnapshot();
    wrapper.find(ButtonWithTooltip).simulate('click');
    expect(openModal).toBeCalledWith('create-identity-provider');
  });
});
