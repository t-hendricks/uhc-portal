import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class Downloads extends Page {
  isReady = async () => (await this.visibleRowContaining('ROSA')).isExisting()

  categoryDropdown = async () => $('//*[@aria-label="Select category"]')

  expandAll = async () => $('//button[contains(., "Expand all")]')
  collapseAll = async () => $('//button[contains(., "Collapse all")]')

  visibleRowContaining = async substring => (
    $(`//tr[contains(., "${substring}")][@hidden=false()]`)
  )

  hiddenRowContaining = async substring => (
    $(`//tr[contains(., "${substring}")][@hidden=true()]`)
  )

  expandToggle = async substring => (
    $(`//tr[contains(., "${substring}")]//*[@aria-label="Details"]`)
  )

  OSDropdown = async substring => (
    $(`//tr[contains(., "${substring}")]//*[@aria-label="Select OS dropdown"]`)
  )

  architectureDropdown = async substring => (
    $(`//tr[contains(., "${substring}")]//*[@aria-label="Select architecture dropdown"]`)
  )

  // Returns all options, including disabled ones.
  allArchitectureOptions = async (substring) => {
    const dropdown = await this.architectureDropdown(substring);
    const options = await dropdown.$$('.//option');
    return Promise.all(options.map(e => e.getText()));
  }

  enabledArchitectureOptions = async (substring) => {
    const dropdown = await this.architectureDropdown(substring);
    const options = await dropdown.$$('.//option[@disabled=false()]');
    return Promise.all(options.map(e => e.getText()));
  }

  download = async substring => (
    $(`//tr[contains(., "${substring}")]//a[text()="Download"]`)
  )

  downloadHref = async substring => (
    (await this.download(substring)).getAttribute('href')
  )

  ocmTokenButton = async () => $('//button[contains(., "View API token")]')

  async open() {
    await super.open('/openshift/downloads?fake=true');
  }
}

export default new Downloads();
