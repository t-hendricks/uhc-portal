import React from 'react';
import {
  Card,
  CardBody,
  Title,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';

interface RosaServiceScreenProps {
  hideTitle?: boolean;
}

export const RosaServiceScreen = ({ hideTitle = false }: RosaServiceScreenProps) => (
    <Card isCompact isPlain>
      <CardBody>
        <TextContent>
          {!hideTitle && <Title headingLevel="h2">Enable ROSA Service</Title>}
          <Text component={TextVariants.p}>
            Make sure your ROSA service is already enabled in your AWS account.
            <p>
              Check ROSA service status in the{" "}
              <ExternalLink noIcon href={links.AWS_CONSOLE}>
                AWS console
              </ExternalLink>.
            </p>
          </Text>
        </TextContent>
      </CardBody>
      <CardBody>
        <TextContent>
          <Text component={TextVariants.p} className="pf-u-pl-lg">
            <input type="checkbox" className="pf-u-pr-md"/> I&apos;ve enabled ROSA service in my AWS account and am ready to continue creating my cluster.
          </Text>
        </ TextContent>
      </CardBody>
    </Card>
  );
