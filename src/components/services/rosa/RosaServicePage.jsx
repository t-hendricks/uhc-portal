import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Divider,
  ExpandableSection,
  Flex,
  FlexItem,
  Icon,
  Label,
  List,
  ListItem,
  PageSection,
  Stack,
  Text,
  TextContent,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { CubeIcon } from '@patternfly/react-icons/dist/esm/icons/cube-icon';

import { Link } from '~/common/routing';
import { AppPage } from '~/components/App/AppPage';
import Breadcrumbs from '~/components/common/Breadcrumbs';
import ExternalLink from '~/components/common/ExternalLink';
import InternalTrackingLink from '~/components/common/InternalTrackingLink';
import AWSLogo from '~/styles/images/AWSLogo';
import RedHatLogo from '~/styles/images/Logo-Red_Hat-B-Standard-RGB.png';

import docLinks from '../../../common/installLinks.mjs';
import OpenShiftProductIcon from '../../../styles/images/OpenShiftProductIcon.svg';
import { ListTextLabelLinkCard } from '../../common/ListTextLabelLinkCard/ListTextLabelLinkCard';

import { ProductBanner } from './components/ProductBanner';

import './RosaServicePage.scss';

const rosaBannerContents = {
  icon: <img src={OpenShiftProductIcon} alt="OpenShift" />,
  learnMoreLink: <ExternalLink href={docLinks.WHAT_IS_ROSA}>Learn more about ROSA</ExternalLink>,
  title: 'Red Hat OpenShift Service on AWS (ROSA)',
  text: 'Quickly build, deploy, and scale applications with our fully-managed turnkey application platform.',
  iconCardBodyClassName: 'rosa-aws-redhat-vertical-logo',
};

const TryRosaCard = () => {
  const rosaHandsOnURL = '/overview/rosa/hands-on';
  const LinkComponent = useCallback((props) => <Link {...props} to={rosaHandsOnURL} />, []);

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader>
        <CardTitle>
          <Title headingLevel="h3">Want a preview of ROSA?</Title>
        </CardTitle>
      </CardHeader>
      <CardBody>Access a no-cost, hands-on Red Hat OpenShift Service on AWS experience.</CardBody>
      <CardFooter>
        <InternalTrackingLink
          isButton
          variant="secondary"
          component={LinkComponent}
          size="lg"
          to={rosaHandsOnURL}
        >
          Try it
        </InternalTrackingLink>
      </CardFooter>
    </Card>
  );
};

const AWSRedHatVerticalLogo = () => (
  <Stack hasGutter>
    <span>
      <img src={RedHatLogo} alt="Red Hat Icon" style={{ height: '3em', width: '5em' }} />
    </span>
    <Divider />
    <AWSLogo height="2.5em" width="5em" />
  </Stack>
);

const ExpandableListCard = ({ items }) => (
  <Card>
    <List isPlain isBordered>
      {items.map(({ title, contents }) => (
        <ListItem className="rosa-expandable-list-item" key={title}>
          <ExpandableSection
            className="rosa-expandable-section"
            toggleContent={<Text component={TextVariants.h3}>{title}</Text>}
            displaySize="lg"
          >
            {contents}
          </ExpandableSection>
        </ListItem>
      ))}
    </List>
  </Card>
);
ExpandableListCard.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      contents: PropTypes.node,
    }),
  ),
};

const benefitsExpandableContents = [
  {
    title: 'Self-service deployment',
    contents:
      'Create fully-managed OpenShift clusters in minutes so you can get up and running quickly.',
  },
  {
    title: 'Seamless integration with other AWS services',
    contents:
      'A native AWS service accessed on demand from the AWS Management Console. Take advantage of seamless integration with other AWS cloud native services.',
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
      'Fully-managed OpenShift service, backed by a global Site Reliability Engineering (SRE) team and an enterprise class SLA, enabling customers to focus on applications, not managing infrastructure.',
  },
];

const linkTextLabelLinkCardContents = {
  cardClassName: 'pf-v5-u-mb-lg',
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

function RosaServicePage() {
  const createRosaClusterURL = '/create/rosa/getstarted';

  const LinkComponent = useCallback(
    (props) => <Link data-testid="register-cluster" to={createRosaClusterURL} {...props} />,
    [],
  );

  return (
    <AppPage>
      <ProductBanner
        icon={<AWSRedHatVerticalLogo />}
        learnMoreLink={rosaBannerContents.learnMoreLink}
        title={rosaBannerContents.title}
        text={rosaBannerContents.text}
        iconCardBodyClassName={rosaBannerContents.iconCardBodyClassName}
        breadcrumbs={
          <Breadcrumbs
            path={[
              { label: 'Overview', path: `/overview` },
              {
                label: 'Red Hat OpenShift Service on AWS (ROSA)',
              },
            ]}
          />
        }
      />
      <PageSection>
        <TextContent className="pf-v5-u-mb-lg">
          <Title headingLevel="h2">Get started with ROSA</Title>
        </TextContent>
        <Flex>
          <FlexItem flex={{ default: 'flex_1' }}>
            <Card>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                <FlexItem>
                  <CardHeader>
                    <CardTitle>
                      <Title headingLevel="h3">
                        <Icon size="md">
                          <CubeIcon className="pf-v5-u-mr-sm rosa-cube-icon" />
                        </Icon>
                        Create a ROSA cluster
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
                        <InternalTrackingLink
                          isButton
                          data-testid="register-cluster"
                          variant="primary"
                          to={createRosaClusterURL}
                          size="lg"
                          component={LinkComponent}
                        >
                          Begin setup
                        </InternalTrackingLink>
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
        <Title className="pf-v5-u-mt-lg pf-v5-u-mb-lg" headingLevel="h2">
          Benefits
        </Title>
        <ExpandableListCard items={benefitsExpandableContents} />

        <Title className="pf-v5-u-mt-lg pf-v5-u-mb-lg" headingLevel="h2">
          Features
        </Title>
        <ExpandableListCard items={featuresExpandableContents} />

        <Title className="pf-v5-u-mt-lg pf-v5-u-mb-lg" headingLevel="h2">
          Pricing
        </Title>
        <Flex>
          <FlexItem flex={{ default: 'flex_1' }}>
            <Card>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                <FlexItem>
                  <CardHeader>
                    <CardTitle>
                      <Title headingLevel="h3">Cost Component 1: ROSA service fees</Title>
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    Accrue on demand at an hourly rate per 4 vCPU used by worker nodes. Annual
                    contracts are also available for further discounts. ROSA service fees are
                    uniform across all supported regions.
                  </CardBody>
                </FlexItem>
              </Flex>
            </Card>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }} alignSelf={{ default: 'alignSelfStretch' }}>
            <Card isFullHeight>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                <FlexItem>
                  <CardHeader>
                    <CardTitle>
                      <Title headingLevel="h3">Cost Component 2: AWS infrastructure fees</Title>
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    Includes fees for the underlying worker nodes, infrastructure nodes, control
                    plane nodes, storage, and network.
                  </CardBody>
                </FlexItem>
              </Flex>
            </Card>
          </FlexItem>
        </Flex>

        <div className="pf-v5-u-mt-md">
          <ExternalLink href={docLinks.ROSA_PRICING}>Learn more about pricing</ExternalLink>
        </div>

        <Title headingLevel="h2" className="pf-v5-u-mt-lg pf-v5-u-mb-lg">
          Recommended content
        </Title>

        <ListTextLabelLinkCard {...linkTextLabelLinkCardContents} />
      </PageSection>
    </AppPage>
  );
}

export default RosaServicePage;
