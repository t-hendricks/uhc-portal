import { createContext } from 'react';

export const ROSAWizardContext = createContext({
  forceLeaveWizard: undefined,
  setForceLeaveWizard: (forceLeave: boolean) => undefined,
});
