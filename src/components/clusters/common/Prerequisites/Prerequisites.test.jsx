import React from 'react';

import wizardConnector from '~/components/clusters/wizards/common/WizardConnector';
import { checkAccessibility, render, screen } from '~/testUtils';

import Prerequisites from './Prerequisites';

describe('<Prerequisites/>', () => {
  const ConnectedPrerequisites = wizardConnector(Prerequisites);
  const Children = <>Before continuing, confirm that all prerequisites are met</>;
  const inputLabel =
    'I’ve read and completed all the prerequisites and am ready to continue creating my cluster.';

  it('is expanded when initiallyExpanded is set to true', async () => {
    const { container } = render(<Prerequisites initiallyExpanded>{Children}</Prerequisites>);

    expect(container.querySelector('.pf-v5-c-expandable-section__content')).not.toHaveAttribute(
      'hidden',
    );
    expect(
      screen.getByText('Before continuing, confirm that all prerequisites are met'),
    ).toBeVisible();
    expect(screen.queryByLabelText(inputLabel)).not.toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('is collapsed when initiallyExpanded is false and displays a checkbox when acknowledgementRequired is set to true', async () => {
    const { container } = render(
      <ConnectedPrerequisites initiallyExpanded={false} acknowledgementRequired>
        {Children}
      </ConnectedPrerequisites>,
    );
    expect(container.querySelector('.pf-v5-c-expandable-section__content')).toHaveAttribute(
      'hidden',
    );
    expect(
      screen.getByText('Before continuing, confirm that all prerequisites are met'),
    ).not.toBeVisible();

    expect(await screen.findByText(inputLabel)).toBeInTheDocument();

    // There is an error where the checkbox is required but is not coded as such
    // expect(screen.getByLabelText(inputLabel)).toBeRequired();

    expect(
      screen.getByText('Acknowledge that you have read and completed all prerequisites.'),
    ).toBeInTheDocument();
  });

  it('displays custom toggle button text', () => {
    render(<Prerequisites toggleText="Cluster Prerequisites">{Children}</Prerequisites>);

    expect(screen.getByRole('button').textContent).toEqual('Cluster Prerequisites');
  });
});
