import React from 'react';
import { LinkIcon } from '@patternfly/react-icons';
import { Title, Split, SplitItem } from '@patternfly/react-core';
import { HashLink as Link } from 'react-router-hash-link';
import { useLocation } from 'react-router-dom';
import './TitleWithLink.scss';

type Props = {
  headingLevel: React.ComponentProps<typeof Title>['headingLevel'];
  size: React.ComponentProps<typeof Title>['size'];
  id: string;
  text: string;
};

const TitleWithLink = ({ headingLevel, size, id, text }: Props) => {
  const titleRef = React.useRef<HTMLElement>(null);
  const { pathname, hash } = useLocation();

  React.useLayoutEffect(() => {
    // only scroll if the user hasn't managed to scroll manually before we got here
    if (hash === `#${id}` && document.getElementById('root')?.scrollTop === 0) {
      titleRef.current?.scrollIntoView();
    }
    // only run once on load
  }, []);

  return (
    <Split hasGutter className="title-with-link">
      <SplitItem>
        {/* ref on the span cause it can't be on a function component
          and the Link is visible only on hover */}
        <span ref={titleRef} />
        <Title id={id} headingLevel={headingLevel} size={size}>
          {text}
        </Title>
      </SplitItem>
      <SplitItem className="show-on-hover">
        <Link to={`${pathname}#${id}`} smooth>
          <LinkIcon />
        </Link>
      </SplitItem>
    </Split>
  );
};

export default TitleWithLink;
