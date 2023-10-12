import './RosaServicePage.scss';
import React, { useEffect, useState } from 'react';
import {
  Button,
  CardBody,
  CardFooter,
  CardTitle,
  Card,
  EmptyState,
  EmptyStateBody,
  ExpandableSection,
  Label,
  List,
  ListItem,
  Text,
  Title,
  Flex,
  FlexItem,
  PageSection,
  CardHeader,
  Spinner,
  TextContent,
  TextVariants,
  Divider,
  Stack,
  Hint,
} from '@patternfly/react-core';
import { CubeIcon } from '@patternfly/react-icons';
import { Link, Redirect } from 'react-router-dom';
import ExternalLink from '~/components/common/ExternalLink';
import RedHatLogo from '~/styles/images/Logo-Red_Hat-B-Standard-RGB.png';
import AWSLogo from '~/styles/images/AWSLogo';
import { AppPage } from '~/components/App/AppPage';
import clusterService from '../../../services/clusterService';
import { ListTextLabelLinkCard } from '../../common/ListTextLabelLinkCard/ListTextLabelLinkCard';
import ProductBanner from '../../common/ProductBanner';
import docLinks from '../../../common/installLinks.mjs';
import OpenShiftProductIcon from '../../../styles/images/OpenShiftProductIcon.svg';

const rosaBannerContents = {
  icon: <img src={OpenShiftProductIcon} alt="OpenShift" />,
  learnMoreLink: <ExternalLink href={docLinks.WHAT_IS_ROSA}>Learn more</ExternalLink>,
  title: 'Red Hat OpenShift Service on AWS (ROSA)',
  text: 'Build applications faster with self-service provisioning, automatic security enforcement, and streamlined deployment.',
  iconCardBodyClassName: 'rosa-aws-redhat-vertical-logo',
};

const TryRosaCard = () => (
  <Card style={{ height: '100%' }}>
    <CardHeader>
      <CardTitle>
        <Title headingLevel="h4">Want a preview of ROSA?</Title>
      </CardTitle>
    </CardHeader>
    <CardBody>Access a no-cost hands-on experience with Red Hat OpenShift Service on AWS.</CardBody>
    <CardFooter>
      <Button
        variant="secondary"
        component={(props) => (
          <Link {...props} data-testid="register-cluster" to="/services/rosa/demo/" />
        )}
        isLarge
      >
        Try for 8 hours
      </Button>
    </CardFooter>
  </Card>
);

const AWSRedHatVerticalLogo = () => (
  <Stack hasGutter>
    <span>
      <img src={RedHatLogo} alt="Red Hat Icon" style={{ height: '3em', width: '5em' }} />
    </span>
    <Divider />
    <AWSLogo height="2.5em" width="5em" />
  </Stack>
);

const benefitsExpandableContents = [
  {
    title: 'Self-service deployment',
    contents:
      'Create fully-managed OpenShift clusters in minutes with self-service deployment from the AWS Console, so you can get up and running quickly.',
  },
  {
    title: 'Seamless integration with other AWS services',
    contents:
      'A native AWS service accessed on demand from the AWS Management Console so you can get up and running quickly. Take advantage of seamless integration with other AWS cloud native services.',
  },
  {
    title: 'Maximum availability',
    contents:
      'Deploy clusters across multiple Availability Zones in supported regions to maximize availability.',
  },
];

const featuresExpandableContents = [
  {
    title: 'Deploy applications where they need to be',
    contents:
      'Red Hat OpenShift Service on AWS delivers the production-ready application platform that many enterprises already use on-premises, simplifying the ability to shift workloads to the AWS public cloud as business needs dictate.',
  },
  {
    title: 'Flexible consumption-based pricing',
    contents:
      'Scale as per your business needs and pay as you go with flexible pricing with an on-demand hourly or annual billing model.',
  },
  {
    title: 'Fully-managed service',
    contents:
      'Focus on applications, not infrastructure, by using the fully-managed OpenShift service backed by enterprise class SLA.',
  },
];

