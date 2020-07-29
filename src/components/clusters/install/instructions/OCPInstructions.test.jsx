import React from 'react';
import { shallow } from 'enzyme';
import get from 'lodash/get';
import OCPInstructions from './OCPInstructions';
import instructionsMapping from './instructionsMapping';

const ocpOptions = {};
const providers = [];
Object.values(instructionsMapping).forEach((value) => {
  const { cloudProvider, customizations } = value;
  const ipi = get(value, 'ipi', null);
  const upi = get(value, 'upi', null);
  if (ipi && upi) {
    ocpOptions[`${cloudProvider}-ipi`] = ({ cloudProvider, customizations, ...ipi });
    providers.push(`${cloudProvider}-ipi`);
    ocpOptions[`${cloudProvider}-upi`] = ({ cloudProvider, customizations, ...upi });
    providers.push(`${cloudProvider}-upi`);
  } else {
    ocpOptions[cloudProvider] = { ...value };
    providers.push(cloudProvider);
  }
});
providers.sort();

describe('Every OCP instruction page should render: ', () => test.each(providers)('%s', (provider) => {
  const option = ocpOptions[provider];
  const wrapper = shallow(<OCPInstructions {...option} token={{}} />);
  expect(wrapper).toMatchSnapshot();
}, 20000));
