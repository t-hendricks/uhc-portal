import Overview from '../../pageobjects/Overview.page';
import currentOcVersion from '../../support/CurrentOcVersion';

describe('OCM Overview Page tests (OCP-65189)', { tags: ['smoke'] }, () => {
  before(() => {
    currentOcVersion.retrieveVersion();
    cy.visit('/overview');
    Overview.isOverviewPage();
  });

  it('OCM Overview Page - header and central section', () => {
    Overview.header()
      .checkTitle('Get started with OpenShift')
      .checkLink(
        'Learn more about OpenShift',
        'https://www.redhat.com/en/technologies/cloud-computing/openshift',
      )
      .opensInRightTab()
      .successfullyOpens();

    Overview.centralSectionCardsExpected(6);

    const runOn = 'Runs on',
      purchaseThrough = 'Purchase through',
      billingType = 'Billing type';
    var card = Overview.centralSectionCard('offering-card_RHOSD');
    card.cyObj.contains('Red Hat OpenShift Dedicated');
    card
      .btnShouldExist('Create cluster', '/openshift/create/osd')
      .opensExpectedPage('Create an OpenShift Dedicated Cluster');
    card.shouldHaveLabel('Managed service');
    card.cardDetails({
      [runOn]: 'AWS or Google Cloud',
      [purchaseThrough]: 'Red Hat',
      [billingType]: 'Flexible or fixed',
    });
    card
      .checkLink(
        'Learn more',
        'https://www.redhat.com/en/technologies/cloud-computing/openshift/dedicated',
      )
      .opensInRightTab()
      .successfullyOpens();

    card = Overview.centralSectionCard('offering-card_AWS');
    card.cyObj.contains('Red Hat OpenShift Service on AWS (ROSA)');
    card
      .btnShouldExist('Create cluster', '/openshift/create/rosa/getstarted')
      .opensExpectedPage('Set up Red Hat OpenShift Service on AWS (ROSA)');
    card.shouldHaveLabel('Managed service');
    card.cardDetails({
      [runOn]: 'Amazon Web Services',
      [purchaseThrough]: 'Amazon Web Services',
      [billingType]: 'Flexible hourly',
    });
    card.checkLink('View details', '/openshift/overview/rosa').opensInRightTab();

    card = Overview.centralSectionCard('offering-card_Azure');
    card.cyObj.contains('Azure Red Hat OpenShift (ARO)');
    card.shouldHaveLabel('Managed service');
    card.cardDetails({
      [runOn]: 'Microsoft Azure',
      [purchaseThrough]: 'Microsoft',
      [billingType]: 'Flexible hourly',
    });
    card
      .checkLink('Learn more on Azure', 'https://azure.microsoft.com/en-us/products/openshift/')
      .opensInRightTab()
      .successfullyOpens();

    card = Overview.centralSectionCard('offering-card_RHOCP');
    card.cyObj.contains('Red Hat OpenShift Container Platform');
    card
      .btnShouldExist('Create cluster', '/openshift/create')
      .opensExpectedPage('Select an OpenShift cluster type to create');
    card.shouldHaveLabel('Self-managed service');
    card.cardDetails({
      [runOn]: 'Supported infrastructures',
      [purchaseThrough]: 'Red Hat',
      [billingType]: 'Annual subscription',
    });
    card.checkLink('Register cluster', '/openshift/register').opensInRightTab();

    card = Overview.centralSectionCard('offering-card_RHOIBM');
    card.cyObj.contains('Red Hat OpenShift on IBM Cloud');
    card.shouldHaveLabel('Managed service');
    card.cardDetails({
      [runOn]: 'IBM Cloud',
      [purchaseThrough]: 'IBM',
      [billingType]: 'Flexible hourly',
    });
    card
      .checkLink(
        'Learn more on IBM',
        'https://cloud.ibm.com/kubernetes/catalog/create?platformType=openshift',
      )
      .opensInRightTab();

    card = Overview.centralSectionCard('offering-card_DEVSNBX');
    card.cyObj.contains('Developer Sandbox');
    card.shouldHaveLabel('Managed service');
    card.checkLink('View details', '/openshift/sandbox').opensInRightTab();

    Overview.centralSectionFooterLinkExists(
      'View all OpenShift cluster types',
      '/openshift/create',
    ).opensExpectedPage('Select an OpenShift cluster type to create');
  });

  it('OCM Overview Page - Recommended content section', () => {
    const openshiftVersion = currentOcVersion.getVersion();

    Overview.recommendedContentsExpected(4);

    var recommendedContent = Overview.recommendedContent('recommendedContent_OCM');
    recommendedContent.cyObj.contains(
      'Using Red Hat OpenShift Cluster Manager to work with your OpenShift clusters',
    );
    recommendedContent.shouldHaveLabel('Documentation');
    recommendedContent
      .checkLink(
        'Learn More',
        'https://access.redhat.com/documentation/en-us/openshift_cluster_manager/2023/html/managing_clusters/assembly-managing-clusters',
      )
      .opensInRightTab()
      .successfullyOpens();

    recommendedContent = Overview.recommendedContent('recommendedContent_ServerLess');
    recommendedContent.cyObj.contains('OpenShift Serverless overview');
    recommendedContent.shouldHaveLabel('Documentation');
    recommendedContent
      .checkLink(
        'Learn More',
        `https://docs.openshift.com/container-platform/${openshiftVersion}/serverless/about/about-serverless.html`,
      )
      .opensInRightTab()
      .successfullyOpens();

    recommendedContent = Overview.recommendedContent('recommendedContent_ServiceMesh');
    recommendedContent.cyObj.contains('Understanding Service Mesh');
    recommendedContent.shouldHaveLabel('Documentation');
    recommendedContent
      .checkLink(
        'Learn More',
        `https://docs.openshift.com/container-platform/${openshiftVersion}/service_mesh/v2x/ossm-architecture.html`,
      )
      .opensInRightTab()
      .successfullyOpens();

    recommendedContent = Overview.recommendedContent('recommendedContent_OVIRT');
    recommendedContent.cyObj.contains('About OpenShift Virtualization');
    recommendedContent.shouldHaveLabel('Documentation');
    recommendedContent
      .checkLink(
        'Learn More',
        `https://docs.openshift.com/container-platform/${openshiftVersion}/virt/about_virt/about-virt.html`,
      )
      .opensInRightTab()
      .successfullyOpens();

    Overview.recommendedContentFooterLinkExists(
      'Browse all OpenShift learning resources',
      '/openshift/learning-resources',
    ).opensInRightTab(false);
  });
});
