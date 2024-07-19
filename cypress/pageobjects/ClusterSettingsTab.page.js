import Page from './page';

class ClusterSettingsTab extends Page {
  enableUserWorkloadMonitoringCheckbox = () => cy.get('input#enable_user_workload_monitoring');

  individualUpdatesRadioButton = () => cy.getByTestId('upgrade_policy-manual');

  recurringUpdatesRadioButton = () => cy.getByTestId('upgrade_policy-automatic');
}
export default new ClusterSettingsTab();
