import config from '~/config';

import apiRequest from '../../services/apiRequest';
import { DemoExperience } from './DemoExperienceModels';

const URL = '/demoExperience/rosa-hands-on';

const getDemoExperience = () =>
  apiRequest.get<DemoExperience>(URL, { baseURL: config.configData.demoExperience });

const requestExperience = () =>
  apiRequest.post<DemoExperience>(URL, {}, { baseURL: config.configData.demoExperience });

const demoExperienceService = {
  getDemoExperience,
  requestExperience,
};

export default demoExperienceService;
