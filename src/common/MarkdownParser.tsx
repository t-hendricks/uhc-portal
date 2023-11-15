import React from 'react';
import { TextContent } from '@patternfly/react-core';
import ReactMarkdown, { PluggableList } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import ExternalLink from '~/components/common/ExternalLink';

type MarkdownParserProps = {
  rehypePlugins?: PluggableList | undefined;
  children?: string;
};

const MarkdownParser = ({ children, rehypePlugins }: MarkdownParserProps) =>
  children ? (
    <TextContent>
      <ReactMarkdown
        className="markdown"
        rehypePlugins={rehypePlugins ?? [remarkGfm, rehypeRaw]}
        components={{
          // map a link to ExternalLink
          a: (props) => (
            <ExternalLink {...props} href={props.href ?? ''}>
              {props.children}
            </ExternalLink>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </TextContent>
  ) : (
    <></>
  );

export default MarkdownParser;
