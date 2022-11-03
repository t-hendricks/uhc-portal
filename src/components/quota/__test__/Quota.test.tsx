import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@patternfly/react-core';

import * as Fixtures from './Quota.fixtures';
import Quota from '../Quota';
import OSDSubscriptionCard from '../OSDSubscriptionCard/OSDSubscriptionCard';
import OSDSubscriptionTable from '../OSDSubscriptionCard/OSDSubscriptionTable';
import SubscriptionNotFulfilled from '../SubscriptionNotFulfilled';

describe('<Quota />', () => {
  let wrapper;
  let refreshFn;
  describe('Quota', () => {
    beforeEach(() => {
      wrapper = shallow(<Quota {...Fixtures} />);
    });

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should call fetch method', () => {
      expect(Fixtures.fetchAccount).toBeCalled();
    });
    it('should have Header, OCP and OSD cards', () => {
      expect(wrapper.find('PageHeader').length).toEqual(1);
      expect(wrapper.find('Connect(OSDSubscriptionCard)').length).toEqual(1);
    });
  });

  describe('OSDSubscriptionCard', () => {
    beforeEach(() => {
      wrapper = shallow(<OSDSubscriptionCard {...Fixtures} />);
    });

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should call fetch method', () => {
      expect(Fixtures.fetchQuotaCost).toBeCalled();
    });
    it('should have OSDSubscriptionTable', () => {
      const tableComponent = wrapper.find('OSDSubscriptionTable');
      expect(tableComponent.length).toEqual(1);
      expect(tableComponent.props().rows.length).toEqual(Fixtures.expectedRowsForQuotaCost);
    });
  });

  describe('OSDSubscriptionTable', () => {
    beforeEach(() => {
      wrapper = shallow(<OSDSubscriptionTable {...Fixtures} />);
    });

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  // TODO: following tests should test OSDSubscriptionCard rather than
  //   directly calling SubscriptionNotFulfilled.
  describe('OSDSubscriptionCard Loading', () => {
    const quotaCost = { ...Fixtures.quotaCost, pending: true, type: 'osd' };
    beforeEach(() => {
      refreshFn = jest.fn();
      wrapper = shallow(<SubscriptionNotFulfilled data={quotaCost} refresh={refreshFn} />);
    });

    it('should render loading OSD quota summary', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Spinner').length).toEqual(1);
    });
  });

  describe('OSDSubscriptionCard Empty', () => {
    const quotaCost = { ...Fixtures.emptyQuotaCost, empty: true, type: 'osd' };
    beforeEach(() => {
      refreshFn = jest.fn();
      wrapper = shallow(<SubscriptionNotFulfilled data={quotaCost} refresh={refreshFn} />);
    });

    it('should render empty OSD quota summary', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('OSDSubscriptionCard Error', () => {
    const quotaCost = { ...Fixtures.quotaCost, error: true, type: 'osd' };
    beforeEach(() => {
      refreshFn = jest.fn();
      wrapper = shallow(<SubscriptionNotFulfilled data={quotaCost} refresh={refreshFn} />);
    });

    it('should render error OSD quota summary', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Button).length).toEqual(1);
      wrapper.find(Button).simulate('click');
      expect(refreshFn).toBeCalled();
    });
  });
});
