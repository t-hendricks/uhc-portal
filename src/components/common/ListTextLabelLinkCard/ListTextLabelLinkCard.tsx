/* eslint-disable arrow-body-style */
import React, { ReactNode } from 'react';
import { Card, List, ListItem, Split, SplitItem } from '@patternfly/react-core';

export type TextLabelLinkItem = {
  listItemText: string;
  listItemLabel: ReactNode;
  listItemLink: ReactNode;
};

export type ListTextLabelLinkCardProps = {
  cardClassName: string;
  textLabelLinkItems: TextLabelLinkItem[];
};

export function ListTextLabelLinkCard(props: ListTextLabelLinkCardProps) {
  const { cardClassName, textLabelLinkItems } = props;

  return (
    <Card className={cardClassName}>
      <List isPlain isBordered>
        {textLabelLinkItems.length &&
          textLabelLinkItems.map(({ listItemText, listItemLabel, listItemLink }, index) => {
            let splitClassName = 'pf-u-pt-md pf-u-pr-md pf-u-pb-md pf-u-pl-md';
            if (index === textLabelLinkItems.length - 1) {
              splitClassName += ' pf-u-pb-lg';
            }
            if (index === 0) {
              splitClassName += ' pf-u-pt-lg';
            }

            return (
              <ListItem>
                <Split className={splitClassName} hasGutter>
                  <SplitItem style={{ width: '60%' }}>
                    <Split>
                      <SplitItem>{listItemText}</SplitItem>
                      <SplitItem isFilled />
                      <SplitItem>{listItemLabel}</SplitItem>
                    </Split>
                  </SplitItem>
                  <SplitItem style={{ width: '40%' }}>
                    <Split>
                      <SplitItem />
                      <SplitItem isFilled />
                      <SplitItem>{listItemLink}</SplitItem>
                    </Split>
                  </SplitItem>
                </Split>
              </ListItem>
            );
          })}
      </List>
    </Card>
  );
}
