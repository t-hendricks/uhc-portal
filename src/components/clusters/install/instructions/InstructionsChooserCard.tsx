import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Card,
  CardTitle,
  CardBody,
  Title,
  Flex,
  List,
  ListItem,
  CardFooter,
} from '@patternfly/react-core';
import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';
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
  const history = useHistory();
  return (
    <Card
      id={id}
      className="infra-card"
      isSelectableRaised
      role="link"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onClick={() => history.push(href)}
      onKeyUp={(event) => event.key === 'Enter' && history.push(href)}
    >
      <CardTitle id={`${id}-title`}>
        <Title headingLevel="h2">{title}</Title>
        <Flex spaceItems={{ default: 'spaceItemsSm' }}>{labels}</Flex>
      </CardTitle>
      <CardBody id={`${id}-description`}>
        {body}
        <List isPlain className={`${spacing.mtLg} ${spacing.ml_0} ${spacing.pl_0}`}>
          {featureListItems.map((item, index) => (
            <ListItem
              // These can be arbitrary JSX (no easy string key to use) and they will never change order once the page is rendered, so it is safe to use the array index as the key
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              icon={<CheckIcon color="var(--pf-global--palette--green-400)" size="md" />}
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
