import { DemoExperience, DemoExperienceStatusEnum } from './DemoExperienceModels';

export type AugmentedDemoExperienceStatus = DemoExperienceStatusEnum | 'quota-exceeded';

export type AugmentedDemoExperience = Omit<DemoExperience, 'status'> & {
  status: AugmentedDemoExperienceStatus;
};
