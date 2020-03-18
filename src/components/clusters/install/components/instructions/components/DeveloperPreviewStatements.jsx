import React from 'react';

const DeveloperPreviewStatements = () => (
  <>
    <p>
      Because these are developer preview builds:
    </p>
    <ul className="dev-preview-warnings">
      <li>
        Production use is not permitted.
      </li>
      <li>
        Installation and use is not eligible for Red Hat production support.
      </li>
      <li>
        Clusters installed at pre-release versions cannot be upgraded.
        As we approach a GA milestone with these nightly builds, we will
        allow upgrades from a nightly to a nightly; however, we will not
        support an upgrade from a nightly to the final GA build of OCP.
      </li>
    </ul>
  </>
);

export default DeveloperPreviewStatements;
