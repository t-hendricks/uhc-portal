import React from 'react';
import { shallow } from 'enzyme';
import IDPSection from './IDPSection';

const baseIDPs = {
  clusterIDPList: [],
  pending: false,
  fulfilled: true,
  error: false,
};

const clusterUrls = {
  console: 'https://console-openshift-console.apps.test-liza.wiex.s1.devshift.org',
  api: 'https://api.test-liza.wiex.s1.devshift.org:6443',
};

describe('<IDPSection />', () => {
  it('should render (no IDPs)', () => {
    const openModal = jest.fn();
    const wrapper = shallow(
      <IDPSection
        canEdit={false}
        clusterID="fake id"
        subscriptionID="fake sub"
        identityProviders={baseIDPs}
        clusterHibernating={false}
        isReadOnly={false}
        isHypershift={false}
        openModal={openModal}
        clusterUrls={clusterUrls}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render (IDPs pending)', () => {
    const IDPs = {
      ...baseIDPs,
      pending: true,
      fulfilled: false,
    };

    const wrapper = shallow(
      <IDPSection
        canEdit={false}
        clusterHibernating={false}
        isReadOnly={false}
        clusterID="fake id"
        subscriptionID="fake sub"
        identityProviders={IDPs}
        isHypershift={false}
        openModal={jest.fn()}
        clusterUrls={clusterUrls}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('should render (with IDPs)', () => {
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

    const buildWrapper = ({ isHypershift }) => {
      const openModal = jest.fn();
      return shallow(
        <IDPSection
          canEdit={false}
          clusterID="fake id"
          subscriptionID="fake sub"
          identityProviders={IDPs}
          clusterHibernating={false}
          isReadOnly={false}
          isHypershift={isHypershift}
          openModal={openModal}
          clusterUrls={clusterUrls}
        />,
      );
    };

    it('non-Hypershift cluster', () => {
      const wrapper = buildWrapper({ isHypershift: false });
      expect(wrapper).toMatchSnapshot();
    });

    it('Hypershift cluster', () => {
      const wrapper = buildWrapper({ isHypershift: true });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
