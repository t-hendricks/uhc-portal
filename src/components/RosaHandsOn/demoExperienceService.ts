import { AxiosResponse } from 'axios';

import config from '~/config';

import apiRequest from '../../services/apiRequest';
import { DemoExperience, DemoExperienceStatusEnum } from './DemoExperienceModels';
import { AugmentedDemoExperienceStatus, AugmentedDemoExperience } from './augmentedModelTypes';

const getAugmentedDemoExperienceStatus = (
  demoExperience: DemoExperience,
): AugmentedDemoExperienceStatus =>
  demoExperience.status === DemoExperienceStatusEnum.Unavailable &&
  demoExperience.quota.current >= demoExperience.quota.limit
    ? 'quota-exceeded'
    : demoExperience.status;

const URL = '/demoExperience/rosa-hands-on';

const deserialize = (demoExperience: DemoExperience): AugmentedDemoExperience => ({
  ...demoExperience,
  status: getAugmentedDemoExperienceStatus(demoExperience),
});

const getDemoExperience = async (): Promise<AxiosResponse<AugmentedDemoExperience>> => {
  const response = await apiRequest.get<DemoExperience>(URL, {
    baseURL: config.configData.demoExperience,
  });
  return { ...response, data: deserialize(response.data) };
};

const requestExperience = () =>
  apiRequest.post<DemoExperience>(URL, {}, { baseURL: config.configData.demoExperience });

const demoExperienceService = {
  getDemoExperience,
  requestExperience,
};

export default demoExperienceService;
