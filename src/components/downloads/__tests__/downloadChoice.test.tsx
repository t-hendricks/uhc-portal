import { channels, tools, urls } from '~/common/installLinks.mjs';
import { render } from '~/testUtils';

import { downloadChoice } from '../downloadChoice';

describe('downloadChoice', () => {
  // For this test we only want the button from the last cell.
  Object.values(tools).forEach((tool) => {
    const selections = {};
    const setSelections = () => {};
    const chooser = downloadChoice(selections, setSelections, urls, tool, channels.STABLE, {
      text: 'Download',
    });

    if (urls[tool]) {
      // skip tools that have no data yet
      it(`initially ${tool} button has a url`, () => {
        const { getByRole } = render(chooser.downloadButton);

        const downloadButton = getByRole('link');
        expect(downloadButton).toHaveAttribute('href', expect.stringMatching(/.+/));
      });
    }
  });
});
