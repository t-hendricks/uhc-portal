import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Divider,
  Flex,
  FlexItem,
  Text,
  Title,
} from '@patternfly/react-core';
import React from 'react';
import OpenShiftProductIcon from '../../../../styles/images/OpenShiftProductIcon.svg';
import docLinks from '../../../../common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  graphicRight?: boolean;
  hasGraphic?: boolean;
  dark1000?: boolean;
  fullBleed?: boolean;
  isWidthLimited?: boolean;
};

const OpenShiftBanner = ({
  className,
  hasGraphic,
  graphicRight,
  dark1000,
  fullBleed,
  style,
  children,
  isWidthLimited,
}: Props) => (
  <Card>
    <Flex>
      <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
        <CardBody>
          <img src={OpenShiftProductIcon} alt="Openshift" />
        </CardBody>
      </FlexItem>
      <Divider
        orientation={{
          default: 'vertical',
        }}
        inset={{ default: 'inset2xl' }}
      />
      <FlexItem>
        <CardTitle>
          <Title headingLevel="h1">OpenShift</Title>
        </CardTitle>
        <CardBody>
          <Text>
            Focus on work that matters with the industry&#39;s leading hybrid cloud application
            platform powered by Kubernetes.
            <br />
            Develop, modernize, deploy, run, and manage your applications faster and easier.
          </Text>
        </CardBody>
        <CardFooter>
          <ExternalLink href={docLinks.WHAT_IS_OPENSHIFT}>Learn more about OpenShift</ExternalLink>
        </CardFooter>
      </FlexItem>
    </Flex>
  </Card>
);

export default OpenShiftBanner;
