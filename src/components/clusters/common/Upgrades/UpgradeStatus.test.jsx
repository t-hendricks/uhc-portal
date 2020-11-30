import React from 'react';
import { shallow } from 'enzyme';

import UpgradeStatus from './UpgradeStatus';

const schedule = {
  version: '1.2.4',
  next_run: '2020-12-01T00:00:00.00Z',
  state: {
    value: 'pending',
  },
  schedule_type: 'manual',
};

describe('<UpgradeStatus />', () => {
  describe('when cluster is up to date', () => {
    const wrapper = shallow(
      <UpgradeStatus
        clusterID="fake"
        availableUpgrades={[]}
        canEdit
        clusterVersion="1.2.3"
        onCancelClick={() => {}}
        openModal={() => {}}
      />,
    );
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should not have a cancel button', () => {
      expect(wrapper.find('Button#ocm-upgrade-status-cancel').length).toEqual(0);
    });
    it('should show a CheckCircleIcon', () => {
      expect(wrapper.find('CheckCircleIcon').length).toEqual(1);
    });
  });
  describe('when updates are available', () => {
    const wrapper = shallow(
      <UpgradeStatus
        clusterID="fake"
        availableUpgrades={['1.2.4']}
        canEdit
        clusterVersion="1.2.3"
        onCancelClick={() => {}}
        openModal={() => {}}
      />,
    );
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should show an OutlinedArrowAltCircleUpIcon', () => {
      expect(wrapper.find('OutlinedArrowAltCircleUpIcon').length).toEqual(1);
    });
  });
  describe('when a manual update is scheduled', () => {
    const openModal = jest.fn();
    const onCancelClick = jest.fn();
    const wrapper = shallow(
      <UpgradeStatus
        clusterID="fake"
        availableUpgrades={['1.2.4']}
        canEdit
        clusterVersion="1.2.3"
        scheduledUpgrade={schedule}
        onCancelClick={onCancelClick}
        openModal={openModal}
      />,
    );
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should show an OutlinedArrowAltCircleUpIcon', () => {
      expect(wrapper.find('OutlinedArrowAltCircleUpIcon').length).toEqual(1);
    });

    it('cancel button should be functional', () => {
      const cancelBtn = wrapper.find('Button#ocm-upgrade-status-cancel');
      expect(cancelBtn.exists()).toBeTruthy();
      cancelBtn.simulate('click');
      expect(onCancelClick).toBeCalled();
      expect(openModal).toBeCalledWith('cancel-upgrade', { clusterID: 'fake', schedule });
    });

    it('should show the scheduled time', () => {
      expect(wrapper.find('DateFormat').length).toEqual(1);
    });

    it('should not show cancel button when canEdit is false', () => {
      wrapper.setProps({ canEdit: false });
      expect(wrapper.find('Button#ocm-upgrade-status-cancel').length).toEqual(0);
    });
  });
  describe('when an automatic update is scheduled', () => {
    const wrapper = shallow(
      <UpgradeStatus
        clusterID="fake"
        availableUpgrades={['1.2.4']}
        canEdit
        clusterVersion="1.2.3"
        scheduledUpgrade={{
          ...schedule,
          schedule_type: 'automatic',
        }}
        onCancelClick={() => {}}
        openModal={() => {}}
      />,
    );
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should show an OutlinedArrowAltCircleUpIcon', () => {
      expect(wrapper.find('OutlinedArrowAltCircleUpIcon').length).toEqual(1);
    });

    it('should not have a cancel button', () => {
      expect(wrapper.find('Button#ocm-upgrade-status-cancel').length).toEqual(0);
    });
  });

  describe('when an update is in progress', () => {
    const wrapper = shallow(
      <UpgradeStatus
        clusterID="fake"
        availableUpgrades={['1.2.4']}
        canEdit
        clusterVersion="1.2.3"
        scheduledUpgrade={{
          ...schedule,
          state: {
            value: 'started',
          },
        }}
        onCancelClick={() => {}}
        openModal={() => {}}
      />,
    );
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should show an InProgressIcon', () => {
      expect(wrapper.find('InProgressIcon').length).toEqual(1);
    });

    it('should not have a cancel button', () => {
      expect(wrapper.find('Button#ocm-upgrade-status-cancel').length).toEqual(0);
    });

    it('should not show date', () => {
      expect(wrapper.find('DateFormat').length).toEqual(0);
    });
  });
});
