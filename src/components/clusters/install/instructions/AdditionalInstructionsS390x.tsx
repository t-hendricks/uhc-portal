import { List, ListItem, Text } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import React from 'react';
import links from '../../../../common/installLinks.mjs';

const AdditionalInstructionsS390x = () => (
  <List>
    <ListItem>
      If you plan your installation with z/VM, download the initramfs, the kernel, and the rootfs
      files.{' '}
      <Text
        component="a"
        href={links.INSTALL_IBMZ_LEARN_MORE_ZVM}
        target="_blank"
        rel="noreferrer noopener"
        data-testid="install-ibmz-zvm-link"
      >
        Learn more <ExternalLinkAltIcon size="sm" />.
      </Text>
    </ListItem>
    <ListItem>
      If you plan your installation with RHEL KVM, depending on the installation type you plan to
      perform, download the QCOW2 file or the initramfs, the kernel, and the rootfs files.{' '}
      <Text
        component="a"
        href={links.INSTALL_IBMZ_RHCOS_LEARN_MORE_RHEL_KVM}
        target="_blank"
        rel="noreferrer noopener"
        data-testid="install-ibmz-rhcos-link"
      >
        Learn more <ExternalLinkAltIcon size="sm" />.{' '}
      </Text>
    </ListItem>
  </List>
);

export default AdditionalInstructionsS390x;
