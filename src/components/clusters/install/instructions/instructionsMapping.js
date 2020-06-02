import links, { channels } from '../../../../common/installLinks';

const instructionsMapping = {
  aws: {
    cloudProvider: 'AWS',
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
  },
  gcp: {
    cloudProvider: 'GCP',
    ipi: {
      title: 'Install OpenShift on GCP with installer-provisioned infrastructure',
      docURL: links.INSTALL_GCPIPI_GETTING_STARTED,
      channel: channels.STABLE,
    },
    upi: {
      title: 'Install OpenShift on GCP with user-provisioned infrastructure',
      docURL: links.INSTALL_GCPUPI_GETTING_STARTED,
      rhcosLearnMoreURL: links.INSTALL_GCPUPI_RHCOS_LEARN_MORE,
      channel: channels.STABLE,
    },
  },
  azure: {
    cloudProvider: 'Azure',
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
  },
  ibmz: {
    cloudProvider: 'IBM-Z',
    title: 'Install OpenShift on IBM Z with user-provisioned infrastructure',
    rhcosDownloadURL: links.DOWNLOAD_RHCOS_LATEST_IBMZ,
    rhcosLearnMoreURL: links.INSTALL_IBMZ_RHCOS_LEARN_MORE,
    docURL: links.INSTALL_IBMZ_GETTING_STARTED,
    channel: channels.IBMZ,
  },
  bareMetal: {
    cloudProvider: 'Bare Metal',
    title: 'Install OpenShift on Bare Metal with user-provisioned infrastructure',
    rhcosLearnMoreURL: links.INSTALL_BAREMETAL_RHCOS_LEARN_MORE,
    channel: channels.STABLE,
    docURL: links.INSTALL_BAREMETAL_GETTING_STARTED,
  },
  vmware: {
    cloudProvider: 'VMWare vSphere',
    title: 'Install OpenShift on vSphere with user-provisioned infrastructure',
    docURL: links.INSTALL_VSPHERE_GETTING_STARTED,
    rhcosLearnMoreURL: links.INSTALL_VSPHERE_RHCOS_LEARN_MORE,
    channel: channels.STABLE,
  },
  power: {
    cloudProvider: 'Power',
    title: 'Install OpenShift on Power with user-provisioned infrastructure',
    channel: channels.PPC,
    rhcosDownloadURL: links.DOWNLOAD_RHCOS_LATEST_PPC,
    showPreReleasePageLink: false,
    docURL: links.INSTALL_POWER_GETTING_STARTED,
  },
  openstack: {
    cloudProvider: 'Red Hat OpenStack Platform',
    ipi: {
      title: 'Install OpenShift on Red Hat OpenStack Platform with installer-provisioned infrastructure',
      channel: channels.STABLE,
      docURL: links.INSTALL_OSPIPI_GETTING_STARTED,
    },
    upi: {
      title: 'Install OpenShift on Red Hat OpenStack Platform with user-provisioned infrastructure',
      docURL: links.INSTALL_OSPUPI_GETTING_STARTED,
      rhcosLearnMoreURL: links.INSTALL_OSPUPI_RHCOS_LEARN_MORE,
      rhcosDownloadURL: links.DOWNLOAD_RHCOS_LATEST,
      channel: channels.STABLE,
    },
  },
  rhv: {
    cloudProvider: 'Red Hat Virutalization',
    title: 'Install OpenShift on Red Hat Virtualization with installer-provisioned infrastructure',
    docURL: links.INSTALL_RHV_GETTING_STARTED,
    showPreReleasePageLink: false,
    channel: channels.STABLE,
  },
};

export default instructionsMapping;
