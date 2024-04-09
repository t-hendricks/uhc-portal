import React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Flex,
  Icon,
  List,
  ListItem,
  Title,
} from '@patternfly/react-core';
import CheckIcon from '@patternfly/react-icons/dist/esm/icons/check-icon';

import ExternalLink from '~/components/common/ExternalLink';

interface InstructionsChooserCardProps {
  id: string;
  href: string;
  title: React.ReactNode;
  labels: React.ReactNode;
  body: React.ReactNode;
  featureListItems: React.ReactNode[];
  footerLinkHref?: string;
  footerLinkText?: React.ReactNode;
}

export const InstructionsChooserCard = ({
  id,
  href,
  title,
  labels,
  body,
  featureListItems,
  footerLinkHref,
  footerLinkText,
}: InstructionsChooserCardProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(href);
  };
  const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      navigate(href);
    }
  };

  return (
    <Card
      id={id}
      className="infra-card"
      isSelectableRaised
      role="link"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onClick={handleClick}
      onKeyUp={handleEnterKeyPress}
    >
      <CardTitle id={`${id}-title`}>
        <Title headingLevel="h2">{title}</Title>
        <Flex spaceItems={{ default: 'spaceItemsSm' }}>{labels}</Flex>
      </CardTitle>
      <CardBody id={`${id}-description`}>
        {body}
        <List isPlain className="pf-v5-u-mt-lg pf-v5-u-ml-0 pf-v5-u-pl-0">
          {featureListItems.map((item, index) => (
            <ListItem
              // These can be arbitrary JSX (no easy string key to use) and they will never change order once the page is rendered, so it is safe to use the array index as the key
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              icon={
                <Icon size="md">
                  <CheckIcon color="var(--pf-v5-global--palette--green-400)" />
                </Icon>
              }
            >
              {item}
            </ListItem>
          ))}
        </List>
      </CardBody>
      {footerLinkHref && (
        <CardFooter>
          <ExternalLink href={footerLinkHref} stopClickPropagation>
            {footerLinkText}
          </ExternalLink>
        </CardFooter>
      )}
    </Card>
  );
};