const linkTextLabelLinkCardContents = {
  cardClassName: 'pf-u-mb-lg',
  textLabelLinkItems: [
    {
      listItemText: 'Product Documentation for Red Hat OpenShift Service on AWS 4',
      listItemLabel: <Label color="gold">Documentation</Label>,
      listItemLink: <ExternalLink href={docLinks.ROSA_CP_DOCS}>Learn More</ExternalLink>,
    },
    {
      listItemText: 'Red Hat OpenShift Service on AWS quickstart guide',
      listItemLabel: <Label color="green">Quickstart</Label>,
      listItemLink: <ExternalLink href={docLinks.ROSA_QUICKSTART}>Learn More</ExternalLink>,
    },
    {
      listItemText: 'Troubleshooting installations',
      listItemLabel: <Label color="gold">Documentation</Label>,
      listItemLink: (
        <ExternalLink href={docLinks.ROSA_TROUBLESHOOTING_INSTALLATIONS}>Learn More</ExternalLink>
      ),
    },
    {
      listItemText: 'Red Hat OpenShift Service on AWS service definition',
      listItemLabel: <Label color="gold">Documentation</Label>,
      listItemLink: <ExternalLink href={docLinks.ROSA_DEFINITION_DOC}>Learn More</ExternalLink>,
    },
  ],
};

function RosaServicePageEmptyState() {
  const [isLoading, setIsLoading] = useState(true);
  const [rosaClusterExists, setRosaClusterExists] = useState(false);
  useEffect(() => {
    clusterService
      .getClusters("product.id='rosa'", 0)
      .then((response) => {
        if (response.data.total) setRosaClusterExists(true);
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => setIsLoading(false));
  }, []);

  const expandableListArray = (expandableContentArray) => (
    <Card>
      <List isPlain isBordered>
        {expandableContentArray.map(({ title, contents }) => (
          <ListItem className="rosa-expandable-list-item">
            <ExpandableSection
              className="rosa-expandable-section"
              toggleContent={<Text component={TextVariants.h3}>{title}</Text>}
              displaySize="large"
            >
              {contents}
            </ExpandableSection>
          </ListItem>
        ))}
      </List>
    </Card>
  );

  if (isLoading) {
    return (
      <AppPage>
        <EmptyState>
          <EmptyStateBody>
            <Spinner centered />
          </EmptyStateBody>
        </EmptyState>
      </AppPage>
    );
  }

  if (rosaClusterExists) {
    return <Redirect to="/" />;
  }

  return (
    <AppPage>
      <ProductBanner
        icon={AWSRedHatVerticalLogo()}
        learnMoreLink={rosaBannerContents.learnMoreLink}
        title={rosaBannerContents.title}
        text={rosaBannerContents.text}
        iconCardBodyClassName={rosaBannerContents.iconCardBodyClassName}
      />
      <PageSection>
        <TextContent className="pf-u-mb-lg">
          <Title headingLevel="h2">Get started with ROSA</Title>
          Currently, you have <span className="pf-u-font-weight-bold">0 ROSA clusters.</span>{' '}
          We&#39;re here to help you get started.
        </TextContent>
        <Flex>
          <FlexItem flex={{ default: 'flex_1' }}>
            <Card>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                <FlexItem>
                  <CardHeader>
                    <CardTitle>
                      <Title headingLevel="h4">
                        <CubeIcon isInline size="md" className="pf-u-mr-sm rosa-cube-icon" />
                        Create your first ROSA cluster
                      </Title>
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    Get back to focusing on your application when you build a ROSA cluster.
                    We&#39;ll manage and maintain the cluster for you.
                  </CardBody>
                  <CardFooter>
                    <Flex>
                      <FlexItem>
                        <Button
                          variant="primary"
                          component={(props) => (
                            <Link
                              {...props}
                              data-testid="register-cluster"
                              to="/create/rosa/getstarted"
                            />
                          )}
                          isLarge
                        >
                          View prerequisites
                        </Button>
                      </FlexItem>
                    </Flex>
                  </CardFooter>
                </FlexItem>
              </Flex>
            </Card>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }} alignSelf={{ default: 'alignSelfStretch' }}>
            <TryRosaCard />
          </FlexItem>
        </Flex>
        <Title className="pf-u-mt-lg pf-u-mb-lg" headingLevel="h2">
          Benefits
        </Title>
        <Card>{expandableListArray(benefitsExpandableContents)}</Card>

        <Title className="pf-u-mt-lg pf-u-mb-lg" headingLevel="h2">
          Features
        </Title>
        <Card>{expandableListArray(featuresExpandableContents)}</Card>

        <Hint className="pf-u-mt-lg">
          <span>
            Curious about pricing options for ROSA?{' '}
            <ExternalLink noIcon href={docLinks.ROSA_PRICING}>
              {' '}
              Learn more about our pricing models here.
            </ExternalLink>
          </span>
        </Hint>

        <Title headingLevel="h2" className="pf-u-mt-lg pf-u-mb-lg">
          Recommended content
        </Title>

        <ListTextLabelLinkCard {...linkTextLabelLinkCardContents} />
      </PageSection>
    </AppPage>
  );
}

export default RosaServicePageEmptyState;
