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

type ProductBannerProps = {
  icon?: React.ReactNode;
  learnMoreLink?: React.ReactNode;
  title?: string;
  text?: string | React.ReactNode;
  iconCardBodyClassName?: string;
};

const ProductBanner = (props: ProductBannerProps) => {
  const { icon, learnMoreLink, title, text, iconCardBodyClassName } = props;
  return (
    <Card>
      <Flex>
        <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
          <CardBody className={iconCardBodyClassName}>{icon}</CardBody>
        </FlexItem>
        <Divider
          orientation={{
            default: 'vertical',
          }}
          inset={{ default: 'inset2xl' }}
        />
        <FlexItem>
          <CardTitle>
            <Title headingLevel="h1">{title}</Title>
          </CardTitle>
          <CardBody>
            <Text>{text}</Text>
          </CardBody>
          <CardFooter>{learnMoreLink}</CardFooter>
        </FlexItem>
      </Flex>
    </Card>
  );
};

export default ProductBanner;
