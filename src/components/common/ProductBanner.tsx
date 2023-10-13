import {
  CardBody,
  CardFooter,
  CardTitle,
  Divider,
  Flex,
  FlexItem,
  Stack,
  StackItem,
  Text,
  Title,
} from '@patternfly/react-core';
import React from 'react';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';

export type ProductBannerProps = {
  icon?: React.ReactNode;
  learnMoreLink?: React.ReactNode;
  title?: string;
  text?: string | React.ReactNode;
  iconCardBodyClassName?: string;
  breadcrumbs?: React.ReactNode;
};

export const ProductBanner = (props: ProductBannerProps) => {
  const { icon, learnMoreLink, title, text, iconCardBodyClassName, breadcrumbs } = props;
  return (
    <PageHeader>
      {breadcrumbs}
      <Flex>
        <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
          <CardBody className={iconCardBodyClassName}>{icon}</CardBody>
        </FlexItem>
        <Divider
          orientation={{
            default: 'vertical',
          }}
        />
        <FlexItem>
          <Stack hasGutter>
            <StackItem isFilled>
              <CardTitle>
                <Title headingLevel="h1">{title}</Title>
              </CardTitle>
            </StackItem>
            <StackItem isFilled>
              <CardBody>
                <Text>{text}</Text>
              </CardBody>
            </StackItem>
            <StackItem>
              <CardFooter>{learnMoreLink}</CardFooter>
            </StackItem>
          </Stack>
        </FlexItem>
      </Flex>
    </PageHeader>
  );
};
