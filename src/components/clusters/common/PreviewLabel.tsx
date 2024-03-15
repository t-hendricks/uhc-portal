import React from 'react';
import { Label, LabelProps } from '@patternfly/react-core';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import { useGetTechPreviewStatus, useTechPreviewStatus } from '~/redux/hooks';

// Only exported for testing
// This is used ONLY if the api call fails to return a GA date
export const GA_DATE_STR = '2023-12-04T00:00:00Z';

export const createdPostGa = (creationDateStr: string, gaDateStr: string) => {
  const creationDate = creationDateStr ? new Date(creationDateStr) : new Date();
  const gaDate = gaDateStr ? new Date(gaDateStr) : new Date();
  return creationDate >= gaDate;
};

interface PreviewLabelProps extends LabelProps {
  creationDateStr: string;
  product?: string;
  type?: string;
}

export const PreviewLabel = (props: PreviewLabelProps) => {
  const { creationDateStr, product, type, ...rest } = props;
  const getPreview = useGetTechPreviewStatus(product || 'rosa', type || 'hcp');

  const techPreview = useTechPreviewStatus(product || 'rosa', type || 'hcp');

  React.useEffect(() => {
    if (!techPreview) {
      getPreview();
    }
  }, [getPreview, techPreview]);

  if (techPreview?.fulfilled) {
    const gaDate = techPreview?.end_date || GA_DATE_STR;
    return createdPostGa(creationDateStr, gaDate) ? null : (
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
  }
  return null;
};
