import React from 'react';
import { shallow } from 'enzyme';

import InsightsTable from '../components/Insights/InsightsTable';
import fixtures, { funcs } from './ClusterDetails.fixtures';

describe('<InsightsTable />', () => {
  const functions = funcs();

  const props = {
    cluster: fixtures.clusterDetails.cluster,
    insightsData: fixtures.insightsData,
    groups: [],
    disableRule: functions.disableRule,
    enableRule: functions.enableRule,
    openModal: functions.openModal,
  };

  const wrapper = shallow(<InsightsTable {...props} />);

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  // https://issues.redhat.com/browse/CCXDEV-3552
  it("should add 'cr' query parameter to the first doc url", () => {
    expect(wrapper.contains('https://docs.openshift.com/container-platform/4.1/installing/installing_bare_metal/installing-bare-metal.html?test=qwerty&cr=OCM#minimum-resource-requirements_installing-bare-metal'));
  });

  it("should add 'cr' query parameter to the second doc url", () => {
    expect(wrapper.contains('https://docs.openshift.com/container-platform/4.1/installing/installing_bare_metal/installing-bare-metal.html?test=42&cr=OCM'));
  });

  it("should add 'cr' query parameter to the third doc url", () => {
    expect(wrapper.contains('https://access.redhat.com/solutions/4972291?test=qwerty&cr=OCM#amazing'));
  });

  it("should not add 'cr' query parameter to non-doc url", () => {
    expect(wrapper.contains('https://google.com/test'));
    expect(!wrapper.contains('https://google.com/test?cr=OCM'));
  });
});
