import React from 'react';
import { Label, LabelProps } from '@patternfly/react-core';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';

export const GA_DATE = new Date('2023-11-01T00:00:00Z');

export const createdPostGa = (creationDateStr: string) => {
  const creationDate = creationDateStr ? new Date(creationDateStr) : new Date();
  return creationDate >= GA_DATE;
};

interface PreviewLabelProps extends LabelProps {
  creationDateStr: string;
}

export const PreviewLabel = (props: PreviewLabelProps) => {
  const { creationDateStr, ...rest } = props;
  return createdPostGa(creationDateStr) ? null : (
    <Label
      color="green"
      icon={<InfoCircleIcon />}
      render={({ className, content }) => (
        <a
          className={className}
          href="https://access.redhat.com/support/offerings/techpreview"
          target="_blank"
          rel="noreferrer"
        >
          {content}
        </a>
      )}
      {...rest}
    >
      Preview
    </Label>
  );
};
