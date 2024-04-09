import React from 'react';

import { render, screen } from '~/testUtils';

import instructionsMapping from './instructionsMapping';

jest.mock('./AdditionalInstructionsS390x', () => () => (
  <div data-testid="additional-instructions-mock">MachinePoolNodeWarning</div>
));

describe('instructionsMapping', () => {
  it('AdditionalInstructionsS390x properly taken', () => {
    render(instructionsMapping.baremetal.s390x.upi.rhcos.additionalInstructions);
    expect(screen.getByTestId('additional-instructions-mock')).toBeInTheDocument();
  });
});
