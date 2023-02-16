import React from 'react';
import { shallow } from 'enzyme';

import DetailsLeft from '../components/Overview/DetailsLeft';
import fixtures from './ClusterDetails.fixtures';
import { knownProducts } from '~/common/subscriptionTypes';
import { screen, render } from '~/testUtils';

const getCluster = (productType) => {
  if (productType === knownProducts.OCP_Assisted_Install) {
    return fixtures.AIClusterDetails.cluster;
  }
  if (productType === knownProducts.ROSA_HyperShift) {
    return fixtures.ROSAHypershiftClusterDetails.cluster;
  }
  return fixtures.clusterDetails.cluster;
};

describe('<DetailsLeft />', () => {
  const wrapper = (productType) =>
    shallow(
      <DetailsLeft
        cluster={getCluster(productType)}
        cloudProviders={fixtures.cloudProviders}
        showAssistedId={productType === knownProducts.OCP_Assisted_Install}
      />,
    );

  it('should render', () => {
    expect(wrapper(knownProducts.OSD)).toMatchSnapshot();
  });

  it('should show the extra AI cluster details', () => {
    expect(wrapper(knownProducts.OCP_Assisted_Install)).toMatchSnapshot();
  });

  it('should show Multi-Zone for Hypershift cluster details', () => {
    const azComponent = wrapper(knownProducts.ROSA_HyperShift).find('[data-testid="availability"]');
    expect(azComponent.html()).toContain('Multi-zone');
    const { container } = render(
      <DetailsLeft
        cluster={getCluster(knownProducts.ROSA_HyperShift)}
        cloudProviders={fixtures.cloudProviders}
        showAssistedId={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should show control plane type as Hosted if hypershift', () => {
    render(
      <DetailsLeft
        cluster={fixtures.ROSAHypershiftClusterDetails.cluster}
        cloudProviders={fixtures.cloudProviders}
      />,
    );
    expect(screen.getByTestId('controlType', 'Hosted')).toBeInTheDocument();
  });

  it('hide control plane type if not hypershift', () => {
    const controlTypeComponent = wrapper(knownProducts.OSD).find('[data-testid="controlType"]');
    expect(controlTypeComponent).toHaveLength(0);
  });
});
