import './OfferingCard.scss';
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FlexItem,
  Label,
  Split,
  SplitItem,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListVariants,
  TextListItemVariants,
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
  let offeringCardTextList: { textlistSubject: string; testlistContent: string }[] | undefined;
  let offeringCardDocLink: React.ReactNode | undefined;
  let offeringCardCreationLink: string = '';
  let includeCreationButton = true;
  let externalCreationButton = false;
  let cardLogo: React.ReactNode | undefined;

  switch (offeringType) {
    case 'AWS':
      offeringCardTitle = 'Red Hat OpenShift Service on AWS (ROSA)';
      offeringCardTextList = [
        { textlistSubject: 'Runs on', testlistContent: 'Amazon Web Services' },
        { textlistSubject: 'Purchase through', testlistContent: 'Amazon Web Services' },
        { textlistSubject: 'Billing type', testlistContent: 'Flexible hourly' },
      ];
      offeringCardCreationLink = '/create/rosa/getstarted';
      offeringCardDocLink = (
        <ExternalLink href={docLinks.AWS_OPENSHIFT_LEARN_MORE}>View details</ExternalLink>
      );
      cardLogo = <AWSLogo height="40px" width="40px" className="logo-aws" />;
      break;
    case 'Azure':
      offeringCardTitle = 'Azure Red Hat OpenShift (ARO)';
      offeringCardTextList = [
        { textlistSubject: 'Runs on', testlistContent: 'Microsoft Azure' },
        { textlistSubject: 'Purchase through', testlistContent: 'Microsoft' },
        { textlistSubject: 'Billing type', testlistContent: 'Flexible hourly' },
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
      offeringCardTextList = [
        { textlistSubject: 'Runs on', testlistContent: 'AWS or Google Cloud' },
        { textlistSubject: 'Purchase through', testlistContent: 'Red Hat' },
        { textlistSubject: 'Billing type', testlistContent: 'Flexible or fixed' },
      ];
      offeringCardCreationLink = '/create/osd';
      offeringCardDocLink = (
        <ExternalLink href={docLinks.OPENSHIFT_DEDICATED_LEARN_MORE}>Learn more</ExternalLink>
      );
      cardLogo = <RHLogo className="logo-rhosd" />;
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
        {offeringCardTextList?.length && (
          <TextContent>
            <TextList component={TextListVariants.dl}>
              {offeringCardTextList.map(({ textlistSubject, testlistContent }) => (
                <>
                  <TextListItem component={TextListItemVariants.dt}>
                    <Text component="small">{textlistSubject}</Text>
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>
                    <Text component="small">{testlistContent}</Text>
                  </TextListItem>
                </>
              ))}
            </TextList>
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
                    <Link {...props} data-testid="register-cluster" to={offeringCardCreationLink} />
                  )}
                >
                  Create Cluster
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
