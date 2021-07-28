import LoginPage from '../pageobjects/login.page';
import GlobalNav from '../pageobjects/GlobalNav.page';
import Downloads from '../pageobjects/Downloads.page';

describe('Downloads page', async () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await LoginPage.open();
    await LoginPage.login();
    await GlobalNav.navigateTo('Downloads');
  });

  it('can expand and collapse rows', async () => {
    await expect(await Downloads.hiddenRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();

    await (await Downloads.expandToggle('(rosa)')).click();
    await expect(await Downloads.visibleRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();

    await (await Downloads.expandToggle('(rosa)')).click();
    await expect(await Downloads.hiddenRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
  });

  it('expand/collapse affects only selected category', async () => {
    await expect(await Downloads.hiddenRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    await expect(await Downloads.hiddenRowContaining('Get started with the OpenShift CLI')).toExist();
    await expect(await Downloads.hiddenRowContaining('Helm charts')).toExist();

    await (await Downloads.categoryDropdown())
      .selectByVisibleText('Command-line interface (CLI) tools');
    await (await Downloads.expandAll()).click();
    await expect(await Downloads.visibleRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    await expect(await Downloads.visibleRowContaining('Get started with the OpenShift CLI')).toExist();
    await expect(await Downloads.hiddenRowContaining('Helm charts')).not.toExist();

    await (await Downloads.categoryDropdown()).selectByVisibleText('All categories');
    await expect(await Downloads.visibleRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    await expect(await Downloads.visibleRowContaining('Get started with the OpenShift CLI')).toExist();
    await expect(await Downloads.hiddenRowContaining('Helm charts')).toExist();

    // Given mixed state, first click expands all.
    await (await Downloads.expandAll()).click();
    await expect(await Downloads.visibleRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    await expect(await Downloads.visibleRowContaining('Get started with the OpenShift CLI')).toExist();
    await expect(await Downloads.visibleRowContaining('Helm charts')).toExist();

    // Once all expanded, second click collapses all.
    await (await Downloads.collapseAll()).click();
    await expect(await Downloads.hiddenRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    await expect(await Downloads.hiddenRowContaining('Get started with the OpenShift CLI')).toExist();
    await expect(await Downloads.hiddenRowContaining('Helm charts')).toExist();
  });

  it('selecting OS affects architecture options & href', async () => {
    const OSes = await Downloads.OSDropdown('(odo)');
    await OSes.scrollIntoView();
    await OSes.selectByVisibleText('Linux');
    await expect(await Downloads.enabledArchitectureOptions('(odo)')).toEqual([
      'x86_64', 'aarch64', 'ppc64le', 's390x',
    ]);
    const href = await Downloads.downloadHref('(odo)');
    await expect(href).toEqual('https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/clients/odo/latest/odo-linux-amd64.tar.gz');

    const architectures = await Downloads.architectureDropdown('(odo)');
    architectures.selectByVisibleText('ppc64le');
    await browser.waitUntil(async () => (
      (await Downloads.downloadHref('(odo)'))
      === 'https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/clients/odo/latest/odo-linux-ppc64le.tar.gz'
    ));

    // Only x86 available for Windows.
    await OSes.selectByVisibleText('Windows');
    await browser.waitUntil(async () => (
      (await Downloads.downloadHref('(odo)'))
      === 'https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/clients/odo/latest/odo-windows-amd64.exe.zip'
    ));
    await expect(await Downloads.architectureDropdown('(odo)')).toHaveAttr('disabled', true);
    await expect(await Downloads.allArchitectureOptions('(odo)')).toEqual([
      'Select architecture', 'x86_64', 'aarch64', 'ppc64le', 's390x',
    ]);
    await expect(await Downloads.enabledArchitectureOptions('(odo)')).toEqual([
      'x86_64',
    ]);

    await OSes.selectByVisibleText('Linux');
  });

  it('selecting a category preserves OS & architecture of invisible sections', async () => {
    await (await Downloads.OSDropdown('Helm')).selectByVisibleText('Linux');
    await (await Downloads.architectureDropdown('Helm')).selectByVisibleText('s390x');
    await (await Downloads.OSDropdown('OpenShift Local')).selectByVisibleText('Windows');

    await (await Downloads.categoryDropdown()).selectByVisibleText('Tokens');
    await expect(await Downloads.visibleRowContaining('Manage your Red Hat OpenShift Service on AWS')).not.toExist();
    await expect(await Downloads.visibleRowContaining('Helm')).not.toExist();
    await expect(await Downloads.visibleRowContaining('OpenShift Local')).not.toExist();

    await (await Downloads.categoryDropdown()).selectByVisibleText('All categories');
    await expect(await Downloads.visibleRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    await expect(await Downloads.visibleRowContaining('Helm')).toExist();
    await expect(await Downloads.visibleRowContaining('OpenShift Local')).toExist();

    await expect(await Downloads.OSDropdown('Helm')).toHaveValue('linux');
    await expect(await Downloads.architectureDropdown('Helm')).toHaveValue('s390x');
    await expect(await Downloads.OSDropdown('OpenShift Local')).toHaveValue('windows');
  });
});
