import React from 'react';
import { shallow } from 'enzyme';
import ActionRequiredPopover from './ActionRequiredPopover';
import clusterStates from '../clusterStates';
import { normalizedProducts } from '../../../../common/subscriptionTypes';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('<ActionRequiredPopover />', () => {
  const rosaManualMode = {
    ...fixtures.clusterDetails.cluster,
    product: {
      id: normalizedProducts.ROSA,
    },
    aws: {
      sts: {
        auto_mode: false,
      },
    },
    state: clusterStates.WAITING,
  };

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <ActionRequiredPopover cluster={rosaManualMode} />,
    );
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
