import links, { channels } from '../../../../common/installLinks';

const architectures = {
  x86: 'x86-64',
  ppc: 'ppc64le',
  s390x: 's390x',
};

/**
 * RHCOS Downloads structure
 * An array where each item corresponds to a row of buttons in the RHCOS section:
 * - An object download:={buttonText, name, url} corresponds to a
 *   single button in row
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
      channel: channels.STABLE,
    },
    upi: {
      title: 'Install OpenShift on AWS with user-provisioned infrastructure',
      docURL: links.INSTALL_AWSUPI_GETTING_STARTED,
      channel: channels.STABLE,
    },
    getStartedAdditional: 'The installer will ask you for the domain or subdomain you wish to use (this can be purchased through AWS but it will take some time for the DNS to propogate).',
  },
  gcp: {
    cloudProvider: 'GCP',
    customizations: links.INSTALL_GCP_CUSTOMIZATIONS,
    ipi: {
      title: 'Install OpenShift on GCP with installer-provisioned infrastructure',
      docURL: links.INSTALL_GCPIPI_GETTING_STARTED,
      channel: channels.STABLE,
    },
    upi: {
      title: 'Install OpenShift on GCP with user-provisioned infrastructure',
      docURL: links.INSTALL_GCPUPI_GETTING_STARTED,
      rhcosLearnMoreURL: links.INSTALL_GCPUPI_RHCOS_LEARN_MORE,
      rhcosDownloads: [
        {
          buttonText: 'Download RHCOS tar',
          name: 'OCP-Download-RHCOS-tar',
          url: links.RHCOS_GCPUPI_TAR_X86,
        },
      ],
      channel: channels.STABLE,
    },
    getStartedAdditional: 'The installer will ask you for the domain or subdomain you wish to use (this can be purchased through GCP but it will take some time for the DNS to propogate).',
  },
  azure: {
    cloudProvider: 'Azure',
    customizations: links.INSTALL_AZURE_CUSTOMIZATIONS,
    ipi: {
      title: 'Install OpenShift on Azure with installer-provisioned infrastructure',
      channel: channels.STABLE,
      docURL: links.INSTALL_AZUREIPI_GETTING_STARTED,
    },
    upi: {
      title: 'Install OpenShift on Azure with user-provisioned infrastructure',
      channel: channels.PRE_RELEASE,
      docURL: links.INSTALL_AZUREUPI_GETTING_STARTED,
    },
    getStartedAdditional: 'The installer will ask you for the domain or subdomain you wish to use (this can be purchased through Azure but it will take some time for the DNS to propogate).',
  },
  ibmz: {
    cloudProvider: 'IBM-Z',
    title: 'Install OpenShift on IBM Z with user-provisioned infrastructure',
    rhcosLearnMoreURL: links.INSTALL_IBMZ_RHCOS_LEARN_MORE,
    rhcosAdditionalInstructions: 'Download the initramfs, the kernel, and the OS image corresponding to your VM type.',
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
        alternatives: [
          {
            buttonText: 'Download RAW for DASD VM',
            name: 'OCP-Download-RHCOS-dasd',
            url: links.RHCOS_IBMZ_DASD,
          },
          {
            buttonText: 'Download RAW for FCP VM',
            name: 'OCP-Download-RHCOS-fcp',
            url: links.RHCOS_IBMZ_FCP,
          },
        ],
      },
    ],
    docURL: links.INSTALL_IBMZ_GETTING_STARTED,
    channel: channels.IBMZ,
  },
  bareMetal: {
    cloudProvider: 'Bare Metal',
    customizations: links.INSTALL_BAREMETAL_CUSTOMIZATIONS,
    title: 'Install OpenShift on Bare Metal with user-provisioned infrastructure',
    rhcosLearnMoreURL: links.INSTALL_BAREMETAL_RHCOS_LEARN_MORE,
    rhcosDownloads: [
      [
        {
          buttonText: 'Download RHCOS ISO',
          name: 'OCP-Download-RHCOS-ISO',
          archURL: {
            x86: links.RHCOS_BAREMETAL_ISO_X86,
            s390x: links.RHCOS_BAREMETAL_ISO_S390X,
            ppc: links.RHCOS_BAREMETAL_ISO_PPC,
          },
        },
        {
          buttonText: 'Download RHCOS RAW',
          name: 'OCP-Download-RHCOS-RAW',
          archURL: {
            x86: links.RHCOS_BAREMETAL_RAW_X86,
            s390x: links.RHCOS_BAREMETAL_RAW_S390X,
            ppc: links.RHCOS_BAREMETAL_RAW_PPC,
          },
        },
      ],
    ],
    rhcosAdditionalInstructions: 'Download the installer ISO image and the compressed metal RAW.',
    channel: channels.STABLE,
    docURL: links.INSTALL_BAREMETAL_GETTING_STARTED,
  },
  vmware: {
    cloudProvider: 'VMWare vSphere',
    customizations: links.INSTALL_VSPHERE_CUSTOMIZATIONS,
    title: 'Install OpenShift on vSphere with user-provisioned infrastructure',
    docURL: links.INSTALL_VSPHERE_GETTING_STARTED,
    rhcosLearnMoreURL: links.INSTALL_VSPHERE_RHCOS_LEARN_MORE,
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
  power: {
    cloudProvider: 'Power',
    title: 'Install OpenShift on Power with user-provisioned infrastructure',
    channel: channels.PPC,
    rhcosLearnMoreURL: links.INSTALL_POWER_RHCOS_LEARN_MORE,
    rhcosDownloads:
    [
      {
        buttonText: 'Download RHCOS ISO',
        name: 'OCP-Download-RHCOS-ISO',
        url: links.RHCOS_POWER_ISO_PPC,
      },
      {
        buttonText: 'Download RHCOS RAW',
        name: 'OCP-Download-RHCOS-RAW',
        url: links.RHCOS_POWER_RAW_PPC,
      },
    ],
    rhcosAdditionalInstructions: 'Download the installer ISO image and the compressed metal RAW.',
    showPreReleasePageLink: false,
    docURL: links.INSTALL_POWER_GETTING_STARTED,
  },
  openstack: {
    cloudProvider: 'Red Hat OpenStack Platform',
    customizations: links.INSTALL_OSP_CUSTOMIZATIONS,
    ipi: {
      title: 'Install OpenShift on Red Hat OpenStack Platform with installer-provisioned infrastructure',
      channel: channels.STABLE,
      docURL: links.INSTALL_OSPIPI_GETTING_STARTED,
    },
    upi: {
      title: 'Install OpenShift on Red Hat OpenStack Platform with user-provisioned infrastructure',
      docURL: links.INSTALL_OSPUPI_GETTING_STARTED,
      rhcosLearnMoreURL: links.INSTALL_OSPUPI_RHCOS_LEARN_MORE,
      rhcosDownloads: [
        {
          buttonText: 'Download RHCOS QCOW',
          name: 'OCP-Download-RHCOS-QCOW',
          archURL: {
            x86: links.RHCOS_OSPUPI_QCOW_X86,
            s390x: links.RHCOS_OSPUPI_QCOW_S390X,
            ppc: links.RHCOS_OSPUPI_QCOW_PPC,
          },
        },
      ],
      channel: channels.STABLE,
    },
  },
  rhv: {
    cloudProvider: 'Red Hat Virutalization',
    customizations: links.INSTALL_RHV_CUSTOMIZATIONS,
    title: 'Install OpenShift on Red Hat Virtualization with installer-provisioned infrastructure',
    docURL: links.INSTALL_RHV_GETTING_STARTED,
    showPreReleasePageLink: false,
    channel: channels.STABLE,
  },
};

export default instructionsMapping;
export { architectures };
