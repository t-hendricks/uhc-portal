import React from 'react';
import { Route } from 'react-router-dom';

import { PageSection } from '@patternfly/react-core';

import { AppPage } from '~/components/App/AppPage';
import Breadcrumbs from '~/components/common/Breadcrumbs';
import PageTitle from '~/components/common/PageTitle';
import useAuthToken from '~/hooks/useAuthToken';

import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';
import InstructionsPreRelease from './instructions/InstructionsPreRelease';
import InstructionsPullSecret from './instructions/InstructionsPullSecret';
import OCPInstructions from './instructions/OCPInstructions';
import {
  InstallComponentProps,
  InstructionChooserProps,
  OCPInstructionProps,
  PullSecretInstructionsProps,
  ReleaseInstructionsProps,
  Routes,
} from './models/types';

export const InstallWithInstructionChooserWrapper = (props: InstructionChooserProps) => {
  const {
    breadCrumbsPaths,
    appPageTitle,
    providerTitle,
    aiPageLink,
    aiLearnMoreLink,
    hideIPI,
    ipiPageLink,
    ipiLearnMoreLink,
    hideUPI,
    upiPageLink,
    upiLearnMoreLink,
    agentBasedPageLink,
    agentBasedLearnMoreLink,
    providerSpecificFeatures,
    name,
    recommend,
  } = props;

  const breadcrumbs = <Breadcrumbs path={[...breadCrumbsPaths]} />;

  return (
    <AppPage title={appPageTitle}>
      <InstructionsChooserPageTitle cloudName={providerTitle} breadcrumbs={breadcrumbs} />
      <PageSection>
        <InstructionsChooser
          aiPageLink={aiPageLink}
          aiLearnMoreLink={aiLearnMoreLink}
          hideIPI={hideIPI}
          ipiLearnMoreLink={ipiLearnMoreLink}
          ipiPageLink={ipiPageLink}
          hideUPI={hideUPI}
          upiPageLink={upiPageLink}
          upiLearnMoreLink={upiLearnMoreLink}
          agentBasedPageLink={agentBasedPageLink}
          agentBasedLearnMoreLink={agentBasedLearnMoreLink}
          providerSpecificFeatures={providerSpecificFeatures}
          name={name}
          recommend={recommend}
        />
      </PageSection>
    </AppPage>
  );
};

export const InstallWithOCPInstructionsWrapper = (props: OCPInstructionProps) => {
  const {
    breadCrumbsPaths,
    appPageTitle,
    providerTitle,
    cloudProviderId,
    customizations,
    instructionsMapping,
    isUPI,
    showPreReleaseDocs,
    installationTypeId,
  } = props;
  const token = useAuthToken();

  const breadcrumbs = <Breadcrumbs path={[...breadCrumbsPaths]} />;

  return (
    <AppPage title={appPageTitle}>
      <PageTitle title={providerTitle} breadcrumbs={breadcrumbs} />
      <PageSection>
        <OCPInstructions
          token={token}
          cloudProviderID={cloudProviderId}
          customizations={customizations}
          showPreReleaseDocs={showPreReleaseDocs}
          installationTypeId={installationTypeId}
          isUPI={isUPI}
          {...instructionsMapping}
        />
      </PageSection>
    </AppPage>
  );
};

export const InstallWithReleaseInstructionsWrapper = (props: ReleaseInstructionsProps) => {
  const { breadCrumbsPaths, appPageTitle, providerTitle, installer } = props;

  const token = useAuthToken();

  const breadcrumbs = <Breadcrumbs path={[...breadCrumbsPaths]} />;

  return (
    <AppPage title={appPageTitle}>
      <PageTitle title={providerTitle} breadcrumbs={breadcrumbs} />
      <PageSection>
        <InstructionsPreRelease token={token} installer={installer} />
      </PageSection>
    </AppPage>
  );
};

export const InstallPullSecretInstructionsWrapper = (props: PullSecretInstructionsProps) => {
  const { breadCrumbsPaths, appPageTitle, providerTitle } = props;

  const token = useAuthToken();

  const breadcrumbs = <Breadcrumbs path={[...breadCrumbsPaths]} />;

  return (
    <AppPage title={appPageTitle}>
      <PageTitle title={providerTitle} breadcrumbs={breadcrumbs} />
      <PageSection className="ocp-instructions">
        <InstructionsPullSecret token={token} />
      </PageSection>
    </AppPage>
  );
};

// Wrapper component to choose which type of Install component to render
export const InstallComponentWrapper = (props: InstallComponentProps) => {
  const { componentChooser, propsData } = props;

  switch (componentChooser) {
    case 'instructionsChooser':
      return <InstallWithInstructionChooserWrapper {...propsData} />;
    case 'releaseInstructions':
      return <InstallWithReleaseInstructionsWrapper {...propsData} />;
    case 'pullSecretInstructions':
      return <InstallPullSecretInstructionsWrapper {...propsData} />;
    default:
      return <InstallWithOCPInstructionsWrapper {...propsData} />;
  }
};

// Loop through all Install component Routes and render required Install component
export const InstallRouteMap = (routes: Routes[]) =>
  routes.map((route: Routes) => <Route path={route.path} element={route.element} />);
