import React from 'react';
import { mount, shallow } from 'enzyme';
import Modal from '../../../common/Modal/Modal';

import HibernateClusterModal from './HibernateClusterModal';
import ErrorBox from '../../../common/ErrorBox';

describe('<HibernateClusterModal />', () => {
  let wrapper;
  const closeModal = jest.fn();
  const onClose = jest.fn();
  const submit = jest.fn();
  const resetResponses = jest.fn();
  const upgradeScheduleRequest = jest.fn();
  const getSchedules = jest.fn();
  const history = { push: jest.fn() };
  const buttonSelector = variant => (`Button[variant="${variant}"]`);

  beforeEach(() => {
    wrapper = shallow(<HibernateClusterModal
      isOpen
      getSchedules={getSchedules}
      clusterUpgrades={{ errorMessage: '', error: false, items: [] }}
      history={history}
      hibernateClusterResponse={{ errorMessage: '', error: false }}
      upgradeScheduleRequest={upgradeScheduleRequest}
      closeModal={closeModal}
      onClose={onClose}
      submit={submit}
      resetResponses={resetResponses}
      clusterName="some-name"
      clusterID="some-id"
      subscriptionID="some-other-id"
    />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when an error occurs', () => {
    wrapper.setProps({ hibernateClusterResponse: { error: true, errorMessage: 'this is an error' } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ErrorBox).length).toEqual(1);
  });

  it('renders correctly when pending', () => {
    wrapper.setProps({
      hibernateClusterResponse:
        { pending: true, error: false, fulfilled: false },
    });
    expect(wrapper).toMatchSnapshot();
    const modal = wrapper.find(Modal);
    expect(modal.props().isPending).toBeTruthy();
  });

  describe('mounted ', () => {
    beforeEach(() => {
      wrapper = mount(<HibernateClusterModal
        isOpen
        getSchedules={getSchedules}
        clusterUpgrades={{ errorMessage: '', error: false, items: [] }}
        history={history}
        hibernateClusterResponse={{ errorMessage: '', error: false }}
        upgradeScheduleRequest={upgradeScheduleRequest}
        closeModal={closeModal}
        onClose={onClose}
        submit={submit}
        resetResponses={resetResponses}
        clusterName="some-name"
        clusterID="some-id"
        subscriptionID="some-other-id"
      />);
    });

    it('when cancelled, calls closeModal but not onClose ', () => {
      wrapper.find('.pf-m-secondary').at(0).simulate('click');
      expect(closeModal).toBeCalled();
      expect(resetResponses).toBeCalled();
      expect(onClose).not.toBeCalled();
    });

    it('submits correctly', () => {
      wrapper.find(buttonSelector('primary')).at(0).simulate('click');
      expect(submit).toBeCalled();
      wrapper.setProps({ hibernateClusterResponse: { fulfilled: true } });
      setTimeout(() => {
        expect(closeModal).toBeCalled();
        expect(onClose).toBeCalled();
      }, 0);
    });

    it('when fulfilled, closes dialog', () => {
      wrapper.setProps({ hibernateClusterResponse: { fulfilled: true, errorMessage: '' } });
      expect(closeModal).toBeCalled();
      expect(resetResponses).toBeCalled();
      expect(onClose).toBeCalled();
    });
  });
});
