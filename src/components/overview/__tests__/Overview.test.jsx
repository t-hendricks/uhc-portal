import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, render, screen, userEvent } from '~/testUtils';

import { RECOMMENDED_OPERATORS_CARDS_DATA } from '../components/fixtures';
import Overview from '../Overview';

import '@testing-library/jest-dom';

describe('<Overview />', () => {
  it('contains a few elements of the page', async () => {
    const { container } = render(
      <BrowserRouter>
        <CompatRouter>
          <Overview />
        </CompatRouter>
      </BrowserRouter>,
    );

    // Featured OpenShift cluster types:

    expect(screen.getByText('Featured OpenShift cluster types')).toBeInTheDocument();

    expect(
      screen.getByText('View all OpenShift cluster types', {
        selector: 'a',
      }),
    ).toHaveAttribute('href', '/create');

    // Recommended Operator Cards:

    expect(screen.getByText('Recommended operators')).toBeInTheDocument();

    expect(
      screen.getByText('View all in Ecosystem Catalog', {
        selector: 'a',
      }),
    ).toHaveAttribute(
      'href',
      'https://catalog.redhat.com/search?searchType=software&deployed_as=Operator',
    );

    await checkAccessibility(container);
  });

  it.each([
    {
      ...RECOMMENDED_OPERATORS_CARDS_DATA[0],
      index: 0,
      someDrawerContent:
        'Consistently configure and deploy Kubernetes-based infrastructure and applications across clusters and development lifecycles using Red Hat OpenShift GitOps.',
      learnMoreLinkDestination:
        'https://catalog.redhat.com/software/container-stacks/detail/5fb288c70a12d20cbecc6056',
    },
    {
      ...RECOMMENDED_OPERATORS_CARDS_DATA[1],
      index: 1,
      someDrawerContent:
        'Speed up the delivery of your applications with advanced continuous integration (CI) workflows and automation.',
      learnMoreLinkDestination:
        'https://catalog.redhat.com/software/container-stacks/detail/5ec54a4628834587a6b85ca5',
    },
    {
      ...RECOMMENDED_OPERATORS_CARDS_DATA[2],
      index: 2,
      someDrawerContent:
        'Red Hat OpenShift Service Mesh adds tracing and visualization so you have a greater understanding of what is happening in and across applications as they are running, from start to finish.',
      learnMoreLinkDestination:
        'https://catalog.redhat.com/software/container-stacks/detail/5ec53e8c110f56bd24f2ddc4',
    },
  ])(
    'verifies Recommended Operators Card "$title" content (basic functionality verification of each Card separately)',
    async ({ title, description, index, someDrawerContent, learnMoreLinkDestination }) => {
      render(
        <BrowserRouter>
          <CompatRouter>
            <Overview />
          </CompatRouter>
        </BrowserRouter>,
      );

      // ensure Cards's description is shown:
      expect(screen.getByText(description)).toBeInTheDocument();

      // ensure the content of the Card's Drawers is not shown:
      expect(screen.queryByText(someDrawerContent)).not.toBeInTheDocument();

      // Basic functionality checks:

      const learnMoreBtns = screen.getAllByTestId('product-overview-card__learn-more-button');
      expect(learnMoreBtns).toHaveLength(3);

      // click on Card's Learn more button
      await userEvent.click(learnMoreBtns[index]);

      // ensure the title and some content is shown
      expect(screen.getByTestId('drawer-panel-content__title')).toHaveTextContent(title);
      expect(screen.getByText('by Red Hat')).toBeInTheDocument();
      expect(screen.getByText(someDrawerContent)).toBeInTheDocument();

      // Learn more link
      const learnMoreLink = screen.getByText(`Learn more about ${title}`);
      expect(learnMoreLink).toBeInTheDocument();
      expect(learnMoreLink).toHaveAttribute('href', learnMoreLinkDestination);

      // click on close Drawer button:
      const closeDrawerBtn = screen.getByTestId('drawer-close-button');
      expect(closeDrawerBtn).toBeInTheDocument();
      await userEvent.click(closeDrawerBtn);

      // ensure some of the previously shown content of the Drawer is no longer shown:
      expect(screen.queryByText(someDrawerContent)).not.toBeInTheDocument();
      expect(screen.queryByText('by Red Hat')).not.toBeInTheDocument();
    },
  );

  it('tests Recommended Operators Cards Functionality -> Click on the learnMore of each card and verify that the content of the Drawer switches to the appropriate card that was clicked', async () => {
    render(
      <BrowserRouter>
        <CompatRouter>
          <Overview />
        </CompatRouter>
      </BrowserRouter>,
    );

    const gitopsCardData = { ...RECOMMENDED_OPERATORS_CARDS_DATA[0] };
    const pipelinesCardData = { ...RECOMMENDED_OPERATORS_CARDS_DATA[1] };
    const serviceMeshCardData = { ...RECOMMENDED_OPERATORS_CARDS_DATA[2] };

    const learnMoreBtns = screen.getAllByTestId('product-overview-card__learn-more-button');
    expect(learnMoreBtns).toHaveLength(3);

    // click on Gitops card's Learn more button
    await userEvent.click(learnMoreBtns[0]);

    // ensure the title and some drawer content is shown
    expect(screen.getByTestId('drawer-panel-content__title')).toHaveTextContent(
      gitopsCardData.title,
    );
    expect(
      screen.getByText(
        'Consistently configure and deploy Kubernetes-based infrastructure and applications across clusters and development lifecycles using Red Hat OpenShift GitOps.',
      ),
    ).toBeInTheDocument();

    // click on close Drawer button:
    const closeDrawerBtn = screen.getByTestId('drawer-close-button');
    expect(closeDrawerBtn).toBeInTheDocument();
    await userEvent.click(closeDrawerBtn);

    // ensure some of the previously shown content of the Drawer is no longer shown:
    expect(
      screen.queryByText(
        'Consistently configure and deploy Kubernetes-based infrastructure and applications across clusters and development lifecycles using Red Hat OpenShift GitOps.',
      ),
    ).not.toBeInTheDocument();

    // click on Pipelines card's Learn more button
    await userEvent.click(learnMoreBtns[1]);

    // ensure the title and some drawer content is shown
    expect(screen.getByTestId('drawer-panel-content__title')).toHaveTextContent(
      pipelinesCardData.title,
    );
    expect(
      screen.getByText(
        'Speed up the delivery of your applications with advanced continuous integration (CI) workflows and automation.',
      ),
    ).toBeInTheDocument();

    // click on Service Mesh card's Learn more button
    await userEvent.click(learnMoreBtns[2]);

    // ensure the title and some drawer content is shown
    expect(screen.getByTestId('drawer-panel-content__title')).toHaveTextContent(
      serviceMeshCardData.title,
    );
    expect(
      screen.getByText(
        'Red Hat OpenShift Service Mesh adds tracing and visualization so you have a greater understanding of what is happening in and across applications as they are running, from start to finish.',
      ),
    ).toBeInTheDocument();
  });
});
