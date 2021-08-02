import React from 'react';
import { shallow } from 'enzyme';
import get from 'lodash/get';
import OCPInstructions from '../OCPInstructions';
import instructionsMapping from '../instructionsMapping';

const ocpOptions = {};
const providers = [];
Object.values(instructionsMapping).forEach((value) => {
  const { cloudProvider, customizations } = value;
  const cloudProviderID = cloudProvider;
  const ipi = get(value, 'ipi', null);
  const upi = get(value, 'upi', null);
  if (ipi && upi) {
    ocpOptions[`${cloudProviderID}-ipi`] = ({ cloudProviderID, customizations, ...ipi });
    providers.push(`${cloudProviderID}-ipi`);
    ocpOptions[`${cloudProviderID}-upi`] = ({ cloudProviderID, customizations, ...upi });
    providers.push(`${cloudProviderID}-upi`);
  } else {
    ocpOptions[cloudProviderID] = { ...value, cloudProviderID };
    providers.push(cloudProviderID);
  }
});
providers.sort();

describe('Every OCP instruction page should render: ', () => test.each(providers)('%s', (provider) => {
  const option = ocpOptions[provider];
  const wrapper = shallow(<OCPInstructions {...option} token={{}} />);
  expect(wrapper).toMatchSnapshot();
}, 20000));
