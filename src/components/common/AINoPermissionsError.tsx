import React from 'react';

import { Bullseye, Spinner } from '@patternfly/react-core';
import { ScalprumComponent } from '@scalprum/react-core';

const AINoPermissionsError = () => (
  <ScalprumComponent
    scope="assistedInstallerApp"
    module="./NoPermissionsError"
    fallback={
      <Bullseye>
        <Spinner />
      </Bullseye>
    }
  />
);

export default AINoPermissionsError;
