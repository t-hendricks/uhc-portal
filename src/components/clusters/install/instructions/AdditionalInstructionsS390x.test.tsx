import * as React from 'react';
import { render, screen } from '~/testUtils';
import AdditionalInstructionsS390x from './AdditionalInstructionsS390x';

describe('<AdditionalInstructionsS390x />', () => {
  it('displays two links to baremetal installation docs', () => {
    render(<AdditionalInstructionsS390x />);
    const list = screen.queryAllByRole('listitem');
    expect(list.length).toBe(2);

    expect(
      screen.getByText(
        'If you plan your installation with z/VM, download the initramfs, the kernel, and the rootfs files.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'If you plan your installation with RHEL KVM, depending on the installation type you plan to perform, download the QCOW2 file or the initramfs, the kernel, and the rootfs files.',
      ),
    ).toBeInTheDocument();

    expect(screen.getByTestId('install-ibmz-zvm-link')).toBeInTheDocument();
    expect(screen.getByTestId('install-ibmz-rhcos-link')).toBeInTheDocument();
  });
});
