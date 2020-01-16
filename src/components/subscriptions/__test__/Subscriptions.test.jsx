import React from 'react';
import { shallow } from 'enzyme';

import { Button } from '@patternfly/react-core';

import { subscriptionStatuses } from '../../../common/subscriptionTypes';

import * as Fixtures from './Subscriptions.fixtures';
import Subscriptions from '../Subscriptions';
import OCPSubscriptionCard from '../OCPSubscriptionCard/OCPSubscriptionCard';
import OSDSubscriptionCard from '../OSDSubscriptionCard/OSDSubscriptionCard';
import OCPSubscriptionSummary from '../OCPSubscriptionCard/OCPSubscriptionSummary';
import OCPSubscriptionCategory from '../OCPSubscriptionCard/OCPSubscriptionCategory';
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
      expect(wrapper.find('Connect(OCPSubscriptionCard)').length).toEqual(1);
      expect(wrapper.find('Connect(OSDSubscriptionCard)').length).toEqual(1);
    });
  });

  describe('OCPSubscriptionCard', () => {
    const wrapper = shallow(<OCPSubscriptionCard {...Fixtures} />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should call fetch method', () => {
      const search = [
        `status NOT IN ('${subscriptionStatuses.ARCHIVED}','${subscriptionStatuses.DEPROVISIONED}')`,
        "managed = 'FALSE'",
        `organization_id='${Fixtures.organizationID}'`,
      ];
      expect(Fixtures.fetchSubscriptions).toBeCalledWith({
        search: search.join(' AND '),
        size: -1,
      });
    });
    it('should have OCPSubscriptionSummary', () => {
      const summaryComponent = wrapper.find('OCPSubscriptionSummary');
      expect(summaryComponent.length).toEqual(1);
      expect(summaryComponent.props().stats).toEqual(Fixtures.stats);
    });
  });

  describe('OSDSubscriptionCard', () => {
    const wrapper = shallow(<OSDSubscriptionCard {...Fixtures} />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should call fetch method', () => {
      expect(Fixtures.fetchQuotaSummary).toBeCalled();
    });
    it('should have OSDSubscriptionTable', () => {
      const tableComponent = wrapper.find('OSDSubscriptionTable');
      expect(tableComponent.length).toEqual(1);
      expect(tableComponent.props().rows.length).toEqual(Fixtures.quotaSummary.items.length);
    });
  });

  describe('OCPSubscriptionSummary', () => {
    const wrapper = shallow(<OCPSubscriptionSummary {...Fixtures} />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should have all categories', () => {
      expect(wrapper.find('OCPSubscriptionCategory').length).toEqual(2);
    });
  });

  describe('OCPSubscriptionCategory', () => {
    const nonEmptyCategory = shallow(<OCPSubscriptionCategory {...Fixtures.categories.nonEmpty} />);
    it('should render non-empty category', () => {
      expect(nonEmptyCategory).toMatchSnapshot();
    });
    it('should have all links', () => {
      expect(nonEmptyCategory.find('Link').length).toEqual(2);
    });

    const emptyCategory = shallow(<OCPSubscriptionCategory {...Fixtures.categories.empty} />);
    it('should not render empty category', () => {
      expect(emptyCategory.type()).toBeNull();
    });
  });

  describe('OSDSubscriptionTable', () => {
    const wrapper = shallow(<OSDSubscriptionTable {...Fixtures} />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('OCPSubscriptionCard Loading', () => {
    const refreshFn = jest.fn();
    const subscriptions = { ...Fixtures.subscriptions, pending: true, type: 'ocp' };
    const wrapper = shallow(<SubscriptionNotFulfilled data={subscriptions} refresh={refreshFn} />);

    it('should render loading OCP subscriptions', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Spinner').length).toEqual(1);
    });
  });

  describe('OSDSubscriptionCard Loading', () => {
    const refreshFn = jest.fn();
    const quotaSummary = { ...Fixtures.quotaSummary, pending: true, type: 'osd' };
    const wrapper = shallow(<SubscriptionNotFulfilled data={quotaSummary} refresh={refreshFn} />);

    it('should render loading OSD quota summary', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Spinner').length).toEqual(1);
    });
  });

  describe('OCPSubscriptionCard Empty', () => {
    const refreshFn = jest.fn();
    const subscriptions = { ...Fixtures.subscriptions, empty: true, type: 'ocp' };
    const wrapper = shallow(<SubscriptionNotFulfilled data={subscriptions} refresh={refreshFn} />);

    it('should render empty OCP subscriptions', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Link').length).toEqual(1);
      expect(wrapper.find('Link').props().to).toEqual('/install');
    });
  });

  describe('OSDSubscriptionCard Empty', () => {
    const refreshFn = jest.fn();
    const quotaSummary = { ...Fixtures.quotaSummary, empty: true, type: 'osd' };
    const wrapper = shallow(<SubscriptionNotFulfilled data={quotaSummary} refresh={refreshFn} />);

    it('should render empty OSD quota summary', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('OCPSubscriptionCard Error', () => {
    const refreshFn = jest.fn();
    const subscriptions = { ...Fixtures.subscriptions, error: true, type: 'ocp' };
    const wrapper = shallow(<SubscriptionNotFulfilled data={subscriptions} refresh={refreshFn} />);

    it('should render error OCP subscriptions', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Button).length).toEqual(1);
      wrapper.find(Button).simulate('click');
      expect(refreshFn).toBeCalled();
    });
  });

  describe('OSDSubscriptionCard Error', () => {
    const refreshFn = jest.fn();
    const quotaSummary = { ...Fixtures.quotaSummary, error: true, type: 'osd' };
    const wrapper = shallow(<SubscriptionNotFulfilled data={quotaSummary} refresh={refreshFn} />);

    it('should render error OSD quota summary', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Button).length).toEqual(1);
      wrapper.find(Button).simulate('click');
      expect(refreshFn).toBeCalled();
    });
  });
});
