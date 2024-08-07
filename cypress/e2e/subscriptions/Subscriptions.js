import GlobalNav from '../../pageobjects/GlobalNav.page';
import Subscription from '../../pageobjects/Subscriptions.page';
import SubscriptionDedicatedAnnual from '../../fixtures/subscription/SubscriptionDedicated.json';
describe('Subscription page (OCP-25171)', { tags: ['smoke'] }, () => {
  before(() => {
    cy.visit('/quota');
  });

  it('Check the Subscription - Dedicated Annual page headers ', () => {
    // Setting the customized quota response from fixture definitions.
    cy.intercept('**/quota_cost*', (req) => {
      req.continue((res) => {
        res.body = SubscriptionDedicatedAnnual;
        res.send(res.body);
      });
    });
    Subscription.isDedicatedAnnualPage();
    Subscription.isDedicatedSectionHeader();
    Subscription.isSubscriptionTableHeader();
  });
  it('Check the Subscription - Dedicated Annual page details ', () => {
    Subscription.checkQuotaTableColumns('Resource type');
    Subscription.checkQuotaTableColumns('Resource name');
    Subscription.checkQuotaTableColumns('Availability');
    Subscription.checkQuotaTableColumns('Plan type');
    Subscription.checkQuotaTableColumns('Cluster type');
    Subscription.checkQuotaTableColumns('Used');
    Subscription.checkQuotaTableColumns('Capacity');
    Subscription.planTypeHelpButton().click();
    cy.contains('Standard: Cluster infrastructure costs paid by Red Hat').should('be.visible');
    cy.contains('CCS: Cluster infrastructure costs paid by the customer').should('be.visible');
    Subscription.planTypeHelpButton().click();

    let cells = Subscription.getQuotaTableRow(SubscriptionDedicatedAnnual.items[0]);
    cells.next().contains(SubscriptionDedicatedAnnual.items[0].related_resources[0].resource_name);
    cells.next().contains('N/A');
    cells.next().contains('Standard');
    cells.next().contains('OSD');
    cells.next().contains('10 of 10');

    cells = Subscription.getQuotaTableRow(SubscriptionDedicatedAnnual.items[1]);
    cells.next().contains(SubscriptionDedicatedAnnual.items[1].related_resources[0].resource_name);
    cells.next().contains('N/A');
    cells.next().contains('CCS');
    cells.next().contains('OSD');
    cells.next().contains('50 of 100');

    cells = Subscription.getQuotaTableRow(SubscriptionDedicatedAnnual.items[2]);
    cells.next().contains(SubscriptionDedicatedAnnual.items[2].related_resources[0].resource_name);
    cells.next().contains('N/A');
    cells.next().contains('Standard');
    cells.next().contains('OSD');
    cells.next().contains('0 of 280');
  });

  it('Check the Subscription - Dedicated Ondemand page headers ', () => {
    Subscription.dedicatedOnDemandLink().click();
    Subscription.isDedicatedOnDemandPage();
    Subscription.isDedicatedSectionHeader();
    Subscription.isSubscriptionTableHeader();
  });
  it('Check the Subscription - Dedicated Ondemand page details ', () => {
    Subscription.checkQuotaTableColumns('Resource type');
    Subscription.checkQuotaTableColumns('Resource name');
    Subscription.checkQuotaTableColumns('Availability');
    Subscription.checkQuotaTableColumns('Plan type');
    Subscription.checkQuotaTableColumns('Cluster type');
    Subscription.checkQuotaTableColumns('Used');
    Subscription.checkQuotaTableColumns('Capacity');
    Subscription.planTypeHelpButton().click();
    cy.contains('Standard: Cluster infrastructure costs paid by Red Hat').should('be.visible');
    cy.contains('CCS: Cluster infrastructure costs paid by the customer').should('be.visible');
    Subscription.planTypeHelpButton().click();

    let cells = Subscription.getQuotaTableRow(SubscriptionDedicatedAnnual.items[3]);
    cells.next().contains(SubscriptionDedicatedAnnual.items[3].related_resources[0].resource_name);
    cells.next().contains('N/A');
    cells.next().contains('CCS');
    cells.next().contains('ROSA');
    cells.next().contains('1 of 2020');

    cells = Subscription.getQuotaTableRow(SubscriptionDedicatedAnnual.items[4]);
    cells.next().contains('vCPU');
    cells.next().contains('N/A');
    cells.next().contains('CCS');
    cells.next().contains('ROSA');
    cells.next().contains('48 of 204000');
  });
  it('Check the Subscription - Dedicated Annual page when no quota available ', () => {
    cy.visit('/quota');
    // Setting the empty quota response to check the empty conditions
    cy.intercept('**/quota_cost*', (req) => {
      req.continue((res) => {
        res.body.items = [];
        res.send(res.body);
      });
    });
    Subscription.isDedicatedAnnualPage();
    cy.contains('You do not have any quota').should('be.visible');
  });
  it('Check the Subscription - Dedicated Ondemand page when no quota available ', () => {
    Subscription.dedicatedOnDemandLink().click();
    Subscription.isDedicatedOnDemandPage();
    cy.contains('Marketplace On-Demand subscriptions not detected').should('be.visible');
    Subscription.enableMarketplaceLink()
      .should('have.attr', 'href')
      .and('include', 'https://marketplace.redhat.com/en-us/products/red-hat-openshift-dedicated');
    Subscription.learnMoreLink()
      .should('have.attr', 'href')
      .and(
        'include',
        'https://access.redhat.com/documentation/en-us/openshift_cluster_manager/2023/html/managing_clusters/assembly-cluster-subscriptions',
      );
  });
});
