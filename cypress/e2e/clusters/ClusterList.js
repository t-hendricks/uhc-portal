import Login from '../../pageobjects/login.page';
import ClusterListPage from '../../pageobjects/ClusterList.page';

describe('OCM Mainpage - cluster list page', () => {
    before(() => {
        cy.visit('/');
        Login.isLoginPageUrl();
        Login.login();

        ClusterListPage.isClusterListUrl();
        ClusterListPage.waitForDataReady();
        cy.getByTestId('create_cluster_btn').should('be.visible');
    });
    describe('Check all cluster lists page items presence and its actions (OCP-21339)', { tags: ['smoke'] }, () => {

        it('Cluster list page : filters & its actions', () => {
            ClusterListPage.isClusterListScreen();
            ClusterListPage.filterTxtField().should('be.visible').click();
            ClusterListPage.filterTxtField().clear().type("smoke cluster");
            ClusterListPage.filterTxtField().clear();
            ClusterListPage.waitForDataReady();
            ClusterListPage.clickClusterTypeFilters();
            ClusterListPage.clickClusterTypes("OCP");
            ClusterListPage.clickClusterTypes("OSD");
            ClusterListPage.clickClusterTypes("ROSA");
            ClusterListPage.clickClusterTypes("ROSA - Hosted");
            ClusterListPage.clickClusterTypes("ARO");
            ClusterListPage.clickClusterTypes("OCP");
            ClusterListPage.clickClusterTypes("OSD");
            ClusterListPage.clickClusterTypes("ROSA");
            ClusterListPage.clickClusterTypes("ROSA - Hosted");
            ClusterListPage.clickClusterTypes("ARO");
        });
        it('Cluster list page : extra options & its actions', () => {
            ClusterListPage.viewClusterArchives().click();
            ClusterListPage.isClusterArchivesUrl();
            ClusterListPage.isClusterArchivesScreen();
            cy.go('back')
        });
        it('Cluster list page : view only cluster options & its actions', () => {
            ClusterListPage.viewOnlyMyCluster().click({ force: true });
            ClusterListPage.viewOnlyMyClusterHelp().click();
            ClusterListPage.tooltipviewOnlyMyCluster().contains("Show only the clusters you previously created, or all clusters in your organization.")
            ClusterListPage.clusterListRefresh();
        });
        it('Cluster list page : Register cluster & its actons', () => {
            ClusterListPage.registerCluster().should('be.visible').click();
            ClusterListPage.isRegisterClusterUrl();
            ClusterListPage.isRegisterClusterScreen();
            cy.go('back')
        });
    });
});
