class LeaveCreateClusterPrompt {
  testId = 'leave-cluster-modal';

  get element() {
    return $(`[data-testid='${this.testId}']`);
  }

  waitForDisplayed = timeout => browser.waitUntil(async () => {
    const prompt = await this.element;

    if (await prompt.isDisplayed()) {
      return prompt;
    }

    return null;
  }, {
    timeout,
    timeoutMsg: 'expected prompt to be displayed',
  });

  submit = async () => {
    const button = await $('button[data-testid="submit-button"]');
    return button.click();
  }

  cancel = async () => {
    const button = await $('button[data-testid="cancel-button"]');
    return button.click();
  }
}

export default new LeaveCreateClusterPrompt();
