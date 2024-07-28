import React, { useCallback } from 'react';
import { Link } from 'react-router-dom-v5-compat';

import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Label,
  Split,
  SplitItem,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';

import ExternalLink from '~/components/common/ExternalLink';
import InternalTrackingLink from '~/components/common/InternalTrackingLink';

import docLinks from '../../../../common/installLinks.mjs';
import AWSLogo from '../../../../styles/images/AWSLogo';
import IBMLogo from '../../../../styles/images/ibm_cloud-icon.svg';
import microsoftLogo from '../../../../styles/images/Microsoft_logo.svg';
import OpenShiftProductIcon from '../../../../styles/images/OpenShiftProductIcon.svg';
import RHLogo from '../../../../styles/images/RedHatLogo';

import './OfferingCard.scss';

type OfferingCardProps = {
  offeringType?: 'AWS' | 'Azure' | 'RHOSD' | 'RHOCP' | 'RHOIBM' | 'DEVSNBX';
};

const createRosaClusterURL = '/create/rosa/getstarted';
const rosaServicePageURL = '/overview/rosa';
const createOSDClusterURL = '/create/osd';
const createClusterURL = '/create';
const registerClusterURL = '/register';

const CreateRosaClusterLink = (props: any) => (
  <Link {...props} data-testid="create-cluster" to={createRosaClusterURL} />
);

const CreateOSDCluterLink = (props: any) => (
  <Link {...props} data-testid="create-cluster" to={createOSDClusterURL} />
);

const CreateRHOCPCluterLink = (props: any) => (
  <Link {...props} data-testid="create-cluster" to={createClusterURL} />
);

const DEVSNBXOfferingCardDocLinkComponent = () => (
  <ExternalLink noTarget noIcon href="/openshift/sandbox">
    View details
  </ExternalLink>
);

