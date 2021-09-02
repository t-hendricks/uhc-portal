import LoginPage from '../pageobjects/login.page';
import GlobalNav from '../pageobjects/GlobalNav.page';
import Downloads from '../pageobjects/Downloads.page';

describe('Downloads page', async () => {
  it('login and navigate to downloads', async () => {
    await LoginPage.open();
    await LoginPage.login();
    await GlobalNav.navigateTo('Downloads');
  });

  it('can expand and collapse rows', async () => {
    expect(await Downloads.hiddenRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();

    await (await Downloads.expandToggle('(rosa)')).click();
    expect(await Downloads.visibleRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();

    await (await Downloads.expandToggle('(rosa)')).click();
    expect(await Downloads.hiddenRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
  });

  it('expand/collapse affects only selected category', async () => {
    expect(await Downloads.hiddenRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    expect(await Downloads.hiddenRowContaining('Get started with the OpenShift CLI')).toExist();
    expect(await Downloads.hiddenRowContaining('Helm charts')).toExist();

    await (await Downloads.categoryDropdown())
      .selectByVisibleText('Command-line interface (CLI) tools');
    await (await Downloads.expandAll()).click();
    expect(await Downloads.visibleRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    expect(await Downloads.visibleRowContaining('Get started with the OpenShift CLI')).toExist();
    expect(await Downloads.hiddenRowContaining('Helm charts')).not.toExist();

    await (await Downloads.categoryDropdown()).selectByVisibleText('All categories');
    expect(await Downloads.visibleRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    expect(await Downloads.visibleRowContaining('Get started with the OpenShift CLI')).toExist();
    expect(await Downloads.hiddenRowContaining('Helm charts')).toExist();

    // Given mixed state, first click expands all.
    await (await Downloads.expandAll()).click();
    expect(await Downloads.visibleRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    expect(await Downloads.visibleRowContaining('Get started with the OpenShift CLI')).toExist();
    expect(await Downloads.visibleRowContaining('Helm charts')).toExist();

    // Once all expanded, second click collapses all.
    await (await Downloads.collapseAll()).click();
    expect(await Downloads.hiddenRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    expect(await Downloads.hiddenRowContaining('Get started with the OpenShift CLI')).toExist();
    expect(await Downloads.hiddenRowContaining('Helm charts')).toExist();
  });

  it('selecting OS affects architecture options & href', async () => {
    const OSes = await Downloads.OSDropdown('(odo)');
    await OSes.scrollIntoView();
    await OSes.selectByVisibleText('Linux');
    expect(await Downloads.enabledArchitectureOptions('(odo)')).toEqual([
      'x86_64', 'aarch64', 'ppc64le', 's390x',
    ]);
    const href = await Downloads.downloadHref('(odo)');
    expect(href).toEqual('https://mirror.openshift.com/pub/openshift-v4/clients/odo/latest/odo-linux-amd64');

    const architectures = await Downloads.architectureDropdown('(odo)');
    architectures.selectByVisibleText('ppc64le');
    await browser.waitUntil(async () => (
      (await Downloads.downloadHref('(odo)'))
      === 'https://mirror.openshift.com/pub/openshift-v4/clients/odo/latest/odo-linux-ppc64le'
    ));

    // Only x86 available for Mac.
    await OSes.selectByVisibleText('MacOS');
    await browser.waitUntil(async () => (
      (await Downloads.downloadHref('(odo)'))
      === 'https://mirror.openshift.com/pub/openshift-v4/clients/odo/latest/odo-darwin-amd64'
    ));
    expect(await Downloads.architectureDropdown('(odo)')).toHaveAttr('disabled', true);
    expect(await Downloads.allArchitectureOptions('(odo)')).toEqual([
      'Select architecture', 'x86_64', 'aarch64', 'ppc64le', 's390x',
    ]);
    expect(await Downloads.enabledArchitectureOptions('(odo)')).toEqual([
      'x86_64',
    ]);

    await OSes.selectByVisibleText('Linux');
  });

  it('selecting a category preserves OS & architecture of invisible sections', async () => {
    await (await Downloads.OSDropdown('Helm')).selectByVisibleText('Linux');
    await (await Downloads.architectureDropdown('Helm')).selectByVisibleText('s390x');
    await (await Downloads.OSDropdown('CodeReady')).selectByVisibleText('Windows');

    await (await Downloads.categoryDropdown()).selectByVisibleText('Tokens');
    expect(await Downloads.visibleRowContaining('Manage your Red Hat OpenShift Service on AWS')).not.toExist();
    expect(await Downloads.visibleRowContaining('Helm')).not.toExist();
    expect(await Downloads.visibleRowContaining('CodeReady')).not.toExist();

    await (await Downloads.categoryDropdown()).selectByVisibleText('All categories');
    expect(await Downloads.visibleRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    expect(await Downloads.visibleRowContaining('Helm')).toExist();
    expect(await Downloads.visibleRowContaining('CodeReady')).toExist();

    expect(await Downloads.OSDropdown('Helm')).toHaveValue('linux');
    expect(await Downloads.architectureDropdown('Helm')).toHaveValue('s390x');
    expect(await Downloads.OSDropdown('CodeReady')).toHaveValue('windows');
  });
});
