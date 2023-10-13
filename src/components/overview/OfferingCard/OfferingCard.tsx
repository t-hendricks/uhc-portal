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
import docLinks from '../../../common/installLinks.mjs';

type OfferingCardProps = {
  offeringType?: 'AWS' | 'Azure' | 'RHOSD';
};

export function OfferingCard(props: OfferingCardProps) {
  const { offeringType } = props;
  let offeringCardTitle: string = '';
  let offeringCardDescriptionList:
    | { descriptionListTerm: string; descriptionListDescription: string }[]
    | undefined;
  let offeringCardDocLink: React.ReactNode | undefined;
  let offeringCardCreationLink: string = '';
  let includeCreationButton = true;
  let externalCreationButton = false;
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
      includeCreationButton = false;
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
            <Label color="blue">Managed service</Label>
          </SplitItem>
        </Split>
      </CardHeader>
      <CardBody className="card-title">
        <Title headingLevel="h2">{offeringCardTitle}</Title>
      </CardBody>
      <CardBody className="pf-v5-u-mt-md">
        {offeringCardDescriptionList?.length && (
          <TextContent>
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
          </TextContent>
        )}
      </CardBody>
      <CardFooter>
        <Flex>
          {includeCreationButton && (
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
