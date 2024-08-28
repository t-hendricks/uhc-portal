import React from 'react';
import get from 'lodash/get';

import { checkAccessibility, render, screen } from '~/testUtils';

import { architectures } from '../../../../../common/installLinks.mjs';
import instructionsMapping from '../instructionsMapping';
import OCPInstructions from '../OCPInstructions';

const ocpOptions = {};
const providers = [];
Object.keys(instructionsMapping).forEach((value) => {
  const cloudProviderID = value;
  const mapping = instructionsMapping[value];
  const { cloudProvider, customizations } = mapping;
  if (mapping.installer) {
    // not (yet) divided into x86/arm and/or ipi/upi
    ocpOptions[cloudProvider] = { cloudProviderID, customizations, ...mapping };
    providers.push(cloudProvider);
  } else {
    Object.values(architectures).forEach((arch) => {
      const ipi = get(mapping, [arch, 'ipi'], null);
      const upi = get(mapping, [arch, 'upi'], null);
      if (ipi) {
        ocpOptions[`${cloudProvider}-${arch}-ipi`] = { cloudProviderID, customizations, ...ipi };
        providers.push(`${cloudProvider}-${arch}-ipi`);
      }
      if (upi) {
        ocpOptions[`${cloudProvider}-${arch}-upi`] = { cloudProviderID, isUPI: true, ...upi };
        providers.push(`${cloudProvider}-${arch}-upi`);
      }
    });
    // not (yet) divided into x86/arm
    const ipi = get(mapping, 'ipi', null);
    const upi = get(mapping, 'upi', null);
    if (ipi) {
      ocpOptions[`${cloudProvider}-ipi`] = { cloudProviderID, customizations, ...ipi };
      providers.push(`${cloudProvider}-ipi`);
    }
    if (upi) {
      ocpOptions[`${cloudProvider}-upi`] = { cloudProviderID, isUPI: true, ...upi };
      providers.push(`${cloudProvider}-upi`);
    }
  }
});
providers.sort();

describe('<OCPInstructions />', () => {
  it.each(providers)(
    'is accessible with %s',
    async (provider) => {
      const option = ocpOptions[provider];
      const { container } = render(<OCPInstructions {...option} token={{}} />);

      expect(
        await screen.findByText(
          'Select the options that apply to your cluster in the dialog and save.',
        ),
      ).toBeInTheDocument();

      await checkAccessibility(container);
    },
    20000,
  );
});
