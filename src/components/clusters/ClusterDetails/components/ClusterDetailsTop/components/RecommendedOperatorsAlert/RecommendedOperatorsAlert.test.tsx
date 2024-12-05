import React from 'react';

import { checkAccessibility, render, screen, userEvent, waitFor } from '~/testUtils';

import clusterStates from '../../../../../common/clusterStates';

import { ALERT_MESSAGES, CARDS, TEST_CASES } from './fixtures';
import { RecommendedOperatorsAlert, STATIC_ALERT_MESSAGES } from './RecommendedOperatorsAlert';

import '@testing-library/jest-dom';

describe('<RecommendedOperatorsAlert />', () => {
  const openLearnMore = jest.fn();
  const closeDrawer = jest.fn();
  const hideRecommendedOperatorsAlert = jest.fn();

  test.each`
    clusterState                 | title                                         | description
    ${clusterStates.WAITING}     | ${STATIC_ALERT_MESSAGES.actionRequired.title} | ${STATIC_ALERT_MESSAGES.actionRequired.description}
    ${clusterStates.PENDING}     | ${STATIC_ALERT_MESSAGES.installing.title}     | ${STATIC_ALERT_MESSAGES.installing.description}
    ${clusterStates.VALIDATING}  | ${STATIC_ALERT_MESSAGES.installing.title}     | ${STATIC_ALERT_MESSAGES.installing.description}
    ${clusterStates.INSTALLING}  | ${STATIC_ALERT_MESSAGES.installing.title}     | ${STATIC_ALERT_MESSAGES.installing.description}
    ${clusterStates.HIBERNATING} | ${STATIC_ALERT_MESSAGES.hibernating.title}    | ${STATIC_ALERT_MESSAGES.hibernating.description}
    ${clusterStates.ERROR}       | ${STATIC_ALERT_MESSAGES.error.title}          | ${STATIC_ALERT_MESSAGES.error.description}
  `(
    'should show appropriate message for "$clusterState" cluster',
    ({ clusterState, title, description }) => {
      // Arrange
      render(
        <RecommendedOperatorsAlert
          clusterState={clusterState}
          openLearnMore={openLearnMore}
          closeDrawer={closeDrawer}
          hideRecommendedOperatorsAlert={hideRecommendedOperatorsAlert}
          isArchived={false}
        />,
      );

      // Assert
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    },
  );

  it(`should show appropriate message & should also find console link for ${clusterStates.READY} cluster, when consoleURL link is provided`, () => {
    // Arrange
    const { title, description } = ALERT_MESSAGES.ready;

    render(
      <RecommendedOperatorsAlert
        clusterState={clusterStates.READY}
        openLearnMore={openLearnMore}
        closeDrawer={closeDrawer}
        hideRecommendedOperatorsAlert={hideRecommendedOperatorsAlert}
        consoleURL="someLink"
        isArchived={false}
      />,
    );

    expect(screen.getByText(title)).toBeInTheDocument();

    // The External link adds this expression when using 'toHaveTextContent' selector
    const descriptionWithOpenNewWindowOrTab = `${description.slice(0, description.length - 1)} (new window or tab).`;
    expect(screen.getByTestId('alert-description-with-consoleURL-provided')).toHaveTextContent(
      descriptionWithOpenNewWindowOrTab,
    );

    // ensure console has the correct link
    const consoleLink = screen.getByText('console');
    expect(consoleLink).toBeInTheDocument();
    expect(consoleLink).toHaveAttribute('href', 'someLink');
  });

  it(`should show appropriate message for ${clusterStates.READY} cluster, when consoleURL link is NOT provided`, () => {
    // Arrange
    const { title, description } = ALERT_MESSAGES.ready;

    render(
      <RecommendedOperatorsAlert
        clusterState={clusterStates.READY}
        openLearnMore={openLearnMore}
        closeDrawer={closeDrawer}
        hideRecommendedOperatorsAlert={hideRecommendedOperatorsAlert}
        isArchived={false}
      />,
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it.each(TEST_CASES)(
    'should show "$title" ProductCard and make sure it is not selected',
    async ({ title, description, drawerPanelContent, index }) => {
      // Arrange
      render(
        <RecommendedOperatorsAlert
          clusterState={clusterStates.INSTALLING}
          openLearnMore={openLearnMore}
          closeDrawer={closeDrawer}
          hideRecommendedOperatorsAlert={hideRecommendedOperatorsAlert}
          consoleURL="someLink"
          isArchived={false}
        />,
      );

      // Assert
      // Card Info:
      const learnMoreBtns = screen.getAllByText('Learn more');

      const productOverviewCards = screen.getAllByTestId('product-overview-card');

      expect(screen.getByText(`${title}`)).toBeInTheDocument();
      expect(screen.getByText(`${description}`)).toBeInTheDocument();

      await waitFor(() =>
        expect(productOverviewCards[index]).not.toHaveClass('pf-m-selected-raised'),
      );
      expect(productOverviewCards[index]).not.toHaveClass('pf-m-selected-raised');

      const learnMoreBtn = learnMoreBtns[index];
      await userEvent.click(learnMoreBtn);

      expect(openLearnMore).toHaveBeenCalledWith(title, drawerPanelContent);
    },
  );

  it('should show all ProductCards while "Advanced Cluster Security for Kubernetes" as selected when providing selectedCardTitle while other ProductCards should not be selected', async () => {
    // Arrange
    render(
      <RecommendedOperatorsAlert
        selectedCardTitle="Advanced Cluster Security for Kubernetes"
        clusterState={clusterStates.INSTALLING}
        openLearnMore={openLearnMore}
        closeDrawer={closeDrawer}
        hideRecommendedOperatorsAlert={hideRecommendedOperatorsAlert}
        consoleURL="someLink"
        isArchived={false}
      />,
    );

    // Assert
    const productOverviewCards = screen.getAllByTestId('product-overview-card');
    expect(productOverviewCards).toHaveLength(CARDS.length);

    const advancedClusterSecurityCard = productOverviewCards[0];
    await waitFor(() => expect(advancedClusterSecurityCard).toHaveClass('pf-m-selected-raised'));
    expect(advancedClusterSecurityCard).toHaveClass('pf-m-selected-raised');

    for (let i = 1; i < CARDS.length; i += 1)
      expect(productOverviewCards[i]).not.toHaveClass('pf-m-selected-raised');
  });

  // isArchived tests:

  test.each`
    clusterState                 | title                                         | description
    ${clusterStates.WAITING}     | ${STATIC_ALERT_MESSAGES.actionRequired.title} | ${STATIC_ALERT_MESSAGES.actionRequired.description}
    ${clusterStates.PENDING}     | ${STATIC_ALERT_MESSAGES.installing.title}     | ${STATIC_ALERT_MESSAGES.installing.description}
    ${clusterStates.VALIDATING}  | ${STATIC_ALERT_MESSAGES.installing.title}     | ${STATIC_ALERT_MESSAGES.installing.description}
    ${clusterStates.INSTALLING}  | ${STATIC_ALERT_MESSAGES.installing.title}     | ${STATIC_ALERT_MESSAGES.installing.description}
    ${clusterStates.HIBERNATING} | ${STATIC_ALERT_MESSAGES.hibernating.title}    | ${STATIC_ALERT_MESSAGES.hibernating.description}
    ${clusterStates.ERROR}       | ${STATIC_ALERT_MESSAGES.error.title}          | ${STATIC_ALERT_MESSAGES.error.description}
  `(
    `should not show "$clusterState" message for an ${clusterStates.ARCHIVED} cluster`,
    ({ title, description }) => {
      // Arrange
      render(
        <RecommendedOperatorsAlert
          clusterState={clusterStates.ARCHIVED}
          openLearnMore={openLearnMore}
          closeDrawer={closeDrawer}
          hideRecommendedOperatorsAlert={hideRecommendedOperatorsAlert}
          consoleURL="someLink"
          isArchived
        />,
      );

      // Assert
      expect(screen.queryByText(title)).not.toBeInTheDocument();
      expect(screen.queryByText(description)).not.toBeInTheDocument();

      expect(
        screen.queryByTestId('alert-description-with-consoleURL-provided'),
      ).not.toBeInTheDocument();
    },
  );

  it.each(TEST_CASES)(
    `should not show "$title" ProductCard for an ${clusterStates.ARCHIVED} cluster`,
    async ({ title, description, drawerPanelContent, index }) => {
      // Arrange
      render(
        <RecommendedOperatorsAlert
          clusterState={clusterStates.INSTALLING}
          openLearnMore={openLearnMore}
          closeDrawer={closeDrawer}
          hideRecommendedOperatorsAlert={hideRecommendedOperatorsAlert}
          isArchived
        />,
      );

      // Assert
      // Card Info:
      const learnMoreBtns = screen.queryByText('Learn more');
      expect(learnMoreBtns).toBe(null);

      const productOverviewCards = screen.queryByText('product-overview-card');
      expect(productOverviewCards).toBe(null);

      expect(screen.queryByText(`${title}`)).not.toBeInTheDocument();
      expect(screen.queryByText(`${description}`)).not.toBeInTheDocument();
    },
  );

  it(`should pass accessibility check`, async () => {
    // Arrange
    const { container } = render(
      <RecommendedOperatorsAlert
        clusterState={clusterStates.INSTALLING}
        openLearnMore={openLearnMore}
        closeDrawer={closeDrawer}
        hideRecommendedOperatorsAlert={hideRecommendedOperatorsAlert}
        consoleURL="someLink"
        isArchived={false}
      />,
    );

    // Assert
    await checkAccessibility(container);
  });
});
