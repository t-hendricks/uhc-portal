import React from 'react';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
  Split,
  SplitItem,
  Title,
} from '@patternfly/react-core';
import { OpenDrawerRightIcon } from '@patternfly/react-icons';

import { DrawerPanelContentNode } from '../RecommendedOperatorsCards/DrawerPanelContent';

type ProductCardProps = {
  title: string;
  description: string;
  logo?: string;
  labelText?: string;
  drawerPanelContent?: DrawerPanelContentNode;
  openReadMore: (title: string, content?: DrawerPanelContentNode) => void;
};

const ProductCard = ({
  title,
  description,
  logo,
  labelText,
  drawerPanelContent,
  openReadMore,
}: ProductCardProps) => (
  <Card className="product-overview-card">
    <CardHeader>
      <Split hasGutter style={{ width: '100%' }}>
        <SplitItem>
          <img src={logo} alt={`${title} logo`} className="product-overview-card__logo" />
        </SplitItem>
        <SplitItem isFilled />
        <SplitItem>
          {labelText ? (
            <Label data-testtag="label" color="blue">
              {labelText}
            </Label>
          ) : null}
        </SplitItem>
      </Split>
    </CardHeader>
    <CardTitle>
      <Title headingLevel="h3">{title}</Title>
    </CardTitle>
    <CardBody>{description}</CardBody>
    <CardFooter>
      <Button
        className="read-more-button"
        onClick={() => openReadMore(title, drawerPanelContent)}
        variant="link"
        icon={<OpenDrawerRightIcon />}
        iconPosition="end"
      >
        Read more
      </Button>
    </CardFooter>
  </Card>
);

export default ProductCard;
