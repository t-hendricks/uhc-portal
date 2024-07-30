import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, render, screen, userEvent } from '~/testUtils';

import Overview from './Overview';
import { RECOMMENDED_OPERATORS_CARDS_DATA } from './components/fixtures';

import '@testing-library/jest-dom';

describe('<Overview />', () => {
  it('contains correct links', async () => {
    const { container } = render(
      <BrowserRouter>
        <CompatRouter>
          <Overview />
        </CompatRouter>
      </BrowserRouter>,
    );

    expect(
      screen.getByText('View all OpenShift cluster types', {
        selector: 'a',
      }),
    ).toHaveAttribute('href', '/create');

    expect(
      screen.getByText('Browse all OpenShift learning resources', { selector: 'a' }),
    ).toHaveAttribute('href', '/openshift/learning-resources');

    await checkAccessibility(container);
  });

  it('tests Recommended Operators section Functionality', async () => {
    const { container } = render(
      <BrowserRouter>
        <CompatRouter>
          <Overview />
        </CompatRouter>
      </BrowserRouter>,
    );

    // Ensure some elements of the section is presented on the screen
    // title:
    expect(screen.getByText('Recommended operators')).toBeInTheDocument();

    // ensure Cards's description is shown:
    const gitopsCardData = RECOMMENDED_OPERATORS_CARDS_DATA[0];
    const pipelinesCardData = RECOMMENDED_OPERATORS_CARDS_DATA[1];
    const serviceMeshCardData = RECOMMENDED_OPERATORS_CARDS_DATA[2];

    expect(screen.getByText(gitopsCardData.description)).toBeInTheDocument();
    expect(screen.getByText(pipelinesCardData.description)).toBeInTheDocument();
    expect(screen.getByText(serviceMeshCardData.description)).toBeInTheDocument();

    // ensure the content of the Card's Drawers is not shown
    expect(
      screen.queryByText(
        'Consistently configure and deploy Kubernetes-based infrastructure and applications across clusters and development lifecycles using Red Hat OpenShift GitOps.',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'Speed up the delivery of your applications with advanced continuous integration (CI) workflows and automation.',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Red Hat OpenShift Service Mesh is based on the open source'),
    ).not.toBeInTheDocument();

    // Functionality checks:

    const learnMoreBtns = screen.getAllByTestId('product-overview-card__learn-more-button');
    expect(learnMoreBtns).toHaveLength(3);

    // click on Gitops's Learn more button
    await userEvent.click(learnMoreBtns[0]);

    // ensure the title and some content is shown
    expect(screen.getByTestId('drawer-panel-content__title')).toHaveTextContent(
      gitopsCardData.title,
    );
    expect(screen.getByText('by Red Hat')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Consistently configure and deploy Kubernetes-based infrastructure and applications across clusters and development lifecycles using Red Hat OpenShift GitOps.',
      ),
    ).toBeInTheDocument();

    // Learn more link
    const gitopsLearnMoreLink = screen.getByText('Learn more about Red Hat OpenShift GitOps');
    expect(gitopsLearnMoreLink).toBeInTheDocument();
    expect(gitopsLearnMoreLink).toHaveAttribute(
      'href',
      'https://catalog.redhat.com/software/container-stacks/detail/5fb288c70a12d20cbecc6056',
    );

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
    expect(screen.queryByText('by Red Hat')).not.toBeInTheDocument();

    // click on Pipelines's Learn more button
    await userEvent.click(learnMoreBtns[1]);

    // ensure the title and some content is shown
    expect(screen.getByTestId('drawer-panel-content__title')).toHaveTextContent(
      pipelinesCardData.title,
    );
    expect(screen.getByText('by Red Hat')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Speed up the delivery of your applications with advanced continuous integration (CI) workflows and automation.',
      ),
    ).toBeInTheDocument();

    // Learn more link
    const pipelinesLearnMoreLink = screen.getByText('Learn more about Red Hat OpenShift Pipelines');
    expect(pipelinesLearnMoreLink).toBeInTheDocument();
    expect(pipelinesLearnMoreLink).toHaveAttribute(
      'href',
      'https://catalog.redhat.com/software/container-stacks/detail/5ec54a4628834587a6b85ca5',
    );

    // click on Service Mesh's Learn more button
    await userEvent.click(learnMoreBtns[2]);

    // ensure the title and some content is shown
    expect(screen.getByTestId('drawer-panel-content__title')).toHaveTextContent(
      serviceMeshCardData.title,
    );
    expect(screen.getByText('by Red Hat')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Red Hat OpenShift Service Mesh adds tracing and visualization so you have a greater understanding of what is happening in and across applications as they are running, from start to finish.',
      ),
    ).toBeInTheDocument();

    // Learn more link
    const serviceMeshLearnMoreLink = screen.getByText(
      'Learn more about Red Hat OpenShift Service Mesh',
    );
    expect(serviceMeshLearnMoreLink).toBeInTheDocument();
    expect(serviceMeshLearnMoreLink).toHaveAttribute(
      'href',
      'https://catalog.redhat.com/software/container-stacks/detail/5ec53e8c110f56bd24f2ddc4',
    );

    await checkAccessibility(container);
  });
});
