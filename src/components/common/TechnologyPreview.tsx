import React from 'react';

import { Bullseye, Spinner } from '@patternfly/react-core';
import { ScalprumComponent } from '@scalprum/react-core';

const TechnologyPreview = ({ className }: { className?: string }) => {
  const techPreviewProps = {
    className: className ?? '',
  };

  return (
    <ScalprumComponent
      {...techPreviewProps}
      scope="assistedInstallerApp"
      module="./TechnologyPreview"
      fallback={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
    />
  );
};

export default TechnologyPreview;
