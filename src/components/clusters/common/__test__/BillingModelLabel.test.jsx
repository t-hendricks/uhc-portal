import React from 'react';
import { shallow } from 'enzyme';

import BillingModelLabel from '../BillingModelLabel';
import { normalizedProducts } from '../../../../common/subscriptionTypes';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('BillingModelLabel', () => {
  it('for OSD rhInfra cluster', () => {
    const { cluster } = fixtures.clusterDetails;
    const wrapper = shallow(<BillingModelLabel cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('for OSD CCS cluster', () => {
    const cluster = {
      ...fixtures.clusterDetails.cluster,
      ccs: {
        enabled: true,
      },
    };
    const wrapper = shallow(<BillingModelLabel cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('for OSDTrial CCS cluster', () => {
    const cluster = {
      ...fixtures.clusterDetails.cluster,
      product: {
        id: normalizedProducts.OSDTrial,
      },
      ccs: {
        enabled: true,
      },
    };
    const wrapper = shallow(<BillingModelLabel cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('for ROSA cluster', () => {
    const cluster = {
      ...fixtures.clusterDetails.cluster,
      product: {
        id: normalizedProducts.ROSA,
      },
      ccs: {
        enabled: true,
      },
    };
    const wrapper = shallow(<BillingModelLabel cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });
});
