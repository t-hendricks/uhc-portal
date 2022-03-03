import React from 'react';
import { shallow } from 'enzyme';

import UpgradeAcknowledgeWarning from '../UpgradeAcknowledgeWarning/UpgradeAcknowledgeWarning';

const unMetAcks = [{ title: 'myUnmetAcks' }];
const metAcks = [{ title: 'myMetAcks' }];

describe('<UpgradeAcknowledgeWarning>', () => {
  let wrapper;
  const openModal = jest.fn();
  beforeEach(() => {
    openModal.mockClear();
    wrapper = shallow(
      <UpgradeAcknowledgeWarning
        openModal={openModal}
        clusterId="myClusterId"
        fromVersion="4.8.10"
        toVersion="4.9.11"
        getAcks={[unMetAcks, metAcks]}
        openshiftVersion="my.openshift.version"
      />,
    );
  });

  it('Displays nothing if cluster id is unknown', () => {
    wrapper.setProps({
      clusterId: undefined,
    });
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('Displays nothing if openshiftVersion is unknown', () => {
    wrapper.setProps({
      openshiftVersion: undefined,
    });
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('Display empty fragment if no clusterUnmetAcks AND do not show confirm', () => {
    wrapper.setProps({
      showConfirm: false,
      getAcks: [[], metAcks],
    });
    expect(wrapper).toMatchInlineSnapshot('<Fragment />');
  });

  it('Display confirmation if there is only clusterMetAcks', () => {
    wrapper.setProps({
      showConfirm: true,
      getAcks: [[], metAcks],
    });
    expect(wrapper.find('[data-testid="confirmAckReceived"]')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('Display infoCircle if isManual AND if is Info', () => {
    wrapper.setProps({
      isManual: true,
      isInfo: true,
      getAcks: [unMetAcks, []],
    });
    expect(wrapper.find('[data-testid="infoMessageUnmetAcks"]')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('Display empty fragment if isManual AND if is not Info', () => {
    wrapper.setProps({
      isManual: true,
      isInfo: false,
      getAcks: [unMetAcks, []],
    });
    expect(wrapper).toMatchInlineSnapshot('<Fragment />');
  });

  it('Display alert if is not manual', () => {
    wrapper.setProps({
      isManual: false,
      getAcks: [unMetAcks, []],
    });
    expect(wrapper.find('[data-testid="alertMessageUnmetAcks"]')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('Set correct info when opening modal', () => {
    wrapper.setProps({
      isManual: false,
      isPlain: true,
      getAcks: [unMetAcks, []],
    });
    expect(wrapper.find('[data-testid="alertMessageUnmetAcks"]')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
});
