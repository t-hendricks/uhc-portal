import React from 'react';
import { render, screen, checkAccessibility, TestRouter } from '~/testUtils';
import get from 'lodash/get';
import OCPInstructions from '../OCPInstructions';
import instructionsMapping from '../instructionsMapping';
import { architectures } from '../../../../../common/installLinks.mjs';

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
      const { container } = render(
        <TestRouter>
          <OCPInstructions {...option} token={{}} />
        </TestRouter>,
      );

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
