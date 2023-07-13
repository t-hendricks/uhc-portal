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
  Title,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import ExternalLink from '~/components/common/ExternalLink';
import microsoftLogo from '../../../../styles/images/Microsoft_logo.svg';
import awsLogo from '../../../../styles/images/AWSLogo';
import redhatLogo from '../../../../styles/images/redhat-logo.svg';
import docLinks from '../../../../common/installLinks.mjs';

type OfferingCardProps = {
  offeringType?: 'AWS' | 'Azure' | 'RHOSD';
};

export function OfferingCard(props: OfferingCardProps) {
  const { offeringType } = props;
  let offeringLogoString: string = '';
  let offeringCardTitle: string = '';
  let offeringCardBulletPoints: string[] = [];
  let offeringCardDocLink: string = '';
  let offeringCardGetStartedLink: string = '';
  let externalGetStartedLink = false;
  let logoAlt = '';

  switch (offeringType) {
    case 'AWS':
      offeringCardTitle = 'Red Hat OpenShift on AWS';
      offeringCardBulletPoints = [
        'Hosted on AWS',
        'Flexible hourly billing',
        'Purchased through Amazon Web Services',
      ];
      offeringCardGetStartedLink = '/create/rosa/getstarted';
      offeringCardDocLink = docLinks.AWS_OPENSHIFT_LEARN_MORE;
      logoAlt = 'Amazon Web Services logo';
      break;
    case 'Azure':
      offeringLogoString = microsoftLogo;
      offeringCardTitle = 'Azure Red Hat OpenShift (ARO)';
      offeringCardBulletPoints = [
        'Hosted on Microsoft Azure',
        'Flexible hourly billing',
        'Purchased through Microsoft Azure',
      ];
      offeringCardGetStartedLink = docLinks.AZURE_OPENSHIFT_GET_STARTED;
      externalGetStartedLink = true;
      logoAlt = 'Microsoft Azure logo';
      break;
    case 'RHOSD':
      offeringLogoString = redhatLogo;
      offeringCardTitle = 'Red Hat OpenShift Dedicated';
      offeringCardBulletPoints = [
        'Hosted on Amazon Web Services (AWS) and Google Cloud.',
        'Available on AWS and GCP',
        'Purchased through Red Hat',
      ];
      offeringCardGetStartedLink = '/create/osd';
      offeringCardDocLink = docLinks.OPENSHIFT_DEDICATED_LEARN_MORE;
      logoAlt = 'Red Hat OpenShift Dedicated logo';
      break;
    default:
      break;
  }

  return (
    <Card className="offering-card">
      <CardHeader>
        <Split hasGutter style={{ width: '100%' }}>
          <SplitItem>
            {offeringType === 'AWS' ? (
              awsLogo('40px', '40px', 'logo-aws')
            ) : (
              <img className="offering-logo" src={offeringLogoString} alt={logoAlt} />
            )}
          </SplitItem>
          <SplitItem isFilled />
          <SplitItem>
            <Label color="blue">Managed service</Label>
          </SplitItem>
        </Split>
      </CardHeader>
      <CardBody className="card-title">
        <Title headingLevel="h2">{offeringCardTitle}</Title>
      </CardBody>
      <CardBody>
        {offeringCardBulletPoints?.length && (
          <TextContent>
            <TextList className="card-textlist pf-u-ml-0">
              {offeringCardBulletPoints.map((descriptionItem) => (
                <TextListItem>
                  <Text>{descriptionItem}</Text>
                </TextListItem>
              ))}
            </TextList>
          </TextContent>
        )}
      </CardBody>
      <CardFooter>
        <Flex>
          <FlexItem>
            {externalGetStartedLink ? (
              <ExternalLink href={offeringCardGetStartedLink} isButton variant="secondary">
                Get started
              </ExternalLink>
            ) : (
              <Button
                variant="secondary"
                component={(props) => (
                  <Link {...props} data-testid="register-cluster" to={offeringCardGetStartedLink} />
                )}
              >
                Get started
              </Button>
            )}
          </FlexItem>
          {offeringCardDocLink && (
            <FlexItem>
              <ExternalLink href={offeringCardDocLink}>Learn more</ExternalLink>
            </FlexItem>
          )}
        </Flex>
      </CardFooter>
    </Card>
  );
}
