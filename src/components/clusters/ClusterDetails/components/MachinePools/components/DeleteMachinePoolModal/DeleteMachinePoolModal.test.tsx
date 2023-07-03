import React from 'react';
import { render, axe, screen, fireEvent } from '@testUtils';
import DeleteMachinePoolModal from './DeleteMachinePoolModal';

describe('<DeleteMachinePoolModal />', () => {
  const props = {
    closeModal: jest.fn(),
    performDeleteAction: jest.fn(),
    machinePoolId: 'machinePool1',
  };

  it('should be accessible', async () => {
    const { container } = render(<DeleteMachinePoolModal {...props} />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should show machine pool to be deleted', async () => {
    render(<DeleteMachinePoolModal {...props} />);
    screen.debug();
    expect(screen.queryByText(/machinePool1/)).toBeInTheDocument();
  });

  it('closes modal on cancel', () => {
    render(<DeleteMachinePoolModal {...props} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(props.closeModal).toBeCalled();
  });

  it('calls delete function on confirm', () => {
    render(<DeleteMachinePoolModal {...props} />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(props.performDeleteAction).toBeCalled();
    expect(props.closeModal).toBeCalled();
  });
});
