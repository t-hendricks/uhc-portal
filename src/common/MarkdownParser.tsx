import React, { useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { TextContent } from '@patternfly/react-core';

import ExternalLink from '~/components/common/ExternalLink';

type MarkdownParserProps = {
  rehypePlugins?: import('unified').PluggableList | undefined;
  children?: string;
};

const MarkdownParser = ({ children, rehypePlugins }: MarkdownParserProps) => {
  const LinkComponent = useCallback(
    (props) => (
      <ExternalLink {...props} href={props.href ?? ''}>
        {props.children}
      </ExternalLink>
    ),
    [],
  );

  return children ? (
    <TextContent>
      <ReactMarkdown
        className="markdown"
        rehypePlugins={rehypePlugins ?? [remarkGfm, rehypeRaw]}
        components={{
          // map a link to ExternalLink
          a: LinkComponent,
        }}
      >
        {children}
      </ReactMarkdown>
    </TextContent>
  ) : null;
};

export default MarkdownParser;
