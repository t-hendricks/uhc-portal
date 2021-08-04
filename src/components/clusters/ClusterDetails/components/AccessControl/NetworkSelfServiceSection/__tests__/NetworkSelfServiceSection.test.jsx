import React from 'react';
import { shallow } from 'enzyme';

import NetworkSelfServiceSection from '../NetworkSelfServiceSection';

jest.useFakeTimers();

const baseResponse = {
  fulfilled: false,
  pending: false,
  error: false,
};
const fakeGrants = [
  {
    user_arn: 'fake-arn',
    state: 'pending',
    role: {
      id: 'network-mgmt',
    },
    id: 'fake-id-1',
    roleName: 'Network Management',
    console_url: 'http://example.com',
  },
  {
    user_arn: 'fake-arn2',
    state: 'pending',
    role: {
      id: 'read-only',
    },
    id: 'fake-id-2',
    roleName: 'Read Only',
    console_url: 'http://example.com',
  },
];

describe('<NetworkSelfServiceSection />', () => {
  let wrapper;
  let getRoles;
  let getGrants;
  let deleteGrant;
  let openAddGrantModal;
  let addNotification;

  beforeAll(() => {
    getRoles = jest.fn();
    getGrants = jest.fn();
    deleteGrant = jest.fn();
    openAddGrantModal = jest.fn();
    addNotification = jest.fn();

    wrapper = shallow(
      <NetworkSelfServiceSection
        canEdit
        getRoles={getRoles}
        getGrants={getGrants}
        deleteGrant={deleteGrant}
        openAddGrantModal={openAddGrantModal}
        addNotification={addNotification}
        grants={{ ...baseResponse, data: [] }}
        deleteGrantResponse={baseResponse}
        addGrantResponse={baseResponse}
        clusterHibernating={false}
      />,
    );
  });

  it('should render with no data', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call getGrants and getRoles on mount', () => {
    expect(getRoles).toBeCalled();
    expect(getGrants).toBeCalled();
  });

  it('should open modal when needed', () => {
    wrapper.find('.access-control-add').simulate('click');
    expect(setTimeout).toBeCalledTimes(1);
    jest.runAllTimers();
    expect(openAddGrantModal).toBeCalled();
  });

  it('should call getGrants() when a grant is added', () => {
    wrapper.setProps({ addGrantResponse: { ...baseResponse, pending: true } });
    wrapper.setProps({ addGrantResponse: { ...baseResponse, fulfilled: true } });
    expect(getGrants).toHaveBeenCalledTimes(2); // one on mount, one on refresh
  });

  it('should call getGrants() when a grant is removed', () => {
    wrapper.setProps({ deleteGrantResponse: { ...baseResponse, pending: true } });
    wrapper.setProps({ deleteGrantResponse: { ...baseResponse, fulfilled: true } });
    expect(getGrants).toHaveBeenCalledTimes(3); // one on mount, one in previous test case, one now
  });

  it('should render skeleton when pending and no grants are set', () => {
    wrapper.setProps({ grants: { ...baseResponse, pending: true, data: [] } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Skeleton').length).toBeGreaterThan(0);
  });

  it('should render with grants', () => {
    wrapper.setProps({
      grants: {
        ...baseResponse,
        fulfilled: true,
        data: fakeGrants,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should notify when a grant fails', () => {
    wrapper.setProps({ grants: { ...baseResponse, pending: true, data: fakeGrants } });
    wrapper.setProps({
      grants: {
        ...baseResponse,
        fulfilled: true,
        data: [
          {
            ...fakeGrants[0],
            state: 'failed',
            state_description: 'some failure',
          },
          fakeGrants[1],
        ],
      },
    });
    expect(addNotification).toBeCalledWith({
      variant: 'danger',
      title: 'Role creation failed for fake-arn',
      description: 'some failure',
      dismissDelay: 8000,
      dismissable: false,
    });
    expect(wrapper).toMatchSnapshot();
  });
  it('should notify when a grant succeeds', () => {
    wrapper.setProps({ grants: { ...baseResponse, pending: true, data: fakeGrants } });
    wrapper.setProps({
      grants: {
        ...baseResponse,
        fulfilled: true,
        data: [
          fakeGrants[0],
          {
            ...fakeGrants[1],
            state: 'ready',
          },
        ],
      },
    });
    expect(addNotification).toBeCalledWith({
      variant: 'success',
      title: 'Read Only role successfully created for fake-arn2',
      dismissDelay: 8000,
      dismissable: false,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should disable add button when canEdit is false', () => {
    wrapper = shallow(
      <NetworkSelfServiceSection
        canEdit={false}
        getRoles={getRoles}
        getGrants={getGrants}
        deleteGrant={deleteGrant}
        openAddGrantModal={openAddGrantModal}
        addNotification={addNotification}
        grants={{ ...baseResponse, fulfilled: true, data: fakeGrants }}
        deleteGrantResponse={baseResponse}
        addGrantResponse={baseResponse}
        clusterHibernating={false}
      />,
    );
    expect(wrapper.find('.access-control-add').props().disableReason).toBeTruthy();
  });
});
