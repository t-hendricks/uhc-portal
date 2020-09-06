import React from 'react';
import PropTypes from 'prop-types';
import { LinkIcon } from '@patternfly/react-icons';
import { Title, Split, SplitItem } from '@patternfly/react-core';
import { HashLink as Link } from 'react-router-hash-link';

const TitleWithLink = (props) => {
  const {
    headingLevel,
    size,
    id,
    text,
    pathname,
  } = props;

  return (
    <Split hasGutter className="title-with-link">
      <SplitItem>
        <Title
          id={id}
          headingLevel={headingLevel}
          size={size}
        >
          {text}
        </Title>
      </SplitItem>
      <SplitItem className="show-on-hover">
        <Link
          to={`${pathname}#${id}`}
          smooth
        >
          <LinkIcon />
        </Link>
      </SplitItem>
    </Split>
  );
};

TitleWithLink.propTypes = {
  headingLevel: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
};

export default TitleWithLink;
