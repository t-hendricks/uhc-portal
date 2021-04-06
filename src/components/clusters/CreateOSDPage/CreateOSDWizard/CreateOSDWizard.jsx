import PropTypes from 'prop-types';
import React from 'react';
import { Wizard } from '@patternfly/react-core';
import BillingModelSection from '../CreateOSDForm/FormSections/BillingModelSection/BillingModelSection';

class CreateOSDWizard extends React.Component {
  state = {
    currentStep: 0,
  }

  render() {
    const { currentStep } = this.state;
    const steps = [
      { name: 'Billing model', component: <BillingModelSection isWizard /> },
      { name: 'Cluster settings', component: <p>Step 2 content</p> },
      { name: 'Networking', component: <p>Step 3 content</p> },
      { name: 'Default machine pool', component: <p>Step 4 content</p> },
      { name: 'Review and create', component: <p>Review step content</p>, nextButtonText: 'Finish' }
    ];
    const title = 'Create OpenShift Dedicated cluster wizard';
    return (
      <Wizard
        navAriaLabel={`${title} steps`}
        mainAriaLabel={`${title} content`}
        steps={steps}
      />
    );
  }
}

export default CreateOSDWizard;
