import './OfferingCard.scss';
import React from 'react';
import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Flex,
  FlexItem,
  Label,
  Split,
  SplitItem,
  TextContent,
  Text,
  Title,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import ExternalLink from '~/components/common/ExternalLink';
import microsoftLogo from '../../../styles/images/Microsoft_logo.svg';
import AWSLogo from '../../../styles/images/AWSLogo';
import RHLogo from '../../../styles/images/RedHatLogo';
import IBMLogo from '../../../styles/images/ibm_cloud-icon.svg';
import OpenShiftProductIcon from '../../../styles/images/OpenShiftProductIcon.svg';
import docLinks from '../../../common/installLinks.mjs';

type OfferingCardProps = {
  offeringType?: 'AWS' | 'Azure' | 'RHOSD' | 'RHOCP' | 'RHOIBM' | 'DEVSNBX';
};

export function OfferingCard(props: OfferingCardProps) {
  const { offeringType } = props;
  let offeringCardTitle: string | undefined;
  let offeringCardLabel: string = 'Managed service';
  let offeringCardDescriptionList:
    | { descriptionListTerm: string; descriptionListDescription: string }[]
    | undefined;
  let offeringCardTextBody: string | undefined;
  let offeringCardDocLink: React.ReactNode | undefined;
  let offeringCardCreationLink: string | undefined;
  let externalCreationButton: boolean = false;
  let cardLogo: React.ReactNode | undefined;

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
      offeringCardCreationLink = '/create/rosa/getstarted';
      offeringCardDocLink = (
        <Button
          variant={ButtonVariant.link}
          component={() => <Link to="/services/rosa">View details</Link>}
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
      externalCreationButton = true;
      cardLogo = <img className="offering-logo" src={microsoftLogo} alt="Microsoft Azure logo" />;
      break;

    case 'RHOSD':
      offeringCardTitle = 'Red Hat OpenShift Dedicated';
      offeringCardDescriptionList = [
        { descriptionListTerm: 'Runs on', descriptionListDescription: 'AWS or Google Cloud' },
        { descriptionListTerm: 'Purchase through', descriptionListDescription: 'Red Hat' },
        { descriptionListTerm: 'Billing type', descriptionListDescription: 'Flexible or fixed' },
      ];
      offeringCardCreationLink = '/create/osd';
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
      offeringCardCreationLink = '/create';
      offeringCardDocLink = (
        <Button
          variant={ButtonVariant.link}
          component={() => <Link to="/register">Register cluster</Link>}
        />
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
        <Button
          variant={ButtonVariant.link}
          component={() => <Link to="/sandbox">View details</Link>}
        />
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
            <Label color="blue">{offeringCardLabel}</Label>
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
                    <>
                      <DescriptionListTerm>
                        <Text component="small">{descriptionListTerm}</Text>
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        <Text component="small">{descriptionListDescription}</Text>
                      </DescriptionListDescription>
                    </>
                  ),
                )}
              </DescriptionListGroup>
            </DescriptionList>
          )}
        </TextContent>
      </CardBody>
      <CardFooter>
        <Flex>
          {offeringCardCreationLink && (
            <FlexItem>
              {externalCreationButton ? (
                <ExternalLink href={offeringCardCreationLink} isButton variant="secondary">
                  Create Cluster
                </ExternalLink>
              ) : (
                <Button
                  variant="secondary"
                  component={(props) => (
                    <Link {...props} data-testid="create-cluster" to={offeringCardCreationLink} />
                  )}
                >
                  Create cluster
                </Button>
              )}
            </FlexItem>
          )}
          {offeringCardDocLink && <FlexItem>{offeringCardDocLink}</FlexItem>}
        </Flex>
      </CardFooter>
    </Card>
  );
}
