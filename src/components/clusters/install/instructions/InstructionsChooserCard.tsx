import React from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardTitle, CardBody, Title, Flex, List, ListItem } from '@patternfly/react-core';
import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';
import CheckIcon from '@patternfly/react-icons/dist/esm/icons/check-icon';

interface InstructionsChooserCardProps {
  id: string;
  href: string;
  title: React.ReactNode;
  labels: React.ReactNode;
  body: React.ReactNode;
  featureListItems: string[];
  footerLinkHref: string;
  footerLinkText: React.ReactNode;
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
          {featureListItems.map((item) => (
            <ListItem
              key={item}
              icon={<CheckIcon color="var(--pf-global--palette--green-400)" size="md" />}
            >
              {item}
            </ListItem>
          ))}
        </List>
      </CardBody>
      {/*
      // TODO restore this footer when we have URLs for documentation links for each card. See https://issues.redhat.com/browse/HAC-2403
      <CardFooter>
        <ExternalLink href={footerLinkHref} stopClickPropagation>
          {footerLinkText}
        </ExternalLink>
      </CardFooter>
      */}
    </Card>
  );
};
