import React from 'react';

import {
  Card,
  CardBody,
  Title,
  Text,
  TextContent,
  TextVariants,
  Form,
} from '@patternfly/react-core';

import links from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';
import { CheckboxField } from '~/components/clusters/wizards/form';

interface RosaServiceScreenProps {
  hideTitle?: boolean;
}

export const RosaServiceScreen = ({ hideTitle = false }: RosaServiceScreenProps) => {
  const validateRosaEnabled = (value: string) => {
    if (!value) {
      return 'Acknowledge that you have enabled ROSA services.';
    }

    return undefined;
  };

  return (
    <Form>
      <Card isCompact isPlain>
        <CardBody>
          <TextContent>
            {!hideTitle && <Title headingLevel="h2">Enable ROSA Service</Title>}
            <Text component={TextVariants.p}>
              Make sure your ROSA service is already enabled in your AWS account.
              <p>
                Check ROSA service status in the{' '}
                <ExternalLink noIcon href={links.AWS_CONSOLE}>
                  AWS console
                </ExternalLink>
                .
              </p>
            </Text>
          </TextContent>

          <div className="pf-u-pl-lg pf-u-pt-md">
            <CheckboxField
              name="rosaEnabled"
              label="I've enabled ROSA service in my AWS account."
              validate={validateRosaEnabled}
            />
          </div>
        </CardBody>
      </Card>
    </Form>
  );
};
