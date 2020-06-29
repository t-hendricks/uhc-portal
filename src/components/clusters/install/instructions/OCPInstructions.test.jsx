import React from 'react';
import { shallow } from 'enzyme';
import get from 'lodash/get';
import OCPInstructions from './OCPInstructions';
import instructionsMapping from './instructionsMapping';

const ocpOptions = [];
// eslint-disable-next-line no-unused-vars
Object.entries(instructionsMapping).forEach(([_, value]) => {
  const { cloudProvider } = value;
  const ipi = get(value, 'ipi', null);
  const upi = get(value, 'upi', null);
  if (ipi && upi) {
    ocpOptions.push({ cloudProvider, ...ipi });
    ocpOptions.push({ cloudProvider, ...upi });
  } else {
    ocpOptions.push({ ...value });
  }
});

describe('Every OCP instruction page should render: ', () => test.each(ocpOptions)('%o', (option) => {
  const wrapper = shallow(<OCPInstructions {...option} token={{}} />);
  expect(wrapper).toMatchSnapshot();
}, 20000));
