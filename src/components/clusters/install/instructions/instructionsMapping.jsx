import React from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import {
  List, ListItem, Text,
} from '@patternfly/react-core';
import links, { tools, channels } from '../../../../common/installLinks';

/**
 * RHCOS Downloads structure
 * An array where each item corresponds to a row of buttons in the RHCOS section:
 * - An object download:={buttonText, name, url} corresponds to a
 *   single button in row
 *   - Instead of url, can have archURL: {x86: url, ...},`
 *     where keys match `installLinks.architectures` keys.
 * - An object {alternatives: [downloads]} corrsponds to a row of buttons where the user needs
 *   to select one of the options
 * - An array [downloads] corresponds to a row of buttons controlled by the same architecture
 *   selector.
 */
const instructionsMapping = {
  aws: {
    cloudProvider: 'AWS',
    customizations: links.INSTALL_AWS_CUSTOMIZATIONS,
    ipi: {
      title: 'Install OpenShift on AWS with installer-provisioned infrastructure',
      docURL: links.INSTALL_AWSIPI_DOCS_LANDING,
      installer: tools.X86INSTALLER,
      channel: channels.STABLE,
    },
    upi: {
      title: 'Install OpenShift on AWS with user-provisioned infrastructure',
      docURL: links.INSTALL_AWSUPI_GETTING_STARTED,
      installer: tools.X86INSTALLER,
      channel: channels.STABLE,
    },
    getStartedAdditional: 'The installer will ask you for the domain or subdomain you wish to use (this can be purchased through AWS but it will take some time for the DNS to propagate).',
  },
  gcp: {
    cloudProvider: 'GCP',
    customizations: links.INSTALL_GCP_CUSTOMIZATIONS,
    ipi: {
      title: 'Install OpenShift on GCP with installer-provisioned infrastructure',
      docURL: links.INSTALL_GCPIPI_GETTING_STARTED,
      installer: tools.X86INSTALLER,
      channel: channels.STABLE,
    },
    upi: {
      title: 'Install OpenShift on GCP with user-provisioned infrastructure',
      docURL: links.INSTALL_GCPUPI_GETTING_STARTED,
      displayRHCOSSection: true,
      rhcosLearnMoreURL: links.INSTALL_GCPUPI_RHCOS_LEARN_MORE,
      rhcosDownloads: [
        {
          buttonText: 'Download RHCOS tar',
          name: 'OCP-Download-RHCOS-tar',
          url: links.RHCOS_GCPUPI_TAR_X86,
        },
      ],
      installer: tools.X86INSTALLER,
      channel: channels.STABLE,
    },
    getStartedAdditional: 'The installer will ask you for the domain or subdomain you wish to use (this can be purchased through GCP but it will take some time for the DNS to propagate).',
  },
  azure: {
    cloudProvider: 'Azure',
    customizations: links.INSTALL_AZURE_CUSTOMIZATIONS,
    ipi: {
      title: 'Install OpenShift on Azure with installer-provisioned infrastructure',
      installer: tools.X86INSTALLER,
      channel: channels.STABLE,
      docURL: links.INSTALL_AZUREIPI_GETTING_STARTED,
    },
    upi: {
      title: 'Install OpenShift on Azure with user-provisioned infrastructure',
      installer: tools.X86INSTALLER,
      channel: channels.PRE_RELEASE,
      docURL: links.INSTALL_AZUREUPI_GETTING_STARTED,
    },
    getStartedAdditional: 'The installer will ask you for the domain or subdomain you wish to use (this can be purchased through Azure but it will take some time for the DNS to propagate).',
  },
  ibmz: {
    cloudProvider: 'IBM-Z',
    title: 'Install OpenShift on IBM Z with user-provisioned infrastructure',
    displayRHCOSSection: true,
    rhcosAdditionalInstructions: (
      <Text component="div">
        <List>
          <ListItem>
            If you plan your installation with z/VM, download the initramfs,
            the kernel, and the rootfs files.
            {' '}
            <Text component="a" href={links.INSTALL_IBMZ_LEARN_MORE_ZVM} target="_blank" rel="noreferrer noopener">
              Learn more
              {' '}
              <ExternalLinkAltIcon size="sm" />
              .
            </Text>
          </ListItem>
          <ListItem>
            If you plan your installation with RHEL KVM, depending on the installation
            type you plan to perform, download the QCOW2 file or the initramfs,
            the kernel, and the rootfs files.
            {' '}
            <Text component="a" href={links.INSTALL_IBMZ_RHCOS_LEARN_MORE_RHEL_KVM} target="_blank" rel="noreferrer noopener">
              Learn more
              {' '}
              <ExternalLinkAltIcon size="sm" />
              .
              {' '}
            </Text>
          </ListItem>
        </List>
      </Text>
    ),
    rhcosDownloads: [
      {
        buttonText: 'Download RHCOS initramfs',
        name: 'OCP-Download-RHCOS-initramfs',
        url: links.RHCOS_IBMZ_INITRAMFS,
      },
      {
        buttonText: 'Download RHCOS kernel',
        name: 'OCP-Download-RHCOS-kernel',
        url: links.RHCOS_IBMZ_KERNEL,
      },
      {
        buttonText: 'Download RHCOS rootfs',
        name: 'OCP-Download-RHCOS-rootfs',
        url: links.RHCOS_IBMZ_ROOTFS,
      },
      {
        buttonText: 'Download QCOW2 image',
        name: 'OCP-Download-RHCOS-qcow2',
        url: links.RHCOS_IBMZ_QCOW,
      },
    ],
    docURL: links.INSTALL_IBMZ_GETTING_STARTED,
    preReleasePageLink: '/install/ibmz/pre-release',
    installer: tools.IBMZINSTALLER,
    channel: channels.STABLE,
  },
  bareMetal: {
    cloudProvider: 'Bare Metal',
    customizations: links.INSTALL_BAREMETAL_CUSTOMIZATIONS,
    ipi: {
      title: 'Install OpenShift on Bare Metal with installer-provisioned infrastructure',
      installer: tools.X86INSTALLER,
      channel: channels.STABLE,
      docURL: links.INSTALL_BAREMETAL_IPI_GETTING_STARTED,
    },
    upi: {
      title: 'Install OpenShift on Bare Metal with user-provisioned infrastructure',
      displayRHCOSSection: true,
      rhcosLearnMoreURL: links.INSTALL_BAREMETAL_RHCOS_LEARN_MORE,
      rhcosDownloads:
        [
          {
            buttonText: 'Download RHCOS ISO',
            name: 'OCP-Download-RHCOS-ISO',
            url: links.RHCOS_BAREMETAL_ISO_X86,
          },
          {
            buttonText: 'Download RHCOS RAW',
            name: 'OCP-Download-RHCOS-RAW',
            url: links.RHCOS_BAREMETAL_RAW_X86,
          },
        ],
      rhcosAdditionalInstructions: 'Download the installer ISO image and the compressed metal RAW.',
      installer: tools.X86INSTALLER,
      channel: channels.STABLE,
      docURL: links.INSTALL_BAREMETAL_UPI_GETTING_STARTED,
    },
  },
  generic: {
    cloudProvider: 'Platform Agnostic',
    title: 'Install OpenShift on any x86_64 platform with user-provisioned infrastructure',
    displayRHCOSSection: true,
    rhcosLearnMoreURL: links.INSTALL_GENERIC_RHCOS_LEARN_MORE,
    rhcosDownloads:
      [
        {
          buttonText: 'Download RHCOS ISO',
          name: 'OCP-Download-RHCOS-ISO',
          url: links.RHCOS_GENERIC_ISO_X86,
        },
        {
          buttonText: 'Download RHCOS kernel',
          name: 'OCP-Download-RHCOS-kernel',
          url: links.RHCOS_GENERIC_KERNEL_X86,
        },
        {
          buttonText: 'Download RHCOS initramfs',
          name: 'OCP-Download-RHCOS-initramfs',
          url: links.RHCOS_GENERIC_INITRAMFS_X86,
        },
        {
          buttonText: 'Download RHCOS rootfs',
          name: 'OCP-Download-RHCOS-rootfs',
          url: links.RHCOS_GENERIC_ROOTFS_X86,
        },
      ],
    rhcosAdditionalInstructions: 'Download the installer ISO image, or the kernel, initramfs, and rootfs.',
    installer: tools.X86INSTALLER,
    channel: channels.STABLE,
    docURL: links.INSTALL_GENERIC_GETTING_STARTED,
  },
  vmware: {
    cloudProvider: 'VMware vSphere',
    customizations: links.INSTALL_VSPHERE_CUSTOMIZATIONS,
    upi: {
      title: 'Install OpenShift on vSphere with user-provisioned infrastructure',
      docURL: links.INSTALL_VSPHEREUPI_GETTING_STARTED,
      displayRHCOSSection: true,
      rhcosLearnMoreURL: links.INSTALL_VSPHERE_RHCOS_LEARN_MORE,
      installer: tools.X86INSTALLER,
      channel: channels.STABLE,
      rhcosDownloads:
        [
          {
            buttonText: 'Download RHCOS OVA',
            name: 'OCP-Download-RHCOS-OVA',
            url: links.RHCOS_VSPHERE_OVA_X86,
          },
        ],
    },
    ipi: {
      title: 'Install OpenShift on vSphere with installer-provisioned infrastructure',
      docURL: links.INSTALL_VSPHEREIPI_GETTING_STARTED,
      installer: tools.X86INSTALLER,
      channel: channels.STABLE,
    },
  },
  power: {
    cloudProvider: 'Power',
    title: 'Install OpenShift on Power with user-provisioned infrastructure',
    installer: tools.PPCINSTALLER,
    channel: channels.STABLE,
    displayRHCOSSection: true,
    rhcosLearnMoreURL: links.INSTALL_POWER_RHCOS_LEARN_MORE,
    rhcosDownloads:
      [
        {
          buttonText: 'Download RHCOS ISO',
          name: 'OCP-Download-RHCOS-ISO',
          url: links.RHCOS_POWER_ISO,
        },
        {
          buttonText: 'Download RHCOS initramfs',
          name: 'OCP-Download-RHCOS-initramfs',
          url: links.RHCOS_POWER_INITRAMFS,
        },
        {
          buttonText: 'Download RHCOS kernel',
          name: 'OCP-Download-RHCOS-kernel',
          url: links.RHCOS_POWER_KERNEL,
        },
        {
          buttonText: 'Download RHCOS rootfs',
          name: 'OCP-Download-RHCOS-rootfs',
          url: links.RHCOS_POWER_ROOTFS,
        },
      ],
    rhcosAdditionalInstructions: 'Download either the installer ISO image or for PXE booting the initramfs, the kernel, and the rootfs files.',
    preReleasePageLink: '/install/power/pre-release',
    docURL: links.INSTALL_POWER_GETTING_STARTED,
  },
  openstack: {
    cloudProvider: 'Red Hat OpenStack Platform',
    customizations: links.INSTALL_OSP_CUSTOMIZATIONS,
    ipi: {
      title: 'Install OpenShift on Red Hat OpenStack Platform with installer-provisioned infrastructure',
      installer: tools.X86INSTALLER,
      channel: channels.STABLE,
      docURL: links.INSTALL_OSPIPI_GETTING_STARTED,
    },
    upi: {
      title: 'Install OpenShift on Red Hat OpenStack Platform with user-provisioned infrastructure',
      docURL: links.INSTALL_OSPUPI_GETTING_STARTED,
      displayRHCOSSection: true,
      rhcosLearnMoreURL: links.INSTALL_OSPUPI_RHCOS_LEARN_MORE,
      rhcosDownloads: [
        {
          buttonText: 'Download RHCOS QCOW',
          name: 'OCP-Download-RHCOS-QCOW',
          url: links.RHCOS_OSPUPI_QCOW_X86,
        },
      ],
      installer: tools.X86INSTALLER,
      channel: channels.STABLE,
    },
  },
  rhv: {
    cloudProvider: 'Red Hat Virutalization',
    customizations: links.INSTALL_RHV_CUSTOMIZATIONS,
    ipi: {
      docURL: links.INSTALL_RHVIPI_GETTING_STARTED,
      title: 'Install OpenShift on Red Hat Virtualization with installer-provisioned infrastructure',
      installer: tools.X86INSTALLER,
      channel: channels.STABLE,
    },
    upi: {
      docURL: links.INSTALL_RHVUPI_GETTING_STARTED,
      title: 'Install OpenShift on Red Hat Virtualization with user-provisioned infrastructure',
      installer: tools.X86INSTALLER,
      channel: channels.STABLE,
    },
  },
};

export default instructionsMapping;
