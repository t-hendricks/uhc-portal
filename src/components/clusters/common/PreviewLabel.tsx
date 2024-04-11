import React from 'react';

import MarkdownParser from '~/common/MarkdownParser';
import SupportLevelBadge from '~/components/common/SupportLevelBadge';
import { useGetTechPreviewStatus, useTechPreviewStatus } from '~/redux/hooks';

// Only exported for testing
// This is used ONLY if the api call fails to return a GA date
export const GA_DATE_STR = '2023-12-04T00:00:00Z';

export const createdPostGa = (creationDateStr: string, gaDateStr: string) => {
  const creationDate = creationDateStr ? new Date(creationDateStr) : new Date();
  const gaDate = gaDateStr ? new Date(gaDateStr) : new Date();
  return creationDate >= gaDate;
};

interface PreviewLabelProps {
  creationDateStr: string;
  product?: string;
  type?: string;
  text?: string;
  className?: string;
}

export const PreviewLabel = (props: PreviewLabelProps) => {
  const { className, creationDateStr, product, text, type } = props;
  const getPreview = useGetTechPreviewStatus(product || 'rosa', type || 'hcp');

  const techPreview = useTechPreviewStatus(product || 'rosa', type || 'hcp');

  React.useEffect(() => {
    if (!techPreview) {
      getPreview();
    }
  }, [getPreview, techPreview]);

  if (techPreview?.fulfilled) {
    const gaDate = techPreview?.end_date || GA_DATE_STR;
    const popover = <MarkdownParser>{techPreview.additional_text || ''}</MarkdownParser>;
    return createdPostGa(creationDateStr, gaDate) ? null : (
      <SupportLevelBadge
        text={text || 'Technology Preview'}
        popoverContent={popover}
        className={className}
      />
    );
  }
  return null;
};