export function OfferingCard(props: OfferingCardProps) {
  const { offeringType } = props;

  let offeringCardTitle: string | undefined;
  let offeringCardLabel: string = 'Managed service';
  let offeringCardDescriptionList:
    | { descriptionListTerm: string; descriptionListDescription: string }[]
    | undefined;
  let offeringCardTextBody: string | undefined;
  let offeringCardDocLink: React.ReactNode | undefined;
  let offeringCardCreationLink: React.ReactNode | undefined;
  let cardLogo: React.ReactNode | undefined;

  const RHOCPOfferingCardDocLinkComponent = useCallback(
    (props) => <Link to={registerClusterURL}>Register cluster</Link>,
    [],
  );

  const AWSOfferingCardDocLinkComponent = useCallback(
    (props) => <Link to={rosaServicePageURL}>View details</Link>,
    [],
  );

  switch (offeringType) {
    case 'AWS':
      offeringCardTitle = 'Red Hat OpenShift Service on AWS (ROSA)';
      offeringCardDescriptionList = [
        { descriptionListTerm: 'Runs on', descriptionListDescription: 'Amazon Web Services' },
        {
          descriptionListTerm: 'Purchase through',
          descriptionListDescription: 'Amazon Web Services',
        },
        { descriptionListTerm: 'Billing type', descriptionListDescription: 'Flexible hourly' },
      ];
      offeringCardCreationLink = (
        <InternalTrackingLink
          isButton
          variant="secondary"
          to={createRosaClusterURL}
          component={CreateRosaClusterLink}
        >
          Create cluster
        </InternalTrackingLink>
      );
      offeringCardDocLink = (
        <InternalTrackingLink
          isButton
          variant={ButtonVariant.link}
          to={rosaServicePageURL}
          component={AWSOfferingCardDocLinkComponent}
        />
      );
      cardLogo = <AWSLogo className="offering-logo" />;
      break;
    case 'Azure':
      offeringCardTitle = 'Azure Red Hat OpenShift (ARO)';
      offeringCardDescriptionList = [
        { descriptionListTerm: 'Runs on', descriptionListDescription: 'Microsoft Azure' },
        { descriptionListTerm: 'Purchase through', descriptionListDescription: 'Microsoft' },
        { descriptionListTerm: 'Billing type', descriptionListDescription: 'Flexible hourly' },
      ];
      offeringCardDocLink = (
        <ExternalLink href={docLinks.AZURE_OPENSHIFT_GET_STARTED}>Learn more on Azure</ExternalLink>
      );
      cardLogo = <img className="offering-logo" src={microsoftLogo} alt="Microsoft Azure logo" />;
      break;

    case 'RHOSD':
      offeringCardTitle = 'Red Hat OpenShift Dedicated';
      offeringCardDescriptionList = [
        { descriptionListTerm: 'Runs on', descriptionListDescription: 'AWS or Google Cloud' },
        { descriptionListTerm: 'Purchase through', descriptionListDescription: 'Red Hat' },
        { descriptionListTerm: 'Billing type', descriptionListDescription: 'Flexible or fixed' },
      ];
      offeringCardCreationLink = (
        <InternalTrackingLink
          isButton
          variant="secondary"
          to={createOSDClusterURL}
          component={CreateOSDCluterLink}
        >
          Create cluster
        </InternalTrackingLink>
      );
      offeringCardDocLink = (
        <ExternalLink href={docLinks.OPENSHIFT_DEDICATED_LEARN_MORE}>Learn more</ExternalLink>
      );
      cardLogo = <RHLogo className="offering-logo" />;
      break;

    case 'RHOCP':
      offeringCardTitle = 'Red Hat OpenShift Container Platform';
      offeringCardLabel = 'Self-managed service';
      offeringCardDescriptionList = [
        { descriptionListTerm: 'Runs on', descriptionListDescription: 'Supported infrastructures' },
        { descriptionListTerm: 'Purchase through', descriptionListDescription: 'Red Hat' },
        { descriptionListTerm: 'Billing type', descriptionListDescription: 'Annual subscription' },
      ];
      offeringCardCreationLink = (
        <InternalTrackingLink
          isButton
          variant="secondary"
          to={createClusterURL}
          component={CreateRHOCPCluterLink}
        >
          Create cluster
        </InternalTrackingLink>
      );
      offeringCardDocLink = (
        <InternalTrackingLink
          variant={ButtonVariant.link}
          component={RHOCPOfferingCardDocLinkComponent}
          to={registerClusterURL}
        >
          Register cluster
        </InternalTrackingLink>
      );
      cardLogo = (
        <img className="offering-logo" src={OpenShiftProductIcon} alt="OpenShift product logo" />
      );
      break;

    case 'RHOIBM':
      offeringCardTitle = 'Red Hat OpenShift on IBM Cloud';
      offeringCardDescriptionList = [
        { descriptionListTerm: 'Runs on', descriptionListDescription: 'IBM Cloud' },
        { descriptionListTerm: 'Purchase through', descriptionListDescription: 'IBM' },
        { descriptionListTerm: 'Billing type', descriptionListDescription: 'Flexible hourly' },
      ];
      offeringCardDocLink = (
        <ExternalLink href="https://cloud.ibm.com/kubernetes/catalog/create?platformType=openshift">
          Learn more on IBM
        </ExternalLink>
      );
      cardLogo = <img className="offering-logo" src={IBMLogo} alt="IBM logo" />;
      break;

    case 'DEVSNBX':
      offeringCardTitle = 'Developer Sandbox';
      offeringCardTextBody =
        'Instant free access to your own minimal, preconfigured environment for development and testing.';
      offeringCardDocLink = (
        <Button variant={ButtonVariant.link} component={DEVSNBXOfferingCardDocLinkComponent}>
          View details
        </Button>
      );
      cardLogo = <RHLogo className="offering-logo" />;
      break;
    default:
      break;
  }

  return (
    <Card className="offering-card">
      <CardHeader>
        <Split hasGutter style={{ width: '100%' }}>
          <SplitItem>{cardLogo}</SplitItem>
          <SplitItem isFilled />
          <SplitItem>
            <Label data-testtag="label" color="blue">
              {offeringCardLabel}
            </Label>
          </SplitItem>
        </Split>
      </CardHeader>
      <CardBody className="card-title">
        <Title headingLevel="h2">{offeringCardTitle}</Title>
      </CardBody>
      <CardBody className="pf-v5-u-mt-md">
        <TextContent>
          {offeringCardTextBody && <Text>{offeringCardTextBody}</Text>}
          {offeringCardDescriptionList?.length && (
            <DescriptionList isHorizontal isCompact isAutoFit>
              <DescriptionListGroup>
                {offeringCardDescriptionList.map(
                  ({ descriptionListTerm, descriptionListDescription }) => (
                    <React.Fragment key={descriptionListTerm}>
                      <DescriptionListTerm>
                        <Text component="small">{descriptionListTerm}</Text>
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        <Text component="small">{descriptionListDescription}</Text>
                      </DescriptionListDescription>
                    </React.Fragment>
                  ),
                )}
              </DescriptionListGroup>
            </DescriptionList>
          )}
        </TextContent>
      </CardBody>
      <CardFooter>
        <Flex>
          {offeringCardCreationLink && <FlexItem>{offeringCardCreationLink}</FlexItem>}
          {offeringCardDocLink && <FlexItem>{offeringCardDocLink}</FlexItem>}
        </Flex>
      </CardFooter>
    </Card>
  );
}
