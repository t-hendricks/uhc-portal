import React, { ReactNode } from 'react';

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

type ProductCardProps = {
  title: string;
  description: string;
  icon?: string;
  labelText?: string;
  drawerPanelContent?: ReactNode;
  openReadMore: (title: string, content: ReactNode) => void;
};

const ProductCard = ({
  title,
  description,
  icon,
  labelText,
  drawerPanelContent,
  openReadMore,
}: ProductCardProps) => (
  <Card className="product-overview-card">
    <CardHeader>
      <Split hasGutter style={{ width: '100%' }}>
        <SplitItem>
          <img src={icon} alt={`${title} icon`} className="product-overview-card__icon" />
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
      {/* todo: check card's title size and positioning */}
      <Title headingLevel="h3">{title}</Title>
    </CardTitle>
    <CardBody>{description}</CardBody>
    <CardFooter>
      {/* todo: think about the icon size */}
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
