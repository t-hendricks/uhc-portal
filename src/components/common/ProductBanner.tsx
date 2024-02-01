import {
  CardBody,
  CardFooter,
  CardTitle,
  Divider,
  Split,
  SplitItem,
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
  dataTestId?: string;
};

export const ProductBanner = (props: ProductBannerProps) => {
  const { icon, learnMoreLink, title, text, iconCardBodyClassName, breadcrumbs, dataTestId } =
    props;
  return (
    <PageHeader>
      {breadcrumbs}
      <Split data-testid={dataTestId}>
        <SplitItem className="pf-v5-u-pr-md">
          <CardBody className={iconCardBodyClassName}>{icon}</CardBody>
        </SplitItem>
        <Divider
          orientation={{
            default: 'vertical',
          }}
        />
        <SplitItem className="pf-v5-u-pl-md">
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
        </SplitItem>
      </Split>
    </PageHeader>
  );
};
