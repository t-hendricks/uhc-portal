import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@patternfly/react-core';

import * as Fixtures from './Subscriptions.fixtures';
import Subscriptions from '../Subscriptions';
import OCPSubscriptionCard from '../OCPSubscriptionCard/OCPSubscriptionCard';
import OSDSubscriptionCard from '../OSDSubscriptionCard/OSDSubscriptionCard';
import OSDSubscriptionTable from '../OSDSubscriptionCard/OSDSubscriptionTable';
import SubscriptionNotFulfilled from '../SubscriptionNotFulfilled';

describe('<Subscriptions />', () => {
  describe('Subscriptions', () => {
    const wrapper = shallow(<Subscriptions {...Fixtures} />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should call fetch method', () => {
      expect(Fixtures.fetchAccount).toBeCalled();
    });
    it('should have Header, OCP and OSD cards', () => {
      expect(wrapper.find('PageHeader').length).toEqual(1);
      expect(wrapper.find('OCPSubscriptionCard').length).toEqual(1);
      expect(wrapper.find('Connect(OSDSubscriptionCard)').length).toEqual(1);
    });
  });

  describe('OCPSubscriptionCard', () => {
    const wrapper = shallow(<OCPSubscriptionCard {...Fixtures} />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('OSDSubscriptionCard', () => {
    const wrapper = shallow(<OSDSubscriptionCard {...Fixtures} />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should call fetch method', () => {
      expect(Fixtures.fetchQuotaCost).toBeCalled();
    });
    it('should have OSDSubscriptionTable', () => {
      const tableComponent = wrapper.find('OSDSubscriptionTable');
      expect(tableComponent.length).toEqual(1);
      expect(tableComponent.props().rows.length).toEqual(Fixtures.quotaCost.items.length);
    });
  });

  describe('OSDSubscriptionTable', () => {
    const wrapper = shallow(<OSDSubscriptionTable {...Fixtures} />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('OSDSubscriptionCard Loading', () => {
    const refreshFn = jest.fn();
    const quotaCost = { ...Fixtures.quotaCost, pending: true, type: 'osd' };
    const wrapper = shallow(<SubscriptionNotFulfilled data={quotaCost} refresh={refreshFn} />);

    it('should render loading OSD quota summary', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Spinner').length).toEqual(1);
    });
  });

  describe('OSDSubscriptionCard Empty', () => {
    const refreshFn = jest.fn();
    const quotaCost = { ...Fixtures.quotaCost, empty: true, type: 'osd' };
    const wrapper = shallow(<SubscriptionNotFulfilled data={quotaCost} refresh={refreshFn} />);

    it('should render empty OSD quota summary', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('OSDSubscriptionCard Error', () => {
    const refreshFn = jest.fn();
    const quotaCost = { ...Fixtures.quotaCost, error: true, type: 'osd' };
    const wrapper = shallow(<SubscriptionNotFulfilled data={quotaCost} refresh={refreshFn} />);

    it('should render error OSD quota summary', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Button).length).toEqual(1);
      wrapper.find(Button).simulate('click');
      expect(refreshFn).toBeCalled();
    });
  });
});
