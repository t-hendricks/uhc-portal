import React from 'react';
import { shallow } from 'enzyme';
import ActionRequiredModal from './ActionRequiredModal';
import clusterStates from '../clusterStates';
import { normalizedProducts } from '../../../../common/subscriptionTypes';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('<ActionRequiredModal />', () => {
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
      <ActionRequiredModal cluster={rosaManualMode} isOpen onClose={() => {}} />,
    );
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
