import LoginPage from '../pageobjects/login.page';
import Downloads from '../pageobjects/Downloads.page';

describe('Downloads page', async () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await Downloads.open();
    await LoginPage.login();
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
    await expect(await Downloads.hiddenRowContaining('the OpenShift client oc')).toExist();
    await expect(await Downloads.hiddenRowContaining('Helm charts')).toExist();

    await (await Downloads.categoryDropdown())
      .selectByVisibleText('Command-line interface (CLI) tools');
    await (await Downloads.expandAll()).click();
    await expect(await Downloads.visibleRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    await expect(await Downloads.visibleRowContaining('the OpenShift client oc')).toExist();
    await expect(await Downloads.hiddenRowContaining('Helm charts')).not.toExist();

    await (await Downloads.categoryDropdown()).selectByVisibleText('All categories');
    await expect(await Downloads.visibleRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    await expect(await Downloads.visibleRowContaining('the OpenShift client oc')).toExist();
    await expect(await Downloads.hiddenRowContaining('Helm charts')).toExist();

    // Given mixed state, first click expands all.
    await (await Downloads.expandAll()).click();
    await expect(await Downloads.visibleRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    await expect(await Downloads.visibleRowContaining('the OpenShift client oc')).toExist();
    await expect(await Downloads.visibleRowContaining('Helm charts')).toExist();

    // Once all expanded, second click collapses all.
    await (await Downloads.collapseAll()).click();
    await expect(await Downloads.hiddenRowContaining('Manage your Red Hat OpenShift Service on AWS')).toExist();
    await expect(await Downloads.hiddenRowContaining('the OpenShift client oc')).toExist();
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

    // Only x86/arm available for MacOS.
    await OSes.selectByVisibleText('MacOS');
    await expect(await Downloads.allArchitectureOptions('(odo)')).toEqual([
      'Select architecture', 'x86_64', 'aarch64',
    ]);
    await expect(await Downloads.enabledArchitectureOptions('(odo)')).toEqual([
      'x86_64', 'aarch64',
    ]);

    // Only x86 available for Windows.
    await OSes.selectByVisibleText('Windows');
    await browser.waitUntil(async () => (
      (await Downloads.downloadHref('(odo)'))
      === 'https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/clients/odo/latest/odo-windows-amd64.exe.zip'
    ));
    await expect(await Downloads.architectureDropdown('(odo)')).toHaveAttr('disabled', true);
    await expect(await Downloads.allArchitectureOptions('(odo)')).toEqual([
      'Select architecture', 'x86_64',
    ]);
    await expect(await Downloads.enabledArchitectureOptions('(odo)')).toEqual([
      'x86_64',
    ]);

    await OSes.selectByVisibleText('Linux');
  });

  it('selecting a category preserves OS & architecture of invisible sections', async () => {
    await expect(await Downloads.visibleRowContaining('(rosa)')).toExist();
    await expect(await Downloads.visibleRowContaining('(helm)')).toExist();
    await expect(await Downloads.visibleRowContaining('(crc)')).toExist();

    await (await Downloads.OSDropdown('(helm)')).selectByVisibleText('Linux');
    await (await Downloads.architectureDropdown('(helm)')).selectByVisibleText('s390x');
    await (await Downloads.OSDropdown('(crc)')).selectByVisibleText('Windows');

    await (await Downloads.categoryDropdown()).selectByVisibleText('Tokens');
    await expect(await Downloads.visibleRowContaining('(rosa)')).not.toExist();
    await expect(await Downloads.visibleRowContaining('(helm)')).not.toExist();
    await expect(await Downloads.visibleRowContaining('(crc)')).not.toExist();

    await (await Downloads.categoryDropdown()).selectByVisibleText('All categories');
    await expect(await Downloads.visibleRowContaining('(rosa)')).toExist();
    await expect(await Downloads.visibleRowContaining('(helm)')).toExist();
    await expect(await Downloads.visibleRowContaining('(crc)')).toExist();

    await expect(await Downloads.OSDropdown('(helm)')).toHaveValue('linux');
    await expect(await Downloads.architectureDropdown('(helm)')).toHaveValue('s390x');
    await expect(await Downloads.OSDropdown('(crc)')).toHaveValue('windows');
  });
});
